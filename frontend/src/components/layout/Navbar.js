import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Avatar, Box, Chip, Divider, ListItemIcon, ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon, AccountCircle, Logout, Dashboard, CloudUpload, PhotoLibrary, Settings, AdminPanelSettings, Security, VpnKey
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.scss';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/auth');
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const isActive = (path) => location.pathname.startsWith(path);

  if (!isAuthenticated) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <AppBar position="sticky" className="navbar">
        <Toolbar className="toolbar">
          <motion.div
            className="logo-container"
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <VpnKey className="logo-icon" />
            </motion.div>
            <Typography className="logo-text">SteganoIA</Typography>
          </motion.div>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }} className="nav-links">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className={`nav-button ${isActive('/dashboard') ? 'active' : ''}`}
                startIcon={<Dashboard />}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className={`nav-button ${isActive('/upload') ? 'active' : ''}`}
                startIcon={<CloudUpload />}
                onClick={() => navigate('/upload')}
              >
                Upload
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className={`nav-button ${isActive('/gallery') ? 'active' : ''}`}
                startIcon={<PhotoLibrary />}
                onClick={() => navigate('/gallery')}
              >
                Galerie
              </Button>
            </motion.div>
          </Box>

          <Box className="user-menu-container">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Chip
                icon={isAdmin() ? <AdminPanelSettings /> : <Security />}
                label={user?.username || 'Utilisateur'}
                variant="outlined"
                className="user-chip"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={handleMenu}
                className="avatar-button"
              >
                <Avatar className="avatar">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </motion.div>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{ className: 'menu-paper' }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Connecté en tant que</Typography>
                <Typography variant="body1" fontWeight="bold">{user?.username}</Typography>
              </Box>
              <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
              <MenuItem onClick={() => handleNavigation('/dashboard')} selected={isActive('/dashboard')}>
                <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
                <ListItemText>Dashboard</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/upload')} selected={isActive('/upload')}>
                <ListItemIcon><CloudUpload fontSize="small" /></ListItemIcon>
                <ListItemText>Upload</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/gallery')} selected={isActive('/gallery')}>
                <ListItemIcon><PhotoLibrary fontSize="small" /></ListItemIcon>
                <ListItemText>Galerie</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/profile')} selected={isActive('/profile')}>
                <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                <ListItemText>Profil</ListItemText>
              </MenuItem>
              <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                <ListItemText>Se déconnecter</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;
