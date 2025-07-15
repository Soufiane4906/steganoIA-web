import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Paper,
  LinearProgress,
  Chip,
  Avatar,
  IconButton
} from '@mui/material';
import {
  CloudUpload,
  PhotoLibrary,
  Security,
  TrendingUp,
  Assessment,
  Verified,
  AdminPanelSettings,
  Refresh
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useImageList } from '../hooks/useImages';
import { analysisUtils, dateUtils } from '../utils';
import FlaskConnectionTest from '../components/FlaskConnectionTest';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { images, loading, refetch } = useImageList(isAdmin() ? 'all' : 'user');
  const [stats, setStats] = useState({
    totalImages: 0,
    imagesWithSteganography: 0,
    averageAiConfidence: 0,
    recentUploads: 0
  });

  useEffect(() => {
    if (images.length > 0) {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const recentImages = images.filter(img =>
        new Date(img.uploadTimestamp) > oneDayAgo
      );

      setStats({
        totalImages: images.length,
        imagesWithSteganography: images.filter(img => img.hasSteganography).length,
        averageAiConfidence: images.length > 0
          ? images.reduce((sum, img) => sum + (img.aiConfidence || 0), 0) / images.length
          : 0,
        recentUploads: recentImages.length
      });
    }
  }, [images]);

  const quickActions = [
    {
      title: 'Analyser une image',
      description: 'Upload et analyse IA + stéganographie',
      icon: <CloudUpload sx={{ fontSize: 40 }} />,
      color: 'primary',
      path: '/upload'
    },
    {
      title: 'Ma galerie',
      description: 'Voir mes images analysées',
      icon: <PhotoLibrary sx={{ fontSize: 40 }} />,
      color: 'secondary',
      path: '/gallery'
    },
    {
      title: 'Mon profil',
      description: 'Gestion du compte',
      icon: <Security sx={{ fontSize: 40 }} />,
      color: 'success',
      path: '/profile'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header avec info utilisateur */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: 'rgba(255,255,255,0.2)',
                fontSize: '1.5rem'
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography variant="h4" fontWeight="bold">
                Bienvenue, {user?.username} !
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Chip
                  icon={isAdmin() ? <AdminPanelSettings /> : <Security />}
                  label={user?.role}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {dateUtils.formatDateTime(new Date().toISOString())}
                </Typography>
              </Box>
            </Box>
          </Box>

          <IconButton
            onClick={refetch}
            sx={{ color: 'white' }}
            title="Actualiser les données"
          >
            <Refresh />
          </IconButton>
        </Box>
      </Paper>

      {/* Test de connexion Flask */}
      <FlaskConnectionTest />

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Images analysées
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalImages}
                  </Typography>
                </Box>
                <Assessment color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Avec stéganographie
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.imagesWithSteganography}
                  </Typography>
                </Box>
                <Verified color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Confiance IA moyenne
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {(stats.averageAiConfidence * 100).toFixed(1)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stats.averageAiConfidence * 100}
                    sx={{
                      mt: 1,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: analysisUtils.getConfidenceColor(stats.averageAiConfidence)
                      }
                    }}
                  />
                </Box>
                <TrendingUp color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Uploads récents (24h)
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.recentUploads}
                  </Typography>
                </Box>
                <CloudUpload color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions rapides */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Actions rapides
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ color: `${action.color}.main`, mb: 2 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {action.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  {action.description}
                </Typography>
                <Button
                  variant="contained"
                  color={action.color}
                  size="large"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(action.path);
                  }}
                >
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dernières images analysées */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Dernières analyses
      </Typography>

      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <LinearProgress sx={{ mb: 2 }} />
              <Typography color="text.secondary">
                Chargement des données...
              </Typography>
            </Box>
          ) : images.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <PhotoLibrary sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Aucune image analysée
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Commencez par analyser votre première image !
              </Typography>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => navigate('/upload')}
              >
                Analyser une image
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {images.slice(0, 6).map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      📷
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" noWrap>
                        {image.filename}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dateUtils.getRelativeTime(image.uploadTimestamp)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        {image.hasSteganography && (
                          <Chip size="small" label="Stégano" color="secondary" />
                        )}
                        {image.aiConfidence > 0.7 && (
                          <Chip size="small" label="IA détectée" color="warning" />
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
