package com.steganoAI.backend.domain.service;

import com.steganoAI.backend.domain.model.Image;
import com.steganoAI.backend.domain.model.User;
import com.steganoAI.backend.domain.repository.ImageRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ImageDomainService {
    private final ImageRepository imageRepository;

    public ImageDomainService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public List<Image> getAllImages() {
        return imageRepository.findAll();
    }

    public Optional<Image> getImageById(Long id) {
        return imageRepository.findById(id);
    }

    public List<Image> getImagesByUser(User user) {
        return imageRepository.findByUserOrderByUploadTimestampDesc(user);
    }

    public List<Image> getImagesByUserId(Long userId, String status) {
        return imageRepository.findByUserIdAndStatus(userId, status);
    }

    public List<Image> getImagesWithSteganography() {
        return imageRepository.findByHasSteganographyTrue();
    }

    public List<Image> getImagesByStatus(String status) {
        return imageRepository.findByAnalysisStatus(status);
    }

    public List<Image> getHighAiConfidenceImages(Double threshold) {
        return imageRepository.findByAiConfidenceGreaterThan(threshold);
    }

    public Image save(Image image) {
        return imageRepository.save(image);
    }

    public void deleteImage(Long id) {
        imageRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return imageRepository.existsById(id);
    }
}
