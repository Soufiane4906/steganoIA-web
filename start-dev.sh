#!/usr/bin/env bash
set -euo pipefail

# Script minimal pour démarrer le frontend (vite) et le backend (Spring Boot via mvnw)
# Usage: ./start-dev.sh        -> démarre frontend + backend et garde le script en attente
#        ./start-dev.sh stop   -> arrête les services (utilise les PID dans logs/*.pid)
# Nécessite: bash, node/npm, Java (pour Spring Boot) et Maven wrapper présent dans backend/

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONT_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"
LOG_DIR="$ROOT_DIR/logs"

mkdir -p "$LOG_DIR"

echo "[start-dev] racine : $ROOT_DIR"

# helper
run_in_dir() {
  local dir="$1"; shift
  (cd "$dir" && eval "$@")
}

# Check prerequisites
if ! command -v node >/dev/null 2>&1; then
  echo "[start-dev] Erreur: node n'est pas installé ou n'est pas dans le PATH." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[start-dev] Erreur: npm n'est pas installé ou n'est pas dans le PATH." >&2
  exit 1
fi

if ! command -v java >/dev/null 2>&1; then
  echo "[start-dev] Attention: java n'est pas trouvé — le backend peut échouer." >&2
fi

# Try to set JAVA_HOME automatically on Windows/Git Bash if possible
# Prioritize Java 17 if multiple versions are installed
if [ -z "${JAVA_HOME-}" ] || ! "$JAVA_HOME/bin/java" -version 2>&1 | grep -q 'version "17'; then
  echo "[start-dev] JAVA_HOME non défini ou pas Java 17. Tentative d'auto-détection de Java 17..."

  # Common locations for Java on Windows
  JAVA_CANDIDATES=(
    "/c/Program Files/Java/jdk-17"
    "/c/Program Files/Eclipse Adoptium/jdk-17*"
    "/c/Program Files/Amazon Corretto/jdk17*"
    "/d/Program Files/Java/jdk-17"
  )

  FOUND_JAVA_HOME=""
  for dir in "${JAVA_CANDIDATES[@]}"; do
    # Check if the directory (or a glob match) exists
    if compgen -d "$dir" > /dev/null; then
      # Get the first match from glob
      MATCH=$(ls -d $dir | head -n 1)
      if [ -f "$MATCH/bin/java" ]; then
        echo "[start-dev] Java 17 trouvé dans '$MATCH'"
        FOUND_JAVA_HOME="$MATCH"
        break
      fi
    fi
  done

  if [ -n "$FOUND_JAVA_HOME" ]; then
    export JAVA_HOME="$FOUND_JAVA_HOME"
    echo "[start-dev] JAVA_HOME exporté vers '$JAVA_HOME'"
  else
    echo "[start-dev] Avertissement : Impossible de trouver Java 17 dans les chemins communs."
    # Fallback to previous detection method if no specific version found
    if command -v java >/dev/null 2>&1; then
      JAVA_PROPS=$(java -XshowSettings:properties -version 2>&1 || true)
      JAVA_HOME_CANDIDATE=$(echo "$JAVA_PROPS" | grep -i "java.home" | head -n1 | awk -F'=' '{gsub(/^[ \t]+|[ \t]+$/,"",$2); print $2}')
      if [ -n "$JAVA_HOME_CANDIDATE" ]; then
        export JAVA_HOME="$JAVA_HOME_CANDIDATE"
        echo "[start-dev] Repli sur la détection java.home : JAVA_HOME=$JAVA_HOME"
      fi
    fi
  fi
fi

# If JAVA_HOME is set but doesn't point to an existing dir, try to normalize Windows paths used in Git Bash (/c/... or C:\...)
if [ -n "${JAVA_HOME-}" ]; then
  if [ ! -d "$JAVA_HOME" ]; then
    echo "[start-dev] JAVA_HOME défini mais le répertoire '$JAVA_HOME' n'existe pas. Tentative de normalisation..."
    # Convert Windows-style C:\Program Files\Java to /c/Program\ Files/Java
    # Handle patterns like C:\... or C:/... or /c/...
    NORMALIZED=""
    if echo "$JAVA_HOME" | grep -qE '^[A-Za-z]:\\|^[A-Za-z]:/'; then
      # C:\Program Files -> /c/Program Files
      DRIVE=$(echo "$JAVA_HOME" | sed -E 's/^([A-Za-z]):.*$/\1/;s/.*/\L&/')
      PATH_PART=$(echo "$JAVA_HOME" | sed -E 's/^[A-Za-z]:[\\/](.*)$/\1/')
      PATH_PART=$(echo "$PATH_PART" | sed 's#\\#/#g')
      NORMALIZED="/$(echo "$DRIVE" | tr '[:upper:]' '[:lower:]')/$PATH_PART"
    elif echo "$JAVA_HOME" | grep -qE '^/[a-z]/'; then
      NORMALIZED="$JAVA_HOME"
    fi

    if [ -n "$NORMALIZED" ] && [ -d "$NORMALIZED" ]; then
      export JAVA_HOME="$NORMALIZED"
      echo "[start-dev] JAVA_HOME normalisé en $JAVA_HOME"
    else
      echo "[start-dev] Normalisation échouée ou répertoire introuvable ($NORMALIZED)." >&2
      # try fallback auto-detect using which java
      if command -v java >/dev/null 2>&1; then
        JAVA_BIN=$(command -v java || true)
        if [ -n "$JAVA_BIN" ]; then
          # try to resolve symlink
          if command -v readlink >/dev/null 2>&1; then
            RESOLVED=$(readlink -f "$JAVA_BIN" 2>/dev/null || true)
          else
            RESOLVED="$JAVA_BIN"
          fi
          if [ -n "$RESOLVED" ]; then
            CAND=$(dirname "$(dirname "$RESOLVED")")
            if [ -d "$CAND" ]; then
              export JAVA_HOME="$CAND"
              echo "[start-dev] JAVA_HOME détecté via java -> $JAVA_HOME"
            fi
          fi
        fi
      fi
    fi
  fi
