// src/types/note.ts
export interface StudyNote {
  id?: string;
  title: string;
  content: string;
  plainText?: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';
  tags: string[];
  color: string;
  icon: string;
  coverImage?: string;
  isFavorite: boolean;
  isArchived?: boolean;  // Certifique-se que esta linha existe
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNoteDTO {
  title: string;
  content: string;
  tags?: string[];
  color?: string;
  icon?: string;
  status?: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface UpdateNoteDTO {
  title?: string;
  content?: string;
  status?: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';
  tags?: string[];
  color?: string;
  icon?: string;
  coverImage?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
}