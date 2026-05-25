// backend/src/main/java/com/studyvault/dto/NoteStatisticsDTO.java
package com.studyvault.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteStatisticsDTO {

    private long totalNotes;
    private long draftNotes;
    private long inProgressNotes;
    private long completedNotes;
    private long favoriteNotes;
    private long archivedNotes;
    private Map<String, Long> notesByTag;
    private long notesCreatedThisWeek;
    private long notesCreatedThisMonth;
}