fi

# Start frontend
echo "[start-dev] Démarrage du frontend..."
if [ ! -d "$FRONT_DIR" ]; then
  echo "[start-dev] Frontend introuvable dans $FRONT_DIR" >&2
else
  if [ ! -d "$FRONT_DIR/node_modules" ]; then
    echo "[start-dev] node_modules manquant, exécution de 'npm install' (cela peut prendre du temps)..."
    run_in_dir "$FRONT_DIR" "npm install"
  fi

  run_in_dir "$FRONT_DIR" "npm run dev > \"$LOG_DIR/frontend.log\" 2>&1 & echo \$! > \"$LOG_DIR/frontend.pid\""
  FRONT_PID=$(cat "$LOG_DIR/frontend.pid")
  echo "[start-dev] Frontend lancé (PID=$FRONT_PID), logs: $LOG_DIR/frontend.log"
fi

# Start backend
echo "[start-dev] Démarrage du backend..."
if [ ! -d "$BACKEND_DIR" ]; then
  echo "[start-dev] Backend introuvable dans $BACKEND_DIR" >&2
else
  MVNW="$BACKEND_DIR/mvnw"
  if [ ! -x "$MVNW" ]; then
    # sous Git Bash le fichier mvnw est exécutable en tant que script shell
    chmod +x "$MVNW" 2>/dev/null || true
  fi

  if [ -f "$MVNW" ]; then
    run_in_dir "$BACKEND_DIR" "./mvnw spring-boot:run > \"$LOG_DIR/backend.log\" 2>&1 & echo \$! > \"$LOG_DIR/backend.pid\""
  else
    echo "[start-dev] mvnw introuvable, tentative avec 'mvn spring-boot:run' (doit être installé globalement)..."
    run_in_dir "$BACKEND_DIR" "mvn spring-boot:run > \"$LOG_DIR/backend.log\" 2>&1 & echo \$! > \"$LOG_DIR/backend.pid\""
  fi

  BACKEND_PID=$(cat "$LOG_DIR/backend.pid")
  echo "[start-dev] Backend lancé (PID=$BACKEND_PID), logs: $LOG_DIR/backend.log"
fi

if [ "${1-}" = "stop" ]; then
  # stop mode (arrête si lancé avec 'stop')
  echo "[start-dev] Mode stop, arrêt des services..."
  if [ -f "$LOG_DIR/frontend.pid" ]; then
    kill "$(cat "$LOG_DIR/frontend.pid")" 2>/dev/null || true
    rm -f "$LOG_DIR/frontend.pid"
  fi
  if [ -f "$LOG_DIR/backend.pid" ]; then
    kill "$(cat "$LOG_DIR/backend.pid")" 2>/dev/null || true
    rm -f "$LOG_DIR/backend.pid"
  fi
  exit 0
fi

# Provide a simple signal trap to forward Ctrl+C and stop children
trap 'echo "[start-dev] Arrêt demandé..."; if [ -f "$LOG_DIR/frontend.pid" ]; then kill "$(cat "$LOG_DIR/frontend.pid")" 2>/dev/null || true; fi; if [ -f "$LOG_DIR/backend.pid" ]; then kill "$(cat "$LOG_DIR/backend.pid")" 2>/dev/null || true; fi; exit 0' INT TERM

echo "[start-dev] Processus démarrés. Pour suivre les logs :"
echo "  tail -f $LOG_DIR/frontend.log $LOG_DIR/backend.log"
echo "Pour arrêter tout lancer: ./start-dev.sh stop"

echo "[start-dev] Attente (Ctrl+C pour arrêter)."
while true; do sleep 3600; done
