import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  TextField,
  Tabs,
  Tab,
  Grid,
  Paper,
  Chip
} from '@mui/material';
import {
  CloudUpload,
  Security,
  VerifiedUser,
  Psychology
} from '@mui/icons-material';
import { flaskImageService } from '../services/flaskApi';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`flask-tabpanel-${index}`}
      aria-labelledby={`flask-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const FlaskImageProcessor = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [signature, setSignature] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setResult(null);
    setError(null);
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    setResult(null);
    setError(null);
  };

  const uploadAndAnalyze = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await flaskImageService.uploadAndAnalyzeImage(selectedFile);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSteganography = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await flaskImageService.addSteganography(selectedFile, signature);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyIntegrity = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await flaskImageService.verifyIntegrity(selectedFile);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysisResult = () => {
    if (!result) return null;

    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Résultats de l'analyse
        </Typography>

        {/* Analyse IA */}
        {result.analysis?.ai_detection && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">🤖 Détection IA :</Typography>
            <Chip
              label={`Confiance: ${(result.analysis.ai_detection.confidence * 100).toFixed(1)}%`}
              color={result.analysis.ai_detection.confidence > 0.7 ? 'warning' : 'success'}
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip
              label={result.analysis.ai_detection.confidence > 0.7 ? 'Probablement IA' : 'Probablement réelle'}
              color={result.analysis.ai_detection.confidence > 0.7 ? 'warning' : 'success'}
              size="small"
            />
          </Box>
        )}

        {/* Stéganographie */}
        {result.analysis?.steganography && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">🔐 Stéganographie :</Typography>
            <Chip
              label={result.analysis.steganography.signature_detected ? 'Signature détectée' : 'Aucune signature'}
              color={result.analysis.steganography.signature_detected ? 'primary' : 'default'}
              size="small"
            />
            {result.analysis.steganography.signature && (
              <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
                Signature: {result.analysis.steganography.signature}
              </Typography>
            )}
          </Box>
        )}

        {/* Images similaires */}
        {result.similar_found && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">🔍 Images similaires :</Typography>
            <Chip
              label={`${result.similar_images?.length || 0} image(s) similaire(s) trouvée(s)`}
              color="info"
              size="small"
            />
          </Box>
        )}

        {/* Métadonnées */}
        {result.analysis?.metadata && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">📋 Métadonnées :</Typography>
            <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
              {JSON.stringify(result.analysis.metadata, null, 2)}
            </Typography>
          </Box>
        )}
      </Paper>
    );
  };

  const renderSteganographyResult = () => {
    if (!result) return null;

    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Signature ajoutée avec succès
        </Typography>

        {result.image_url && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Image avec signature :</Typography>
            <img
              src={`http://localhost:5000${result.image_url}`}
              alt="Image avec signature"
              style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain' }}
            />
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Signatures :</Typography>
          {result.user_signature && (
            <Chip label={`Utilisateur: ${result.user_signature}`} size="small" sx={{ mr: 1, mb: 1 }} />
          )}
          {result.context_signature && (
            <Chip label="Signature contextuelle générée" color="primary" size="small" />
          )}
        </Box>

        {result.ai_detection && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Analyse IA de l'image signée :</Typography>
            <Chip
              label={`Confiance: ${(result.ai_detection.confidence * 100).toFixed(1)}%`}
              color={result.ai_detection.confidence > 0.7 ? 'warning' : 'success'}
              size="small"
            />
          </Box>
        )}
      </Paper>
    );
  };

  const renderVerificationResult = () => {
    if (!result) return null;

    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Résultats de vérification
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Chip
              label={result.steganography_detected ? 'Stéganographie détectée' : 'Aucune stéganographie'}
              color={result.steganography_detected ? 'primary' : 'default'}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Chip
              label={result.signatures_match ? 'Signatures valides' : 'Signatures invalides'}
              color={result.signatures_match ? 'success' : 'error'}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Chip
              label={result.tampered ? 'Image modifiée' : 'Image intègre'}
              color={result.tampered ? 'error' : 'success'}
              sx={{ mb: 1 }}
            />
          </Grid>
        </Grid>

        {result.user_signature && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Signature utilisateur :</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {result.user_signature}
            </Typography>
          </Box>
        )}

        {result.similar_found && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Images similaires :</Typography>
            <Chip
              label={`${result.similar_images?.length || 0} trouvée(s)`}
              color="info"
              size="small"
            />
          </Box>
        )}
      </Paper>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          🧪 Laboratoire Flask - Stéganographie Avancée
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Analyser" icon={<Psychology />} />
            <Tab label="Signer" icon={<Security />} />
            <Tab label="Vérifier" icon={<VerifiedUser />} />
          </Tabs>
        </Box>

        {/* Sélection de fichier commune */}
        <Box sx={{ mb: 2 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUpload />}
            sx={{ mb: 2 }}
          >
            Choisir une image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileSelect}
            />
          </Button>
          {selectedFile && (
            <Typography variant="body2" color="text.secondary">
              Fichier sélectionné: {selectedFile.name}
            </Typography>
          )}
        </Box>

        {/* Tab 1: Analyser */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" paragraph>
            Analysez une image pour détecter la stéganographie, l'IA et rechercher des images similaires.
          </Typography>
          <Button
            variant="contained"
            onClick={uploadAndAnalyze}
            disabled={loading || !selectedFile}
            startIcon={loading ? <CircularProgress size={20} /> : <Psychology />}
          >
            {loading ? 'Analyse en cours...' : 'Analyser l\'image'}
          </Button>
          {renderAnalysisResult()}
        </TabPanel>

        {/* Tab 2: Signer */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="body1" paragraph>
            Ajoutez une signature stéganographique à votre image pour protéger son intégrité.
          </Typography>
          <TextField
            fullWidth
            label="Signature personnalisée (optionnelle)"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Ex: Mon copyright 2025"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={addSteganography}
            disabled={loading || !selectedFile}
            startIcon={loading ? <CircularProgress size={20} /> : <Security />}
          >
            {loading ? 'Signature en cours...' : 'Ajouter signature'}
          </Button>
          {renderSteganographyResult()}
        </TabPanel>

        {/* Tab 3: Vérifier */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body1" paragraph>
            Vérifiez l'intégrité d'une image signée et détectez les modifications.
          </Typography>
          <Button
            variant="contained"
            onClick={verifyIntegrity}
            disabled={loading || !selectedFile}
            startIcon={loading ? <CircularProgress size={20} /> : <VerifiedUser />}
          >
            {loading ? 'Vérification en cours...' : 'Vérifier l\'intégrité'}
          </Button>
          {renderVerificationResult()}
        </TabPanel>

        {/* Affichage des erreurs */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FlaskImageProcessor;
