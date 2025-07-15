import React, { useState } from 'react';
import { useImageUpload } from '../hooks/useImages';
import { fileUtils, analysisUtils, uiUtils } from '../utils';
import { UPLOAD_TYPES } from '../constants';
import './UploadImages.css';

const UploadImages = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadType, setUploadType] = useState(UPLOAD_TYPES.ANALYZE);
    const [signature, setSignature] = useState('');
    const { loading, error, result, uploadImage, reset } = useImageUpload();

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                fileUtils.validateFile(file);
                setSelectedFile(file);
                reset(); // Reset previous results
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Veuillez sélectionner un fichier');
            return;
        }

        try {
            await uploadImage(selectedFile, uploadType, signature);
        } catch (err) {
            console.error('Erreur upload:', err);
        }
    };

    const renderAnalysisResult = () => {
        if (!result) return null;

        return (
            <div className="result-container">
                <h3>📊 Résultats de l'analyse</h3>

                {uploadType === UPLOAD_TYPES.ANALYZE && (
                    <div className="analysis-results">
                        <div className="result-section">
                            <h4>{uiUtils.getStatusIcon(result.analysisStatus)} Statut de l'analyse</h4>
                            <p><strong>Statut:</strong> {result.analysisStatus}</p>
                            <p><strong>Fichier:</strong> {result.filename}</p>
                            <p><strong>Date d'upload:</strong> {result.uploadTimestamp ? new Date(result.uploadTimestamp).toLocaleString() : 'N/A'}</p>
                        </div>

                        {result.aiConfidence !== null && (
                            <div className="result-section">
                                <h4>🤖 Détection IA</h4>
                                <p><strong>Confiance IA:</strong>
                                    <span className={`confidence ${analysisUtils.getConfidenceLevel(result.aiConfidence)}`}>
                                        {analysisUtils.formatConfidence(result.aiConfidence)}
                                    </span>
                                </p>
                                <div className="confidence-bar">
                                    <div
                                        className="confidence-fill"
                                        style={{
                                            width: `${result.aiConfidence * 100}%`,
                                            backgroundColor: analysisUtils.getConfidenceColor(result.aiConfidence)
                                        }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {result.hasSteganography !== null && (
                            <div className="result-section">
                                <h4>🔐 Stéganographie</h4>
                                <p><strong>Signature détectée:</strong>
                                    <span className={result.hasSteganography ? 'has-stego' : 'no-stego'}>
                                        {result.hasSteganography ? 'Oui' : 'Non'}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {uploadType === UPLOAD_TYPES.STEGANOGRAPHY && (
                    <div className="steganography-results">
                        <div className="result-section">
                            <h4>✅ Stéganographie ajoutée</h4>
                            <p><strong>Fichier:</strong> {result.filename}</p>
                            <p><strong>Signature utilisateur:</strong> {signature || 'Aucune'}</p>
                            {result.aiConfidence && (
                                <p><strong>Confiance IA:</strong> {analysisUtils.formatConfidence(result.aiConfidence)}</p>
                            )}
                        </div>
                    </div>
                )}

                {uploadType === UPLOAD_TYPES.VERIFY && (
                    <div className="verification-results">
                        <div className="result-section">
                            <h4>🔍 Vérification d'intégrité</h4>
                            <p><strong>Stéganographie détectée:</strong> {result.steganography_detected ? 'Oui' : 'Non'}</p>
                            <p><strong>Signatures correspondent:</strong> {result.signatures_match ? 'Oui' : 'Non'}</p>
                            <p><strong>Image altérée:</strong>
                                <span className={result.tampered ? 'tampered' : 'intact'}>
                                    {result.tampered ? 'Oui' : 'Non'}
                                </span>
                            </p>
                            {result.user_signature && (
                                <p><strong>Signature utilisateur:</strong> {result.user_signature}</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="raw-result">
                    <details>
                        <summary>Résultats détaillés (JSON)</summary>
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                    </details>
                </div>
            </div>
        );
    };

    return (
        <div className="upload-container">
            <h2>🖼️ Analyse et Stéganographie d'Images</h2>

            <div className="upload-controls">
                <div className="type-selector">
                    <h3>Type d'opération</h3>
                    <div className="radio-group">
                        {Object.entries(UPLOAD_TYPES).map(([key, value]) => (
                            <label key={value}>
                                <input
                                    type="radio"
                                    value={value}
                                    checked={uploadType === value}
                                    onChange={(e) => setUploadType(e.target.value)}
                                />
                                {value === UPLOAD_TYPES.ANALYZE && '📊 Analyser l\'image (IA + Stéganographie)'}
                                {value === UPLOAD_TYPES.STEGANOGRAPHY && '🔐 Ajouter une signature stéganographique'}
                                {value === UPLOAD_TYPES.VERIFY && '🔍 Vérifier l\'intégrité'}
                            </label>
                        ))}
                    </div>
                </div>

                {uploadType === UPLOAD_TYPES.STEGANOGRAPHY && (
                    <div className="signature-input">
                        <h3>Signature personnalisée (optionnel)</h3>
                        <input
                            type="text"
                            value={signature}
                            onChange={(e) => setSignature(e.target.value)}
                            placeholder="Entrez votre signature..."
                            maxLength="100"
                        />
                        <small>Laissez vide pour utiliser seulement la signature contextuelle automatique</small>
                    </div>
                )}

                <div className="file-input">
                    <h3>Sélectionner une image</h3>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={loading}
                    />
                    {selectedFile && (
                        <div className="file-info">
                            <p>📁 {selectedFile.name}</p>
                            <p>📏 {fileUtils.formatFileSize(selectedFile.size)}</p>
                            <p>🎯 {selectedFile.type}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || loading}
                    className={`upload-button ${loading ? 'loading' : ''}`}
                >
                    {loading ? '⏳ Traitement en cours...' : '🚀 Envoyer'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    ❌ {error}
                </div>
            )}

            {renderAnalysisResult()}
        </div>
    );
};

export default UploadImages;
