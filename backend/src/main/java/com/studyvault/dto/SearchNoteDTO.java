package com.studyvault.dto;

import com.studyvault.model.StudyNote;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchNoteDTO {

    private String searchTerm;
    private StudyNote.NoteStatus status;
    private List<String> tags;
    private Boolean isFavorite;
    private Boolean isArchived;
    private LocalDateTime dateFrom;
    private LocalDateTime dateTo;
    private String sortBy; // "updatedAt", "createdAt", "title"
    private String sortDirection; // "ASC", "DESC"
    private Integer page;
    private Integer size;
}