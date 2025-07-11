import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  CardMedia,
  Button,
  Divider
} from '@mui/material';
import { 
  CloudUpload as UploadIcon,
  Collections as GalleryIcon,
  Image as ImageIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  
  // Mock data for dashboard stats
  const stats = {
    totalImages: 12,
    analyzedImages: 8,
    steganographyDetected: 3,
    aiGenerated: 2
  };

  const featureCards = [
    {
      title: 'Upload Images',
      description: 'Upload new images for steganography analysis and AI detection',
      icon: <UploadIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      action: () => navigate('/dashboard/upload')
    },
    {
      title: 'My Gallery',
      description: 'View and manage all your uploaded images',
      icon: <GalleryIcon sx={{ fontSize: 60, color: 'secondary.main' }} />,
      action: () => navigate('/dashboard/gallery')
    },
    {
      title: 'Steganography Detection',
      description: 'Detect hidden messages in your images',
      icon: <SecurityIcon sx={{ fontSize: 60, color: 'error.main' }} />,
      action: () => navigate('/dashboard/upload')
    },
    {
      title: 'AI Image Detection',
      description: 'Check if images are AI-generated',
      icon: <ImageIcon sx={{ fontSize: 60, color: 'success.main' }} />,
      action: () => navigate('/dashboard/upload')
    }
  ];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Here's an overview of your image analysis activities
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              backgroundColor: 'primary.light',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Images
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {stats.totalImages}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              backgroundColor: 'secondary.light',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Analyzed
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {stats.analyzedImages}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              backgroundColor: 'error.light',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Steganography
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {stats.steganographyDetected}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              backgroundColor: 'success.light',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              AI Generated
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {stats.aiGenerated}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      
      <Grid container spacing={3}>
        {featureCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                {card.icon}
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={card.action}
                >
                  Go
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
