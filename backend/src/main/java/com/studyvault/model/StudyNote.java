package com.studyvault.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "study_notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyNote {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "plain_text", columnDefinition = "TEXT")
    private String plainText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NoteStatus status;

    @ElementCollection
    @CollectionTable(name = "note_tags",
            joinColumns = @JoinColumn(name = "note_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @Column(name = "color", length = 7)
    private String color;

    @Column(name = "icon")
    private String icon;

    @Column(name = "cover_image")
    private String coverImage;

    // CORREÇÃO: Usar @Builder.Default para evitar warnings
    @Builder.Default
    @Column(name = "is_favorite", nullable = false)
    private boolean favorite = false;

    @Builder.Default
    @Column(name = "is_archived", nullable = false)
    private boolean archived = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum NoteStatus {
        DRAFT, IN_PROGRESS, COMPLETED
    }
}