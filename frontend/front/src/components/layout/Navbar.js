import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Dashboard,
  CloudUpload,
  PhotoLibrary,
  Settings,
  AdminPanelSettings,
  Security
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/auth');
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) {
    return null; // Ne pas afficher la navbar si non connecté
  }

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => navigate('/dashboard')}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/dashboard')}
        >
          🖼️ SteganoIA
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<Dashboard />}
            onClick={() => navigate('/dashboard')}
            variant={isActive('/dashboard') ? 'outlined' : 'text'}
          >
            Dashboard
          </Button>

          <Button
            color="inherit"
            startIcon={<CloudUpload />}
            onClick={() => navigate('/upload')}
            variant={isActive('/upload') ? 'outlined' : 'text'}
          >
            Upload
          </Button>

          <Button
            color="inherit"
            startIcon={<PhotoLibrary />}
            onClick={() => navigate('/gallery')}
            variant={isActive('/gallery') ? 'outlined' : 'text'}
          >
            Galerie
          </Button>
        </Box>

        {/* User Info & Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <Chip
            icon={isAdmin() ? <AdminPanelSettings /> : <Security />}
            label={user?.username || 'Utilisateur'}
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.5)',
              mr: 1
            }}
          />

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: isAdmin() ? 'secondary.main' : 'primary.dark'
              }}
            >
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {/* User Info */}
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Connecté en tant que
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {user?.username}
              </Typography>
              <Chip
                size="small"
                label={user?.role}
                color={isAdmin() ? 'secondary' : 'primary'}
                sx={{ mt: 0.5 }}
              />
            </Box>

            <Divider />

            {/* Navigation Menu Items (Mobile) */}
            <MenuItem
              onClick={() => handleNavigation('/dashboard')}
              selected={isActive('/dashboard')}
            >
              <ListItemIcon>
                <Dashboard fontSize="small" />
              </ListItemIcon>
              <ListItemText>Dashboard</ListItemText>
            </MenuItem>

            <MenuItem
              onClick={() => handleNavigation('/upload')}
              selected={isActive('/upload')}
            >
              <ListItemIcon>
                <CloudUpload fontSize="small" />
              </ListItemIcon>
              <ListItemText>Upload Images</ListItemText>
            </MenuItem>

            <MenuItem
              onClick={() => handleNavigation('/gallery')}
              selected={isActive('/gallery')}
            >
              <ListItemIcon>
                <PhotoLibrary fontSize="small" />
              </ListItemIcon>
              <ListItemText>Galerie</ListItemText>
            </MenuItem>

            <MenuItem
              onClick={() => handleNavigation('/profile')}
              selected={isActive('/profile')}
            >
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profil</ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Se déconnecter</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
