// frontend/src/services/noteService.ts
import api from './api';
import { StudyNote, CreateNoteDTO, UpdateNoteDTO } from '../types/note';

export const noteService = {
  getAllNotes: async (): Promise<StudyNote[]> => {
    const response = await api.get('/notes');
    return response.data;
  },

  getNote: async (id: string): Promise<StudyNote> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  createNote: async (note: CreateNoteDTO): Promise<StudyNote> => {
    const response = await api.post('/notes', note);
    return response.data;
  },

  updateNote: async (id: string, note: UpdateNoteDTO): Promise<StudyNote> => {
    const response = await api.put(`/notes/${id}`, note);
    return response.data;
  },

  deleteNote: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },

  searchNotes: async (query: string): Promise<StudyNote[]> => {
    const response = await api.get(`/notes/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};