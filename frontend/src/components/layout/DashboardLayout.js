import React from 'react';
import { Box, Toolbar, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const DashboardLayout = ({ user, onLogout }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={onLogout} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          backgroundColor: (theme) => theme.palette.grey[50]
        }}
      >
        <Toolbar /> {/* This creates space below the AppBar */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
