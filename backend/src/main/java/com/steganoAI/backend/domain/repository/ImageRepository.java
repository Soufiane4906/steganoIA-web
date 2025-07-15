package com.steganoAI.backend.domain.repository;

import com.steganoAI.backend.domain.model.Image;
import com.steganoAI.backend.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByUser(User user);
    List<Image> findByUserOrderByUploadTimestampDesc(User user);
    List<Image> findByHasSteganographyTrue();
    List<Image> findByAnalysisStatus(String status);

    @Query("SELECT i FROM Image i WHERE i.aiConfidence > :threshold")
    List<Image> findByAiConfidenceGreaterThan(@Param("threshold") Double threshold);

    @Query("SELECT i FROM Image i WHERE i.user.id = :userId AND i.analysisStatus = :status")
    List<Image> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);
}
