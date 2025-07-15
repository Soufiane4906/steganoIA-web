import React, { useState } from 'react';
import { Box, Container, Paper, Tabs, Tab } from '@mui/material';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const Auth = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLoginSuccess = (userData) => {
    if (onAuthSuccess) {
      onAuthSuccess(userData);
    }
  };

  const handleRegisterSuccess = (userData) => {
    if (onAuthSuccess) {
      onAuthSuccess(userData);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          
          <Box>
            {activeTab === 0 ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Register onRegisterSuccess={handleRegisterSuccess} />
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Auth;
