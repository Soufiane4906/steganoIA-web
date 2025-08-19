import { useState, useEffect, createContext, useContext } from 'react';

// Contexte pour le thème
const ThemeContext = createContext();

// Hook personnalisé pour utiliser le thème
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Provider pour le thème
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Récupérer le thème du localStorage ou utiliser 'dark' par défaut
    const savedTheme = localStorage.getItem('stegano-theme');
    return savedTheme || 'dark';
  });

  // Appliquer le thème au DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stegano-theme', theme);
  }, [theme]);

  // Fonction pour basculer entre les thèmes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Fonction pour définir un thème specific
  const setThemeMode = (newTheme) => {
    if (['light', 'dark'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  // Détection automatique du thème système
  const setSystemTheme = () => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(systemTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setThemeMode,
    setSystemTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default useTheme;
