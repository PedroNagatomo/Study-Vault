// backend/src/main/java/com/studyvault/service/StudyNoteService.java
package com.studyvault.service;

import com.studyvault.dto.*;
import com.studyvault.model.StudyNote;
import com.studyvault.model.User;
import com.studyvault.repository.StudyNoteRepository;
import com.studyvault.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StudyNoteService {

    private final StudyNoteRepository repository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuário não autenticado");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public StudyNote createNote(CreateNoteDTO dto) {
        User currentUser = getCurrentUser();

        StudyNote note = StudyNote.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .plainText(extractPlainText(dto.getContent()))
                .status(StudyNote.NoteStatus.DRAFT)
                .tags(dto.getTags() != null ? dto.getTags() : List.of())
                .user(currentUser)
                .build();
        // Valores padrão já são definidos pelo @Builder.Default

        return repository.save(note);
    }

    public StudyNote updateNote(String id, UpdateNoteDTO dto) {
        User currentUser = getCurrentUser();
        StudyNote note = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota não encontrada"));

        // Verificar se a nota pertence ao usuário
        if (!note.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Acesso negado");
        }

        if (dto.getTitle() != null) note.setTitle(dto.getTitle());
        if (dto.getContent() != null) {
            note.setContent(dto.getContent());
            note.setPlainText(extractPlainText(dto.getContent()));
        }
        if (dto.getStatus() != null) note.setStatus(dto.getStatus());
        if (dto.getTags() != null) note.setTags(dto.getTags());
        if (dto.getColor() != null) note.setColor(dto.getColor());
        if (dto.getIcon() != null) note.setIcon(dto.getIcon());
        if (dto.getCoverImage() != null) note.setCoverImage(dto.getCoverImage());

        // CORREÇÃO: mapear isFavorite → favorite, isArchived → archived
        if (dto.getIsFavorite() != null) {
            note.setFavorite(dto.getIsFavorite());
        }
        if (dto.getIsArchived() != null) {
            note.setArchived(dto.getIsArchived());
        }

        return repository.save(note);
    }

    @Transactional(readOnly = true)
    public List<StudyNote> getAllNotes() {
        User currentUser = getCurrentUser();
        // CORREÇÃO: usar o nome do campo 'archived'
        return repository.findByUserAndArchivedFalseOrderByUpdatedAtDesc(currentUser);
    }

    @Transactional(readOnly = true)
    public StudyNote getNote(String id) {
        StudyNote note = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota não encontrada"));

        User currentUser = getCurrentUser();
        if (!note.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Acesso negado");
        }

        return note;
    }

    @Transactional(readOnly = true)
    public List<StudyNote> searchNotes(String term) {
        User currentUser = getCurrentUser();
        return repository.searchUserNotes(currentUser, term);
    }

    public void deleteNote(String id) {
        StudyNote note = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota não encontrada"));

        User currentUser = getCurrentUser();
        if (!note.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Acesso negado");
        }

        repository.delete(note);
    }

    private String extractPlainText(String htmlContent) {
        if (htmlContent == null) return "";
        return htmlContent.replaceAll("<[^>]*>", "")
                .replaceAll("&nbsp;", " ")
                .replaceAll("&amp;", "&")
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("&quot;", "\"")
                .trim();
    }
}