// backend/src/main/java/com/studyvault/dto/NoteResponseDTO.java
package com.studyvault.dto;

import com.studyvault.model.StudyNote;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteResponseDTO {

    private String id;
    private String title;
    private String content;
    private String plainText;
    private StudyNote.NoteStatus status;
    private List<String> tags;
    private String color;
    private String icon;
    private String coverImage;
    private boolean isFavorite;
    private boolean isArchived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static NoteResponseDTO fromEntity(StudyNote note) {
        return NoteResponseDTO.builder()
                .id(note.getId())
                .title(note.getTitle())
                .content(note.getContent())
                .plainText(note.getPlainText())
                .status(note.getStatus())
                .tags(note.getTags())
                .color(note.getColor())
                .icon(note.getIcon())
                .coverImage(note.getCoverImage())
                .isFavorite(note.isFavorite())
                .isArchived(note.isArchived())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();
    }
}