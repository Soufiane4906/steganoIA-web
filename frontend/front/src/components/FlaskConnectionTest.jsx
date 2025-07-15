import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Refresh,
  Cloud,
  Psychology,
  Security
} from '@mui/icons-material';

const FlaskConnectionTest = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  const testFlaskConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/images/flask-status');
      const data = await response.json();
      setStatus(data);
      setLastCheck(new Date());
    } catch (error) {
      setStatus({
        flask_connected: false,
        error: error.message,
        message: "Erreur de connexion au backend Spring Boot"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testFlaskConnection();
  }, []);

  const getStatusIcon = () => {
    if (loading) return <CircularProgress size={24} />;
    if (status?.flask_connected) return <CheckCircle color="success" />;
    return <Error color="error" />;
  };

  const getStatusColor = () => {
    if (status?.flask_connected) return 'success';
    return 'error';
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="div">
            🔗 Statut de connexion Flask
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Refresh />}
            onClick={testFlaskConnection}
            disabled={loading}
          >
            Tester
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {getStatusIcon()}
          <Chip
            label={status?.flask_connected ? 'Connecté' : 'Déconnecté'}
            color={getStatusColor()}
            variant="outlined"
          />
          {lastCheck && (
            <Typography variant="caption" color="text.secondary">
              Dernière vérification: {lastCheck.toLocaleTimeString()}
            </Typography>
          )}
        </Box>

        {status?.flask_connected ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ Flask API connectée sur {status.flask_url}
          </Alert>
        ) : (
          <Alert severity="error" sx={{ mb: 2 }}>
            ❌ Flask API non disponible
            <Typography variant="body2" sx={{ mt: 1 }}>
              {status?.message || "Vérifiez que votre serveur Flask est démarré"}
            </Typography>
            {status?.error && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Erreur: {status.error}
              </Typography>
            )}
          </Alert>
        )}

        {status?.flask_connected && status?.services_available && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Services disponibles:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {status.services_available.ai_detection && (
                <Chip
                  icon={<Psychology />}
                  label="Détection IA"
                  color="primary"
                  size="small"
                />
              )}
              {status.services_available.steganography && (
                <Chip
                  icon={<Security />}
                  label="Stéganographie"
                  color="secondary"
                  size="small"
                />
              )}
              {status.services_available.image_processing && (
                <Chip
                  icon={<Cloud />}
                  label="Traitement d'images"
                  color="success"
                  size="small"
                />
              )}
            </Box>
          </>
        )}

        {!status?.flask_connected && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              🔧 Pour démarrer Flask:
            </Typography>
            <Typography variant="body2" component="div">
              1. Naviguez vers votre dossier Flask<br/>
              2. Activez votre environnement virtuel<br/>
              3. Exécutez: <code>python app.py</code><br/>
              4. Vérifiez que l'application démarre sur http://127.0.0.1:5000
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FlaskConnectionTest;
