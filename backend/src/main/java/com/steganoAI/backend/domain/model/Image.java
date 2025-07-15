package com.steganoAI.backend.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "images")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String imagePath;
    private String perceptualHash;
    private String md5Hash;

    @Column(name = "ai_confidence")
    private Double aiConfidence;

    @Column(name = "has_steganography")
    private Boolean hasSteganography;

    @Column(columnDefinition = "TEXT")
    private String metadataJson;

    @Column(name = "upload_timestamp")
    private LocalDateTime uploadTimestamp;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "analysis_status")
    private String analysisStatus; // PENDING, COMPLETED, FAILED

    @Column(columnDefinition = "TEXT")
    private String analysisResults;
}
