import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useImageList } from '../hooks/useImages';
import { useAuth } from '../hooks/useAuth';
import { dateUtils } from '../utils';
import {
    DeleteOutline, CalendarToday, Security, VpnKey, BugReport, PersonOutline,
    FileCopyOutlined, Refresh, Image as ImageIcon, FolderOpen, Language, Lock, GppGood,
    CloudUpload, ArrowRightAlt, CheckCircle, Cancel, HourglassEmpty, HelpOutline, PhotoLibrary
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './Gallery.scss';

const Gallery = () => {
    const [filter, setFilter] = useState('user');
    const { images, loading, error, deleteImage, refetch } = useImageList(filter);
    const { isAdmin, user } = useAuth();

    const renderAnalysisResultsContent = (results) => {
        if (!results) return 'Aucun détail disponible.';
        try {
            const parsed = typeof results === 'string' ? JSON.parse(results) : results;
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            return results;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette image ? L'action est irréversible.")) {
            await deleteImage(id);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'COMPLETED': return { icon: <CheckCircle />, color: '#28a745' };
            case 'FAILED': return { icon: <Cancel />, color: '#dc3545' };
            case 'PENDING': return { icon: <HourglassEmpty />, color: '#ffc107' };
            default: return { icon: <HelpOutline />, color: '#6c757d' };
        }
    };

    const getConfidenceInfo = (confidence) => {
        if (confidence === null || confidence === undefined) return { level: 'N/A', color: '#6c757d' };
        if (confidence > 0.8) return { level: 'Élevée', color: '#28a745' };
        if (confidence > 0.5) return { level: 'Moyenne', color: '#ffc107' };
        return { level: 'Faible', color: '#dc3545' };
    };

    const renderImageCard = (image) => {
        const statusInfo = getStatusInfo(image.analysisStatus);
        const confidenceInfo = getConfidenceInfo(image.aiConfidence);

        return (
            <motion.div
                key={image.id}
                className="image-card"
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <div className="image-preview" style={{ backgroundImage: `url(${image.imageUrl})` }}>
                    <div className="image-overlay">
                        <a href={image.imageUrl} target="_blank" rel="noopener noreferrer" className="preview-link">
                            Voir en grand
                        </a>
                    </div>
                </div>

                <div className="card-content">
                    <h3 className="filename" title={image.filename}>
                        <ImageIcon /> {image.filename.length > 25 ? `${image.filename.substring(0, 22)}...` : image.filename}
                    </h3>

                    <div className="info-grid">
                        <div className="info-item" title={new Date(image.uploadTimestamp).toLocaleString()}>
                            <CalendarToday />
                            <span>{dateUtils.formatRelativeTime(image.uploadTimestamp)}</span>
                        </div>
                        <div className="info-item">
                            <PersonOutline />
                            <span>{image.user?.username || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="status-icon" style={{ color: statusInfo.color }}>{statusInfo.icon}</span>
                            <span>{image.analysisStatus}</span>
                        </div>
                        <div className={`info-item ${image.hasSteganography ? 'stego-detected' : ''}`}>
                            <VpnKey />
                            <span>{image.hasSteganography ? 'Signée' : 'Propre'}</span>
                        </div>
                    </div>

                    {image.aiConfidence !== null && (
                        <div className="ai-confidence">
                            <BugReport />
                            <span>Confiance IA :</span>
                            <div className="confidence-bar-container">
                                <div
                                    className="confidence-bar"
                                    style={{ width: `${image.aiConfidence * 100}%`, backgroundColor: confidenceInfo.color }}
                                ></div>
                            </div>
                            <span style={{ color: confidenceInfo.color }}>{(image.aiConfidence * 100).toFixed(1)}%</span>
                        </div>
                    )}

                    {image.analysisResults && (
                        <details className="analysis-details">
                            <summary>Détails d'analyse</summary>
                            <pre>{renderAnalysisResultsContent(image.analysisResults)}</pre>
                            <button onClick={() => navigator.clipboard.writeText(renderAnalysisResultsContent(image.analysisResults))}>
                                <FileCopyOutlined /> Copier
                            </button>
                        </details>
                    )}
                </div>

                {(isAdmin() || user?.id === image.user?.id) && (
                    <motion.button
                        className="delete-button"
                        onClick={() => handleDelete(image.id)}
                        whileHover={{ scale: 1.1, backgroundColor: 'var(--danger-color-hover)' }}
                        title="Supprimer l'image"
                    >
                        <DeleteOutline />
                    </motion.button>
                )}
            </motion.div>
        );
    };

    return (
        <motion.div
            className="gallery-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="breadcrumbs">
                <Link to="/dashboard">Dashboard</Link> <ArrowRightAlt /> <span>Galerie</span>
            </div>

            <header className="gallery-header">
                <div className="title">
                    <PhotoLibrary />
                    <h1>Galerie d'Images</h1>
                </div>
                <div className="actions">
                    <motion.button onClick={refetch} className="button-style secondary" whileHover={{ scale: 1.05 }}><Refresh /> Actualiser</motion.button>
                    <Link to="/upload" className="button-style">
                        <CloudUpload /> Uploader une image
                    </Link>
                </div>
            </header>

            {isAdmin() && (
                <div className="filter-controls">
                    <button onClick={() => setFilter('user')} className={filter === 'user' ? 'active' : ''}><PersonOutline /> Mes Images</button>
                    <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}><Language /> Toutes les images</button>
                    <button onClick={() => setFilter('steganography')} className={filter === 'steganography' ? 'active' : ''}><Lock /> Signées seulement</button>
                    <button onClick={() => setFilter('ai_detected')} className={filter === 'ai_detected' ? 'active' : ''}><GppGood /> Détectées par IA</button>
                </div>
            )}

            {loading && <div className="loading-indicator">Chargement des images...</div>}
            {error && <div className="error-message">Erreur: {error.message}</div>}

            <AnimatePresence>
                <motion.div className="images-grid" layout>
                    {!loading && images.length === 0 ? (
                        <motion.div className="no-images-found" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <ImageIcon style={{ fontSize: '4rem' }} />
                            <h2>Aucune image trouvée</h2>
                            <p>Il semble qu'il n'y ait rien à afficher ici. Pourquoi ne pas uploader une image ?</p>
                        </motion.div>
                    ) : (
                        images.map(renderImageCard)
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default Gallery;
