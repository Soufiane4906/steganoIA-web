import React from 'react';
import { motion } from 'framer-motion';
import {
  AccountCircle,
  AdminPanelSettings,
  Security,
  Schedule,
  PhotoLibrary,
  CloudUpload,
  Verified,
  Logout,
  ArrowRightAlt
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useImageList } from '../hooks/useImages';
import { dateUtils } from '../utils';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.scss';

const StatItem = ({ icon, value, label, delay }) => (
  <motion.div
    className="stat-item"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </motion.div>
);

const Profile = () => {
  const { user, isAdmin, logout } = useAuth();
  const { images, loading } = useImageList('user');
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="profile-page-container">
        <p>Utilisateur non trouvé. Veuillez vous reconnecter.</p>
      </div>
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
    <motion.div
      className="profile-page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="breadcrumbs">
        <Link to="/dashboard">Dashboard</Link> <ArrowRightAlt /> <span>Profil</span>
      </div>

      <div className="profile-grid">
        <motion.div
          className="profile-main-card"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="profile-avatar">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <h2 className="profile-username">{user.username}</h2>
          <div className={`profile-role ${isAdmin() ? 'admin' : 'user'}`}>
            {isAdmin() ? <AdminPanelSettings /> : <Security />}
            <span>{user.role}</span>
          </div>
          <p className="profile-description">
            {isAdmin()
              ? 'Administrateur avec accès complet à la plateforme.'
              : 'Utilisateur standard pour l\'analyse et la stéganographie.'
            }
          </p>
        </motion.div>

        <div className="stats-container">
          <StatItem icon={<PhotoLibrary />} value={userStats.totalImages} label="Images analysées" delay={0.2} />
          <StatItem icon={<Verified />} value={userStats.imagesWithSteganography} label="Avec stéganographie" delay={0.3} />
          <StatItem icon={<CloudUpload />} value={`${userStats.averageAiConfidence}%`} label="Confiance IA (moy.)" delay={0.4} />
        </div>

        <motion.div
          className="info-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="info-header">
            <h3>Informations du compte</h3>
          </div>
          <div className="info-content">
            <ul className="info-list">
              <li>
                <AccountCircle className="info-icon" />
                <div className="info-text">
                  <span className="primary">Nom d'utilisateur</span>
                  <span className="secondary">{user.username}</span>
                </div>
              </li>
              <li>
                {isAdmin() ? <AdminPanelSettings className="info-icon" /> : <Security className="info-icon" />}
                <div className="info-text">
                  <span className="primary">Rôle</span>
                  <span className="secondary">{user.role}</span>
                </div>
              </li>
              <li>
                <Schedule className="info-icon" />
                <div className="info-text">
                  <span className="primary">Membre depuis</span>
                  <span className="secondary">Date d'inscription (à implémenter)</span>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>

        <div className="actions-container">
          <motion.button
            className="btn btn-cyber btn-lg"
            onClick={() => navigate('/upload')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CloudUpload className="icon" /> Analyser une image
          </motion.button>
          <motion.button
            className="btn btn-holo btn-lg"
            onClick={() => navigate('/gallery')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PhotoLibrary className="icon" /> Voir ma galerie
          </motion.button>
          <motion.button
            className="btn btn-matrix btn-lg"
            onClick={logout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Logout className="icon" /> Se déconnecter
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
