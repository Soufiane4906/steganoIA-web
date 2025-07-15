import React, { useState } from 'react';
import { useImageList } from '../hooks/useImages';
import { analysisUtils, dateUtils, uiUtils, authUtils } from '../utils';
import { FILTER_TYPES } from '../constants';
import './Gallery.css';

const Gallery = () => {
    const [filter, setFilter] = useState(FILTER_TYPES.USER);
    const { images, loading, error, deleteImage, refetch } = useImageList(filter);

    const handleDeleteImage = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
            return;
        }

        try {
            await deleteImage(id);
        } catch (err) {
            alert(`Erreur lors de la suppression: ${err.message}`);
        }
    };

    const renderImageCard = (image) => (
        <div key={image.id} className="image-card">
            <div className="image-header">
                <h3 title={image.filename}>
                    {uiUtils.truncateText(image.filename, 30)}
                </h3>
                {authUtils.canDeleteImage(image) && (
                    <button
                        className="delete-btn"
                        onClick={() => handleDeleteImage(image.id)}
                        title="Supprimer l'image"
                    >
                        🗑️
                    </button>
                )}
            </div>

            <div className="image-info">
                <div className="info-row">
                    <span className="label">📅 Upload:</span>
                    <span title={dateUtils.formatDateTime(image.uploadTimestamp)}>
                        {dateUtils.getRelativeTime(image.uploadTimestamp)}
                    </span>
                </div>

                {image.aiConfidence !== null && (
                    <div className="info-row">
                        <span className="label">🤖 IA:</span>
                        <span
                            className={`confidence ${analysisUtils.getConfidenceLevel(image.aiConfidence)}`}
                            style={{ color: analysisUtils.getConfidenceColor(image.aiConfidence) }}
                        >
                            {analysisUtils.formatConfidence(image.aiConfidence)}
                        </span>
                    </div>
                )}

                <div className="info-row">
                    <span className="label">🔐 Stéganographie:</span>
                    <span className={image.hasSteganography ? 'has-stego' : 'no-stego'}>
                        {image.hasSteganography ? 'Oui' : 'Non'}
                    </span>
                </div>

                <div className="info-row">
                    <span className="label">📊 Statut:</span>
                    <span
                        className={`status ${image.analysisStatus?.toLowerCase()}`}
                        style={{ color: uiUtils.getStatusColor(image.analysisStatus) }}
                    >
                        {uiUtils.getStatusIcon(image.analysisStatus)} {image.analysisStatus}
                    </span>
                </div>

                {image.user && (
                    <div className="info-row">
                        <span className="label">👤 Utilisateur:</span>
                        <span>{image.user.username}</span>
                    </div>
                )}
            </div>

            {image.analysisResults && (
                <details className="analysis-details">
                    <summary>Voir les détails d'analyse</summary>
                    <div className="analysis-content">
                        <button
                            className="copy-btn"
                            onClick={() => uiUtils.copyToClipboard(image.analysisResults)}
                            title="Copier dans le presse-papier"
                        >
                            📋 Copier
                        </button>
                        <pre>{JSON.stringify(JSON.parse(image.analysisResults), null, 2)}</pre>
                    </div>
                </details>
            )}
        </div>
    );

    const getFilterLabel = (filterType) => {
        switch (filterType) {
            case FILTER_TYPES.USER: return '📁 Mes images';
            case FILTER_TYPES.ALL: return '🌐 Toutes les images';
            case FILTER_TYPES.STEGANOGRAPHY: return '🔐 Avec stéganographie';
            case FILTER_TYPES.AI_DETECTED: return '🤖 Détectées par IA';
            default: return filterType;
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">⏳</div>
                <p>Chargement des images...</p>
            </div>
        );
    }

    return (
        <div className="gallery-container">
            <div className="gallery-header">
                <h2>🖼️ Galerie d'Images</h2>
                <button
                    className="refresh-btn"
                    onClick={refetch}
                    title="Actualiser"
                >
                    🔄 Actualiser
                </button>
            </div>

            <div className="filter-controls">
                {Object.entries(FILTER_TYPES).map(([key, value]) => {
                    // Masquer certains filtres selon les permissions
                    if (value === FILTER_TYPES.ALL && !authUtils.canViewAllImages()) return null;
                    if (value === FILTER_TYPES.STEGANOGRAPHY && !authUtils.canViewAllImages()) return null;
                    if (value === FILTER_TYPES.AI_DETECTED && !authUtils.canViewAllImages()) return null;

                    return (
                        <button
                            key={value}
                            className={filter === value ? 'active' : ''}
                            onClick={() => setFilter(value)}
                        >
                            {getFilterLabel(value)}
                        </button>
                    );
                })}
            </div>

            {error && (
                <div className="error-message">
                    ❌ {error}
                    <button onClick={refetch} className="retry-btn">
                        🔄 Réessayer
                    </button>
                </div>
            )}

            <div className="gallery-stats">
                <p>
                    {images.length} image{images.length > 1 ? 's' : ''} trouvée{images.length > 1 ? 's' : ''}
                    {filter !== FILTER_TYPES.USER && ` (${getFilterLabel(filter)})`}
                </p>
            </div>

            <div className="images-grid">
                {images.length === 0 ? (
                    <div className="no-images">
                        <div className="no-images-icon">📭</div>
                        <h3>Aucune image trouvée</h3>
                        <p>
                            {filter === FILTER_TYPES.USER
                                ? 'Vous n\'avez pas encore uploadé d\'images.'
                                : 'Aucune image ne correspond à ce filtre.'
                            }
                        </p>
                    </div>
                ) : (
                    images.map(renderImageCard)
                )}
            </div>
        </div>
    );
};

export default Gallery;
