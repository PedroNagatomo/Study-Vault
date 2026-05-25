package com.studyvault.dto;

import com.studyvault.model.StudyNote.NoteStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateNoteDTO {
    private String title;
    private String content;
    private NoteStatus status;
    private List<String> tags;
    private String color;
    private String icon;
    private String coverImage;
    private Boolean isFavorite;    // Mantemos o nome amigável na API
    private Boolean isArchived;    // Mantemos o nome amigável na API
}