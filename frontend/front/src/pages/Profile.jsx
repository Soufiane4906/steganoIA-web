import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Alert
} from '@mui/material';
import {
  AccountCircle,
  AdminPanelSettings,
  Security,
  Schedule,
  PhotoLibrary,
  CloudUpload,
  Verified,
  Info
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useImageList } from '../hooks/useImages';
import { dateUtils } from '../utils';

const Profile = () => {
  const { user, isAdmin, logout } = useAuth();
  const { images, loading } = useImageList('user');
  const [showInfo, setShowInfo] = useState(false);

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Utilisateur non trouvé. Veuillez vous reconnecter.
        </Alert>
      </Container>
    );
  }

  const userStats = {
    totalImages: images.length,
    imagesWithSteganography: images.filter(img => img.hasSteganography).length,
    averageAiConfidence: images.length > 0
      ? (images.reduce((sum, img) => sum + (img.aiConfidence || 0), 0) / images.length * 100).toFixed(1)
      : 0
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profil Principal */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mb: 2,
                bgcolor: 'rgba(255,255,255,0.2)',
                fontSize: '2rem'
              }}
            >
              {user.username?.charAt(0).toUpperCase()}
            </Avatar>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {user.username}
            </Typography>

            <Chip
              icon={isAdmin() ? <AdminPanelSettings /> : <Security />}
              label={user.role}
              color={isAdmin() ? 'secondary' : 'primary'}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" color="rgba(255,255,255,0.8)" align="center">
              {isAdmin()
                ? 'Administrateur - Accès complet à la plateforme'
                : 'Utilisateur - Analyse et stéganographie d\'images'
              }
            </Typography>
          </Paper>
        </Grid>

        {/* Statistiques */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <PhotoLibrary color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {userStats.totalImages}
                  </Typography>
                  <Typography color="text.secondary">
                    Images analysées
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Verified color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {userStats.imagesWithSteganography}
                  </Typography>
                  <Typography color="text.secondary">
                    Avec stéganographie
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CloudUpload color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {userStats.averageAiConfidence}%
                  </Typography>
                  <Typography color="text.secondary">
                    Confiance IA moyenne
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Informations détaillées */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Informations du compte"
              action={
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowInfo(!showInfo)}
                  startIcon={<Info />}
                >
                  {showInfo ? 'Masquer' : 'Afficher'} les détails
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText
                    primary="Nom d'utilisateur"
                    secondary={user.username}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    {isAdmin() ? <AdminPanelSettings /> : <Security />}
                  </ListItemIcon>
                  <ListItemText
                    primary="Rôle"
                    secondary={
                      <Chip
                        label={user.role}
                        size="small"
                        color={isAdmin() ? 'secondary' : 'primary'}
                      />
                    }
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Schedule />
                  </ListItemIcon>
                  <ListItemText
                    primary="Dernière connexion"
                    secondary={dateUtils.formatDateTime(new Date().toISOString())}
                  />
                </ListItem>
              </List>

              {showInfo && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Permissions et fonctionnalités
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        ✅ Fonctionnalités disponibles :
                      </Typography>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>Upload et analyse d'images</li>
                        <li>Ajout de stéganographie</li>
                        <li>Vérification d'intégrité</li>
                        <li>Galerie personnelle</li>
                        {isAdmin() && (
                          <>
                            <li>Gestion des utilisateurs</li>
                            <li>Accès à toutes les images</li>
                            <li>Statistiques globales</li>
                          </>
                        )}
                      </ul>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        📊 Formats supportés :
                      </Typography>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>PNG (recommandé)</li>
                        <li>JPEG/JPG</li>
                        <li>GIF</li>
                        <li>WebP</li>
                      </ul>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => window.location.href = '/upload'}
              startIcon={<CloudUpload />}
            >
              Analyser une image
            </Button>

            <Button
              variant="outlined"
              onClick={() => window.location.href = '/gallery'}
              startIcon={<PhotoLibrary />}
            >
              Voir ma galerie
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={logout}
            >
              Se déconnecter
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
