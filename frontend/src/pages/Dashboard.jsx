import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CloudUpload,
    PhotoLibrary,
    Security,
    Image,
    QueryStats,
    History,
    VerifiedUser
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useImageList } from '../hooks/useImages';
import { dateUtils } from '../utils';
import './Dashboard.scss';

const StatCard = ({ icon, value, label, delay }) => (
    <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <div className="stat-icon">{icon}</div>
        <div className="stat-info">
            <h3>{value}</h3>
            <p>{label}</p>
        </div>
    </motion.div>
);

const ActionCard = ({ icon, title, description, path, delay }) => {
    const navigate = useNavigate();
    return (
        <motion.div
            className="action-card"
            onClick={() => navigate(path)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ scale: 1.05 }}
        >
            <div className="action-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
        </motion.div>
    );
};

const Dashboard = () => {
    const { user, isAdmin } = useAuth();
    const { images, loading } = useImageList(isAdmin() ? 'all' : 'user');
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
            const recentImages = images.filter(img => new Date(img.uploadTimestamp) > oneDayAgo);

            setStats({
                totalImages: images.length,
                imagesWithSteganography: images.filter(img => img.hasSteganography).length,
                averageAiConfidence: images.length > 0
                    ? (images.reduce((sum, img) => sum + (img.aiConfidence || 0), 0) / images.length * 100).toFixed(1)
                    : 0,
                recentUploads: recentImages.length
            });
        }
    }, [images]);

    const quickActions = [
        { title: 'Analyser une image', description: 'Uploader et analyser une nouvelle image', icon: <CloudUpload />, path: '/upload', delay: 0.1 },
        { title: 'Ma galerie', description: 'Voir toutes mes images analysées', icon: <PhotoLibrary />, path: '/gallery', delay: 0.2 },
        { title: 'Mon profil', description: 'Gérer les informations de mon compte', icon: <Security />, path: '/profile', delay: 0.3 }
    ];

    const recentImages = images.slice(0, 5);

    return (
        <motion.div
            className="dashboard-page-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="dashboard-header">
                <h1>Welcome back, <span>{user?.username || 'User'}</span></h1>
                <div className="user-info">
                    <div className="user-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
                    <span className={`user-role ${isAdmin() ? 'admin' : 'user'}`}>
                        {isAdmin() ? 'Admin' : 'User'}
                    </span>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard icon={<Image />} value={stats.totalImages} label="Images totales" delay={0.1} />
                <StatCard icon={<VerifiedUser />} value={stats.imagesWithSteganography} label="Images signées" delay={0.2} />
                <StatCard icon={<QueryStats />} value={`${stats.averageAiConfidence}%`} label="Confiance IA (Moy.)" delay={0.3} />
                <StatCard icon={<History />} value={stats.recentUploads} label="Uploads récents (24h)" delay={0.4} />
            </div>

            <div className="quick-actions-container">
                <h2>Accès Rapide</h2>
                <div className="actions-grid">
                    {quickActions.map(action => <ActionCard key={action.title} {...action} />)}
                </div>
            </div>

            <div className="recent-activity-container">
                <h2>Activité Récente</h2>
                <div className="activity-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Aperçu</th>
                                <th>Nom du fichier</th>
                                <th>Date d'upload</th>
                                <th>Statut</th>
                                <th>Confiance IA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>Chargement...</td></tr>
                            ) : recentImages.length > 0 ? (
                                recentImages.map((img, index) => (
                                    <motion.tr
                                        key={img.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <td><img src={img.imageUrl} alt={img.filename} className="image-preview" /></td>
                                        <td>{img.filename}</td>
                                        <td>{dateUtils.formatRelativeTime(img.uploadTimestamp)}</td>
                                        <td>
                                            <span className={`status-chip ${img.hasSteganography ? 'detected' : 'clean'}`}>
                                                {img.hasSteganography ? 'Signée' : 'Propre'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="confidence-bar">
                                                <div
                                                    className="confidence-fill"
                                                    style={{
                                                        width: `${img.aiConfidence * 100}%`,
                                                        backgroundColor: img.aiConfidence > 0.7 ? '#28a745' : '#ffc107'
                                                    }}
                                                ></div>
                                            </div>
                                            <span style={{marginLeft: '8px'}}>{(img.aiConfidence * 100).toFixed(1)}%</span>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>Aucune activité récente.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
