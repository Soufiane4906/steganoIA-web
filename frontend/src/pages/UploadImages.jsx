import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useImageUpload } from '../hooks/useImages';
import { fileUtils, analysisUtils, uiUtils } from '../utils';
import { UPLOAD_TYPES } from '../constants';
import { Link } from 'react-router-dom';
import { ArrowRightAlt, CloudUpload, CheckCircle, Cancel, VpnKey, FindInPage, Science, Image as ImageIcon, UploadFile } from '@mui/icons-material';
import './UploadImages.scss';

const UploadImages = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadType, setUploadType] = useState(UPLOAD_TYPES.ANALYZE);
    const [signature, setSignature] = useState('');
    const { loading, error, result, uploadImage, reset } = useImageUpload();
    const [preview, setPreview] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            try {
                fileUtils.validateFile(file);
                setSelectedFile(file);
                setPreview(URL.createObjectURL(file));
                reset();
            } catch (err) {
                alert(err.message);
                setSelectedFile(null);
                setPreview(null);
            }
        }
    }, [reset]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false,
    });

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Veuillez sélectionner un fichier');
            return;
        }
        await uploadImage(selectedFile, uploadType, signature);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreview(null);
        reset();
    };

    const renderAnalysisResult = () => {
        if (!result) return null;

        const { stegano_properties, metadata, visual_properties } = result;
        const analysisItems = analysisUtils.getAnalysisItems(stegano_properties, metadata, visual_properties);

        return (
            <motion.div
                className="result-container card-style"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h3><Science /> Résultats de l'analyse</h3>
                <div className="result-grid">
                    {analysisItems.map((item, index) => (
                        <motion.div
                            key={index}
                            className="result-item"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="item-icon">{item.icon}</div>
                            <div className="item-content">
                                <h4>{item.label}</h4>
                                <p>{uiUtils.formatValue(item.value, item.unit)}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    };

    return (
        <motion.div
            className="upload-page-container"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
        >
            <div className="breadcrumbs">
                <Link to="/dashboard">Dashboard</Link> <ArrowRightAlt /> <span>Upload</span>
            </div>

            <div className="upload-container card-style glass-effect">
                <div className="upload-header">
                    <CloudUpload />
                    <h2>Uploader & Analyser une Image</h2>
                </div>

                <div className="upload-main">
                    <div className="upload-controls">
                        <div className="control-group">
                            <label>Type d'opération</label>
                            <div className="type-selector">
                                <button
                                    className={uploadType === UPLOAD_TYPES.ANALYZE ? 'active' : ''}
                                    onClick={() => setUploadType(UPLOAD_TYPES.ANALYZE)}
                                >
                                    <FindInPage /> Analyser
                                </button>
                                <button
                                    className={uploadType === UPLOAD_TYPES.SIGN ? 'active' : ''}
                                    onClick={() => setUploadType(UPLOAD_TYPES.SIGN)}
                                >
                                    <VpnKey /> Signer
                                </button>
                            </div>
                        </div>

                        {uploadType === UPLOAD_TYPES.SIGN && (
                            <motion.div
                                className="control-group"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                <label htmlFor="signature">Signature</label>
                                <input
                                    type="text"
                                    id="signature"
                                    className="signature-input"
                                    value={signature}
                                    onChange={(e) => setSignature(e.target.value)}
                                    placeholder="Entrez votre signature secrète..."
                                />
                            </motion.div>
                        )}

                        <div
                            {...getRootProps()}
                            className={`dropzone ${isDragActive ? 'active' : ''}`}
                        >
                            <input {...getInputProps()} />
                            {preview ? (
                                <div className="preview-container">
                                    <img src={preview} alt="Aperçu" className="image-preview" />
                                    <button onClick={handleRemoveFile} className="remove-file-btn">
                                        <Cancel />
                                    </button>
                                </div>
                            ) : (
                                <div className="dropzone-prompt">
                                    <UploadFile fontSize="large" />
                                    <p>Glissez-déposez une image ici, ou cliquez pour sélectionner</p>
                                    <em>(Images jusqu'à 5Mo)</em>
                                </div>
                            )}
                        </div>

                        <button onClick={handleUpload} disabled={loading || !selectedFile} className="upload-button button-style">
                            {loading ? 'Analyse en cours...' : 'Lancer le traitement'}
                        </button>
                    </div>

                    <div className="upload-status">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    className="status-message error"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Cancel /> {error}
                                </motion.div>
                            )}
                            {result && (
                                <motion.div
                                    className="status-message success"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <CheckCircle /> Analyse terminée avec succès !
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {renderAnalysisResult()}
        </motion.div>
    );
};

export default UploadImages;
