// backend/src/main/java/com/studyvault/controller/StudyNoteController.java
package com.studyvault.controller;

import com.studyvault.dto.*;
import com.studyvault.model.StudyNote;
import com.studyvault.service.StudyNoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudyNoteController {

    private final StudyNoteService service;

    @PostMapping
    public ResponseEntity<StudyNote> createNote(@Valid @RequestBody CreateNoteDTO dto) {
        return ResponseEntity.ok(service.createNote(dto));
    }

    @GetMapping
    public ResponseEntity<List<StudyNote>> getAllNotes() {
        return ResponseEntity.ok(service.getAllNotes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyNote> getNote(@PathVariable String id) {
        return ResponseEntity.ok(service.getNote(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudyNote> updateNote(
            @PathVariable String id,
            @Valid @RequestBody UpdateNoteDTO dto) {
        return ResponseEntity.ok(service.updateNote(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable String id) {
        service.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<StudyNote>> searchNotes(@RequestParam String q) {
        return ResponseEntity.ok(service.searchNotes(q));
    }
}