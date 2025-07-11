import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Divider,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ZoomIn as ZoomInIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Security as SecurityIcon,
  SmartToy as AIIcon
} from '@mui/icons-material';

// Mock data for gallery images
const mockImages = [
  {
    id: 1,
    name: 'landscape.jpg',
    url: 'https://source.unsplash.com/random/800x600/?landscape',
    uploadDate: '2025-07-10',
    size: '1.2 MB',
    hasStego: true,
    isAIGenerated: false
  },
  {
    id: 2,
    name: 'portrait.jpg',
    url: 'https://source.unsplash.com/random/800x600/?portrait',
    uploadDate: '2025-07-09',
    size: '0.8 MB',
    hasStego: false,
    isAIGenerated: true
  },
  {
    id: 3,
    name: 'nature.jpg',
    url: 'https://source.unsplash.com/random/800x600/?nature',
    uploadDate: '2025-07-08',
    size: '1.5 MB',
    hasStego: false,
    isAIGenerated: false
  },
  {
    id: 4,
    name: 'city.jpg',
    url: 'https://source.unsplash.com/random/800x600/?city',
    uploadDate: '2025-07-07',
    size: '2.1 MB',
    hasStego: true,
    isAIGenerated: true
  },
  {
    id: 5,
    name: 'animal.jpg',
    url: 'https://source.unsplash.com/random/800x600/?animal',
    uploadDate: '2025-07-06',
    size: '1.7 MB',
    hasStego: false,
    isAIGenerated: false
  },
  {
    id: 6,
    name: 'architecture.jpg',
    url: 'https://source.unsplash.com/random/800x600/?architecture',
    uploadDate: '2025-07-05',
    size: '1.9 MB',
    hasStego: false,
    isAIGenerated: true
  }
];

const Gallery = () => {
  const [images, setImages] = useState(mockImages);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [filterTab, setFilterTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenImage = (image) => {
    setSelectedImage(image);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const handleDeleteClick = (image) => {
    setImageToDelete(image);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // In a real app, we would call an API to delete the image
    setImages(prevImages => prevImages.filter(img => img.id !== imageToDelete.id));
    setDeleteDialogOpen(false);
    setImageToDelete(null);
  };

  const handleFilterChange = (event, newValue) => {
    setFilterTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter images based on selected tab and search query
  const filteredImages = images.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterTab === 0) return matchesSearch; // All images
    if (filterTab === 1) return image.hasStego && matchesSearch; // Steganography detected
    if (filterTab === 2) return image.isAIGenerated && matchesSearch; // AI generated
    
    return matchesSearch;
  });

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Gallery
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        View and manage all your uploaded images
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search images..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterListIcon sx={{ mr: 1 }} />
              <Tabs 
                value={filterTab} 
                onChange={handleFilterChange}
                aria-label="image filter tabs"
                sx={{ minHeight: '40px' }}
              >
                <Tab label="All" />
                <Tab 
                  label="Steganography" 
                  icon={<SecurityIcon fontSize="small" />} 
                  iconPosition="start"
                />
                <Tab 
                  label="AI Generated" 
                  icon={<AIIcon fontSize="small" />} 
                  iconPosition="start"
                />
              </Tabs>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {filteredImages.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No images found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try changing your search or filter settings
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredImages.map((image) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={image.url}
                  alt={image.name}
                  sx={{ 
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleOpenImage(image)}
                />
                <CardContent sx={{ flexGrow: 1, pt: 1, pb: 1 }}>
                  <Typography variant="body2" noWrap>
                    {image.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {image.uploadDate} • {image.size}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {image.hasStego && (
                      <Chip 
                        icon={<SecurityIcon />} 
                        label="Steganography" 
                        size="small" 
                        color="error" 
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    )}
                    {image.isAIGenerated && (
                      <Chip 
                        icon={<AIIcon />} 
                        label="AI Generated" 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 1 }}>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleOpenImage(image)}
                  >
                    <ZoomInIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDeleteClick(image)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Image Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseImage}
        maxWidth="md"
        fullWidth
      >
        {selectedImage && (
          <>
            <DialogTitle>
              {selectedImage.name}
              <Typography variant="body2" color="text.secondary">
                {selectedImage.uploadDate} • {selectedImage.size}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.name} 
                  style={{ maxWidth: '100%', maxHeight: '60vh' }} 
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Analysis Results
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Steganography Detection
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SecurityIcon 
                        color={selectedImage.hasStego ? "error" : "success"} 
                        sx={{ mr: 1 }} 
                      />
                      <Typography>
                        {selectedImage.hasStego 
                          ? "Hidden content detected" 
                          : "No hidden content detected"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      AI Generation Detection
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AIIcon 
                        color={selectedImage.isAIGenerated ? "primary" : "success"} 
                        sx={{ mr: 1 }} 
                      />
                      <Typography>
                        {selectedImage.isAIGenerated 
                          ? "AI-generated image" 
                          : "Natural image"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseImage}>Close</Button>
              <Button 
                color="error" 
                startIcon={<DeleteIcon />}
                onClick={() => {
                  handleCloseImage();
                  handleDeleteClick(selectedImage);
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Image</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{imageToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Gallery;
