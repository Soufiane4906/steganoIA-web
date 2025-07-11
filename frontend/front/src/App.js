import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './App.css';

// Pages
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import UploadImages from './pages/UploadImages';
import Gallery from './pages/Gallery';
import Profile from './pages/Profile';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public route - only accessible when not logged in */}
          <Route 
            path="/" 
            element={
              !user ? <Auth onAuthSuccess={handleAuthSuccess} /> : <Navigate to="/dashboard" />
            } 
          />
          
          {/* Protected routes - require authentication */}
          <Route 
            path="/dashboard" 
            element={
              user ? <DashboardLayout user={user} onLogout={handleLogout} /> : <Navigate to="/" />
            }
          >
            <Route index element={<Dashboard user={user} />} />
            <Route path="upload" element={<UploadImages />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="profile" element={<Profile user={user} />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
