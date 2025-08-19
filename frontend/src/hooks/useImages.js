import { useState, useEffect } from 'react';
import { imageService } from '../services/api';

// Hook pour gérer l'upload et l'analyse d'images
export const useImageUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const uploadImage = async (file, type = 'analyze', signature = '') => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let response;

      switch (type) {
        case 'analyze':
          response = await imageService.uploadAndAnalyzeImage(file);
          break;
        case 'steganography':
          response = await imageService.addSteganography(file, signature);
          break;
        case 'verify':
          response = await imageService.verifyIntegrity(file);
          break;
        default:
          throw new Error('Type d\'opération non supporté');
      }

      setResult(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setResult(null);
  };

  return {
    loading,
    error,
    result,
    uploadImage,
    reset
  };
};

// Hook pour gérer la liste des images
export const useImageList = (filter = 'user') => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      switch (filter) {
        case 'user':
          response = await imageService.getUserImages();
          break;
        case 'all':
          response = await imageService.getAllImages();
          break;
        case 'steganography':
          response = await imageService.getImagesWithSteganography();
          break;
        case 'ai-detected':
          response = await imageService.getAiDetectedImages();
          break;
        default:
          response = await imageService.getUserImages();
      }

      setImages(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id) => {
    try {
      await imageService.deleteImage(id);
      setImages(images.filter(img => img.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchImages();
  }, [filter]);

  return {
    images,
    loading,
    error,
    fetchImages,
    deleteImage,
    refetch: fetchImages
  };
};
