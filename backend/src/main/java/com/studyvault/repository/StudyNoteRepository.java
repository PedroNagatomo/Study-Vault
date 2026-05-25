// backend/src/main/java/com/studyvault/repository/StudyNoteRepository.java
package com.studyvault.repository;

import com.studyvault.model.StudyNote;
import com.studyvault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudyNoteRepository extends JpaRepository<StudyNote, String> {

    // CORREÇÃO: usar 'archived' e 'favorite' (nomes reais dos campos)
    List<StudyNote> findByUserAndArchivedFalseOrderByUpdatedAtDesc(User user);

    List<StudyNote> findByUserAndStatusOrderByUpdatedAtDesc(User user, StudyNote.NoteStatus status);

    List<StudyNote> findByUserAndFavoriteTrueAndArchivedFalse(User user);

    @Query("SELECT n FROM StudyNote n WHERE n.user = :user AND " +
            "n.archived = false AND " +
            "(LOWER(n.plainText) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(n.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<StudyNote> searchUserNotes(User user, String searchTerm);

    @Query("SELECT n FROM StudyNote n WHERE n.user = :user AND :tag MEMBER OF n.tags")
    List<StudyNote> findByUserAndTag(User user, String tag);

    List<StudyNote> findByUserAndCreatedAtBetween(
            User user,
            java.time.LocalDateTime start,
            java.time.LocalDateTime end
    );
}