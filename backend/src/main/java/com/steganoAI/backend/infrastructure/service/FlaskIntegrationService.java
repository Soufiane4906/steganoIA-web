package com.steganoAI.backend.infrastructure.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@Service
@Slf4j
public class FlaskIntegrationService {

    @Value("${flask.api.base-url:http://localhost:5000}")
    private String flaskBaseUrl;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private final RestTemplate restTemplate;

    public FlaskIntegrationService() {
        this.restTemplate = new RestTemplate();
    }

    public Map<String, Object> uploadAndAnalyzeImage(MultipartFile file) {
        try {
            // Sauvegarder le fichier temporairement
            Path tempFile = saveTemporaryFile(file);

            // Préparer la requête multipart
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new FileSystemResource(tempFile.toFile()));

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Appeler ton API Flask v2
            String url = flaskBaseUrl + "/api/v2/upload";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

            // Nettoyer le fichier temporaire
            Files.deleteIfExists(tempFile);

            return response.getBody();

        } catch (Exception e) {
            log.error("Erreur lors de l'appel à l'API Flask: {}", e.getMessage());
            throw new RuntimeException("Erreur lors de l'analyse de l'image", e);
        }
    }

    public Map<String, Object> addSteganography(MultipartFile file, String signature) {
        try {
            Path tempFile = saveTemporaryFile(file);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new FileSystemResource(tempFile.toFile()));
            if (signature != null && !signature.isEmpty()) {
                body.add("signature", signature);
            }

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            String url = flaskBaseUrl + "/api/v2/add_steganography";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

            Files.deleteIfExists(tempFile);

            return response.getBody();

        } catch (Exception e) {
            log.error("Erreur lors de l'ajout de stéganographie: {}", e.getMessage());
            throw new RuntimeException("Erreur lors de l'ajout de stéganographie", e);
        }
    }

    public Map<String, Object> verifyIntegrity(MultipartFile file) {
        try {
            Path tempFile = saveTemporaryFile(file);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new FileSystemResource(tempFile.toFile()));

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            String url = flaskBaseUrl + "/api/v2/verify_integrity";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

            Files.deleteIfExists(tempFile);

            return response.getBody();

        } catch (Exception e) {
            log.error("Erreur lors de la vérification d'intégrité: {}", e.getMessage());
            throw new RuntimeException("Erreur lors de la vérification d'intégrité", e);
        }
    }

    public Map<String, Object> testFlaskConnection() {
        try {
            String url = flaskBaseUrl + "/api/v2/test";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Erreur de connexion à Flask: {}", e.getMessage());
            throw new RuntimeException("Flask API non disponible", e);
        }
    }

    private Path saveTemporaryFile(MultipartFile file) throws IOException {
        // Créer le dossier d'upload s'il n'existe pas
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Générer un nom de fichier unique
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);

        // Sauvegarder le fichier
        file.transferTo(filePath.toFile());

        return filePath;
    }
}
