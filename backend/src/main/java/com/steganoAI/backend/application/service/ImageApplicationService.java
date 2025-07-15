package com.steganoAI.backend.application.service;

import com.steganoAI.backend.domain.model.Image;
import com.steganoAI.backend.domain.model.User;
import com.steganoAI.backend.domain.service.ImageDomainService;
import com.steganoAI.backend.domain.service.UserDomainService;
import com.steganoAI.backend.infrastructure.service.FlaskIntegrationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class ImageApplicationService {
    private final ImageDomainService imageDomainService;
    private final UserDomainService userDomainService;
    private final FlaskIntegrationService flaskService;
    private final ObjectMapper objectMapper;

    public ImageApplicationService(ImageDomainService imageDomainService,
                                 UserDomainService userDomainService,
                                 FlaskIntegrationService flaskService) {
        this.imageDomainService = imageDomainService;
        this.userDomainService = userDomainService;
        this.flaskService = flaskService;
        this.objectMapper = new ObjectMapper();
    }

    public Image uploadAndAnalyzeImage(MultipartFile file, String username) {
        try {
            // Récupérer l'utilisateur
            User user = userDomainService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // Créer l'entrée image en base avec statut PENDING
            Image image = new Image();
            image.setFilename(file.getOriginalFilename());
            image.setUser(user);
            image.setUploadTimestamp(LocalDateTime.now());
            image.setAnalysisStatus("PENDING");

            Image savedImage = imageDomainService.save(image);

            // Lancer l'analyse via Flask en arrière-plan
            try {
                Map<String, Object> analysisResult = flaskService.uploadAndAnalyzeImage(file);

                // Mettre à jour l'image avec les résultats
                updateImageWithAnalysisResults(savedImage, analysisResult);
                savedImage.setAnalysisStatus("COMPLETED");

            } catch (Exception e) {
                log.error("Erreur lors de l'analyse Flask: {}", e.getMessage());
                savedImage.setAnalysisStatus("FAILED");
                savedImage.setAnalysisResults("Erreur: " + e.getMessage());
            }

            return imageDomainService.save(savedImage);

        } catch (Exception e) {
            log.error("Erreur lors de l'upload d'image: {}", e.getMessage());
            throw new RuntimeException("Erreur lors de l'upload d'image", e);
        }
    }

    public Image addSteganographyToImage(MultipartFile file, String signature, String username) {
        try {
            User user = userDomainService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // Appeler Flask pour ajouter la stéganographie
            Map<String, Object> result = flaskService.addSteganography(file, signature);

            // Créer l'entrée en base
            Image image = new Image();
            image.setFilename(file.getOriginalFilename());
            image.setUser(user);
            image.setUploadTimestamp(LocalDateTime.now());
            image.setHasSteganography(true);
            image.setAnalysisStatus("COMPLETED");

            updateImageWithAnalysisResults(image, result);

            return imageDomainService.save(image);

        } catch (Exception e) {
            log.error("Erreur lors de l'ajout de stéganographie: {}", e.getMessage());
            throw new RuntimeException("Erreur lors de l'ajout de stéganographie", e);
        }
    }

    public Map<String, Object> verifyImageIntegrity(MultipartFile file) {
        try {
            return flaskService.verifyIntegrity(file);
        } catch (Exception e) {
            log.error("Erreur lors de la vérification d'intégrité: {}", e.getMessage());
            throw new RuntimeException("Erreur lors de la vérification d'intégrité", e);
        }
    }

    public List<Image> getUserImages(String username) {
        User user = userDomainService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return imageDomainService.getImagesByUser(user);
    }

    public List<Image> getAllImages() {
        return imageDomainService.getAllImages();
    }

    public Optional<Image> getImageById(Long id) {
        return imageDomainService.getImageById(id);
    }

    public List<Image> getImagesWithSteganography() {
        return imageDomainService.getImagesWithSteganography();
    }

    public List<Image> getHighAiConfidenceImages(Double threshold) {
        return imageDomainService.getHighAiConfidenceImages(threshold);
    }

    public void deleteImage(Long id, String username) {
        Image image = imageDomainService.getImageById(id)
                .orElseThrow(() -> new RuntimeException("Image non trouvée"));

        User user = userDomainService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier que l'utilisateur peut supprimer cette image (propriétaire ou admin)
        if (!image.getUser().getId().equals(user.getId()) && !user.getRole().equals("ADMIN")) {
            throw new RuntimeException("Accès refusé");
        }

        imageDomainService.deleteImage(id);
    }

    public Map<String, Object> testFlaskConnection() {
        return flaskService.testFlaskConnection();
    }

    private void updateImageWithAnalysisResults(Image image, Map<String, Object> analysisResult) {
        try {
            // Extraire les informations importantes du résultat Flask
            if (analysisResult.containsKey("analysis")) {
                Map<String, Object> analysis = (Map<String, Object>) analysisResult.get("analysis");

                // Détection IA
                if (analysis.containsKey("ai_detection")) {
                    Map<String, Object> aiDetection = (Map<String, Object>) analysis.get("ai_detection");
                    if (aiDetection.containsKey("confidence")) {
                        image.setAiConfidence(((Number) aiDetection.get("confidence")).doubleValue());
                    }
                }

                // Stéganographie
                if (analysis.containsKey("steganography")) {
                    Map<String, Object> stego = (Map<String, Object>) analysis.get("steganography");
                    if (stego.containsKey("signature_detected")) {
                        image.setHasSteganography((Boolean) stego.get("signature_detected"));
                    }
                }
            }

            // Hashes
            if (analysisResult.containsKey("perceptual_hashes")) {
                Map<String, Object> hashes = (Map<String, Object>) analysisResult.get("perceptual_hashes");
                if (hashes.containsKey("phash")) {
                    image.setPerceptualHash((String) hashes.get("phash"));
                }
            }

            // Chemin de l'image
            if (analysisResult.containsKey("image_path")) {
                image.setImagePath((String) analysisResult.get("image_path"));
            }

            // Sauvegarder tous les résultats comme JSON
            image.setAnalysisResults(objectMapper.writeValueAsString(analysisResult));

        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour des résultats d'analyse: {}", e.getMessage());
        }
    }
}
