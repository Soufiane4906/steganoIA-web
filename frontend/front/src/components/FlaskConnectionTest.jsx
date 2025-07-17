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
import { flaskImageService } from '../services/flaskApi';

const FlaskConnectionTest = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  const testFlaskConnection = async () => {
    setLoading(true);
    try {
      const data = await flaskImageService.testFlaskConnection();
      setStatus({
        flask_connected: true,
        flask_url: 'http://localhost:5000',
        ...data
      });
      setLastCheck(new Date());
    } catch (error) {
      console.error('Erreur test Flask:', error);
      setStatus({
        flask_connected: false,
        error: error.message,
        message: "Erreur de connexion à l'application Flask sur le port 5000"
      });
      setLastCheck(new Date());
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
            ✅ Flask API connectée - Stéganographie et IA disponibles
          </Alert>
        ) : (
          <Alert severity="error" sx={{ mb: 2 }}>
            ❌ Flask API non disponible
            <Typography variant="body2" sx={{ mt: 1 }}>
              {status?.message || "Vérifiez que votre serveur Flask est démarré sur le port 5000"}
            </Typography>
          </Alert>
        )}

        {status?.flask_connected && status?.services && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Services Flask disponibles :
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<Psychology />}
                label="Détection IA"
                size="small"
                color={status.services.ai_detection?.error ? 'error' : 'success'}
              />
              <Chip
                icon={<Security />}
                label="Stéganographie"
                size="small"
                color="success"
              />
              <Chip
                icon={<Cloud />}
                label="Upload Images"
                size="small"
                color="success"
              />
            </Box>
          </>
        )}

        {status?.endpoints && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Endpoints disponibles :
            </Typography>
            <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
              {status.endpoints.map((endpoint, index) => (
                <Typography key={index} variant="caption" component="div">
                  • /flask{endpoint.replace('/api', '')}
                </Typography>
              ))}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FlaskConnectionTest;
