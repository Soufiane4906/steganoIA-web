package com.steganoAI.backend.presentation.controller;

import com.steganoAI.backend.application.service.ImageApplicationService;
import com.steganoAI.backend.domain.model.Image;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class ImageController {
    private final ImageApplicationService imageApplicationService;

    public ImageController(ImageApplicationService imageApplicationService) {
        this.imageApplicationService = imageApplicationService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAndAnalyzeImage(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Aucun fichier fourni");
            }

            Image result = imageApplicationService.uploadAndAnalyzeImage(file, authentication.getName());
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Erreur upload image: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Erreur lors de l'upload: " + e.getMessage());
        }
    }

    @PostMapping(value = "/steganography", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addSteganography(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "signature", required = false) String signature,
            Authentication authentication) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Aucun fichier fourni");
            }

            Image result = imageApplicationService.addSteganographyToImage(file, signature, authentication.getName());
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Erreur ajout stéganographie: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Erreur lors de l'ajout de stéganographie: " + e.getMessage());
        }
    }

    @PostMapping(value = "/verify", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> verifyIntegrity(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Aucun fichier fourni");
            }

            Map<String, Object> result = imageApplicationService.verifyImageIntegrity(file);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Erreur vérification intégrité: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Erreur lors de la vérification: " + e.getMessage());
        }
    }

    @GetMapping("/my-images")
    public ResponseEntity<List<Image>> getUserImages(Authentication authentication) {
        try {
            List<Image> images = imageApplicationService.getUserImages(authentication.getName());
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            log.error("Erreur récupération images utilisateur: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<Image>> getAllImages(Authentication authentication) {
        try {
            // Seuls les admins peuvent voir toutes les images
            if (!authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }

            List<Image> images = imageApplicationService.getAllImages();
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            log.error("Erreur récupération toutes les images: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Image> getImageById(@PathVariable Long id, Authentication authentication) {
        try {
            Image image = imageApplicationService.getImageById(id)
                    .orElse(null);

            if (image == null) {
                return ResponseEntity.notFound().build();
            }

            // Vérifier les permissions (propriétaire ou admin)
            boolean isOwner = image.getUser().getUsername().equals(authentication.getName());
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            if (!isOwner && !isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }

            return ResponseEntity.ok(image);
        } catch (Exception e) {
            log.error("Erreur récupération image par ID: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/steganography")
    public ResponseEntity<List<Image>> getImagesWithSteganography(Authentication authentication) {
        try {
            // Seuls les admins peuvent voir toutes les images avec stéganographie
            if (!authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }

            List<Image> images = imageApplicationService.getImagesWithSteganography();
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            log.error("Erreur récupération images avec stéganographie: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/ai-detected")
    public ResponseEntity<List<Image>> getHighAiConfidenceImages(
            @RequestParam(defaultValue = "0.7") Double threshold,
            Authentication authentication) {
        try {
            // Seuls les admins peuvent voir les statistiques IA
            if (!authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }

            List<Image> images = imageApplicationService.getHighAiConfidenceImages(threshold);
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            log.error("Erreur récupération images IA: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable Long id, Authentication authentication) {
        try {
            imageApplicationService.deleteImage(id, authentication.getName());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Erreur suppression image: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Erreur lors de la suppression: " + e.getMessage());
        }
    }

    @GetMapping("/test-flask")
    public ResponseEntity<?> testFlaskConnection() {
        try {
            Map<String, Object> result = imageApplicationService.testFlaskConnection();
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Connexion Flask réussie",
                "flask_response", result,
                "timestamp", java.time.LocalDateTime.now()
            ));
        } catch (Exception e) {
            log.error("Erreur test Flask: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                    "status", "error",
                    "message", "Flask API non disponible",
                    "error", e.getMessage(),
                    "timestamp", java.time.LocalDateTime.now()
                ));
        }
    }

    @GetMapping("/flask-status")
    public ResponseEntity<?> getFlaskStatus() {
        try {
            Map<String, Object> flaskTest = imageApplicationService.testFlaskConnection();
            return ResponseEntity.ok(Map.of(
                "flask_connected", true,
                "flask_url", "http://127.0.0.1:5000",
                "flask_status", flaskTest,
                "services_available", Map.of(
                    "ai_detection", true,
                    "steganography", true,
                    "image_processing", true
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "flask_connected", false,
                "flask_url", "http://127.0.0.1:5000",
                "error", e.getMessage(),
                "message", "Assurez-vous que votre serveur Flask est démarré sur le port 5000"
            ));
        }
    }
}
