import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Box,
  Paper,
  IconButton,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Divider,
} from "@mui/material";
import {
  Save,
  Archive,
  Star,
  StarBorder,
  ColorLens,
  ArrowBack,
  Tag,
} from "@mui/icons-material";
import { RichTextEditor } from "../components/editor/RichTextEditor";
import { noteService } from "../services/noteService";

interface StudyNote {
  title: string;
  content: string;
  tags: string[];
  color: string;
  icon: string;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
  isFavorite: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const COLORS = [
  "#FFFFFF", "#FFF8E1", "#E8F5E9", "#E3F2FD", "#F3E5F5",
  "#FFE0B2", "#C8E6C9", "#BBDEFB", "#FFCDD2", "#D1C4E9",
  "#B2DFDB", "#F0F4C3",
];

const ICONS = [
  "📚", "📝", "💡", "🎯", "📖", "✏️",
  "🔬", "💻", "📊", "🧠", "🎓", "📌",
];

const statusConfig = {
  DRAFT:       { label: "Rascunho",     color: "default"  },
  IN_PROGRESS: { label: "Em Progresso", color: "warning"  },
  COMPLETED:   { label: "Concluído",    color: "success"  },
} as const;

export const NoteEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<StudyNote>({
    title: "",
    content: "",
    tags: [],
    color: "#FFFFFF",
    icon: "📝",
    status: "DRAFT",
    isFavorite: false,
    isArchived: false,
  });
  const [colorDialog, setColorDialog] = useState(false);
  const [iconDialog, setIconDialog] = useState(false);

  useEffect(() => {
    if (id && id !== "new") {
      loadNote(id);
    }
  }, [id]);

  const loadNote = async (noteId: string) => {
    try {
      const data = await noteService.getNote(noteId);
      setNote({
        ...data,
        color: data.color || "#FFFFFF",
        icon: data.icon || "📝",
        tags: data.tags || [],
        status: data.status || "DRAFT",
        isFavorite: data.isFavorite || false,
        isArchived: data.isArchived || false,
      });
    } catch (error) {
      console.error("Erro ao carregar nota:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (id && id !== "new") {
        await noteService.updateNote(id, note);
      } else {
        await noteService.createNote(note);
      }
      navigate("/");
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleTagAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const input = event.target as HTMLInputElement;
      const newTag = input.value.trim();
      if (newTag && !note.tags.includes(newTag)) {
        setNote({ ...note, tags: [...note.tags, newTag] });
        input.value = "";
      }
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setNote({ ...note, tags: note.tags.filter((tag) => tag !== tagToDelete) });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "grey.50",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: "14px",
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            backgroundColor: "background.paper",
          }}
        >
          {/* Top bar */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 2, pt: 2, pb: 1.5 }}
          >
            {/* Back + icon + title */}
            <Stack direction="row" spacing={1} alignItems="center" flex={1} minWidth={0}>
              <Tooltip title="Voltar">
                <IconButton
                  onClick={() => navigate("/")}
                  size="small"
                  sx={{
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: "divider",
                    color: "text.secondary",
                    "&:hover": { backgroundColor: "action.hover", borderColor: "text.disabled" },
                  }}
                >
                  <ArrowBack fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Trocar ícone">
                <IconButton
                  onClick={() => setIconDialog(true)}
                  sx={{
                    borderRadius: "10px",
                    width: 42, height: 42,
                    fontSize: "1.3rem",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  {note.icon}
                </IconButton>
              </Tooltip>

              <TextField
                fullWidth
                variant="standard"
                placeholder="Título da nota..."
                value={note.title}
                onChange={(e) => setNote({ ...note, title: e.target.value })}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  },
                }}
                inputProps={{ style: { padding: 0 } }}
                sx={{ "& input::placeholder": { color: "text.disabled" } }}
              />
            </Stack>

            {/* Actions */}
            <Stack direction="row" spacing={0.75} alignItems="center" flexShrink={0}>
              <ToggleButtonGroup
                value={note.status}
                exclusive
                onChange={(_e, newStatus) => {
                  if (newStatus) setNote({ ...note, status: newStatus });
                }}
                size="small"
                sx={{
                  "& .MuiToggleButton-root": {
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "8px !important",
                    px: 1.5,
                    py: 0.5,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    textTransform: "none",
                    color: "text.secondary",
                    "&.Mui-selected": { fontWeight: 600 },
                  },
                  "& .MuiToggleButtonGroup-grouped:not(:first-of-type)": {
                    ml: 0.5,
                    borderLeft: "1px solid",
                    borderColor: "divider",
                  },
                }}
              >
                <ToggleButton value="DRAFT">Rascunho</ToggleButton>
                <ToggleButton value="IN_PROGRESS">Em Progresso</ToggleButton>
                <ToggleButton value="COMPLETED">Concluído</ToggleButton>
              </ToggleButtonGroup>

              <Divider orientation="vertical" flexItem sx={{ mx: 0.25, my: 0.5 }} />

              <Tooltip title={note.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
                <IconButton
                  onClick={() => setNote({ ...note, isFavorite: !note.isFavorite })}
                  size="small"
                  sx={{ borderRadius: "8px", "&:hover": { backgroundColor: "action.hover" } }}
                >
                  {note.isFavorite ? <Star sx={{ color: "warning.main", fontSize: 20 }} /> : <StarBorder sx={{ fontSize: 20, color: "text.secondary" }} />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Cor de fundo">
                <IconButton
                  onClick={() => setColorDialog(true)}
                  size="small"
                  sx={{ borderRadius: "8px", color: "text.secondary", "&:hover": { backgroundColor: "action.hover" } }}
                >
                  <ColorLens sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Arquivar">
                <IconButton
                  size="small"
                  sx={{ borderRadius: "8px", color: "text.secondary", "&:hover": { backgroundColor: "action.hover" } }}
                >
                  <Archive sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                startIcon={<Save sx={{ fontSize: "18px !important" }} />}
                onClick={handleSave}
                disableElevation
                sx={{
                  borderRadius: "8px",
                  fontWeight: 600,
                  px: 2,
                  textTransform: "none",
                  fontSize: "0.875rem",
                }}
              >
                Salvar
              </Button>
            </Stack>
          </Stack>

          {/* Tags */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{
              px: 2, pb: 1.75,
              flexWrap: "wrap",
              gap: 0.75,
              borderTop: note.tags.length > 0 ? "1px solid" : "none",
              borderColor: "divider",
              pt: note.tags.length > 0 ? 1.5 : 0,
            }}
          >
            {note.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleTagDelete(tag)}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ borderRadius: "6px", fontSize: "0.75rem", height: 26 }}
              />
            ))}
            <TextField
              size="small"
              placeholder="Adicionar tag..."
              onKeyPress={handleTagAdd}
              InputProps={{
                startAdornment: <Tag sx={{ mr: 0.5, fontSize: 16, color: "text.disabled" }} />,
                sx: { borderRadius: "8px", fontSize: "0.8rem" },
              }}
              sx={{
                width: 160,
                "& .MuiOutlinedInput-root": {
                  height: 28,
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "text.disabled" },
                },
              }}
            />
          </Stack>
        </Paper>

        {/* Editor */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "14px",
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            backgroundColor: note.color,
            transition: "background-color 0.3s ease",
          }}
        >
          <RichTextEditor
            content={note.content}
            onChange={(content) => setNote({ ...note, content })}
          />
        </Paper>

        {/* Dialog de Cores */}
        <Dialog
          open={colorDialog}
          onClose={() => setColorDialog(false)}
          PaperProps={{ sx: { borderRadius: "14px", minWidth: 320 } }}
        >
          <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>Cor de fundo</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", pt: 0.5 }}>
              {COLORS.map((color) => (
                <Box
                  key={color}
                  onClick={() => { setNote({ ...note, color }); setColorDialog(false); }}
                  sx={{
                    width: 44, height: 44,
                    bgcolor: color,
                    border: "2px solid",
                    borderColor: note.color === color ? "primary.main" : "divider",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    "&:hover": { transform: "scale(1.1)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
                  }}
                />
              ))}
            </Box>
          </DialogContent>
        </Dialog>

        {/* Dialog de Ícones */}
        <Dialog
          open={iconDialog}
          onClose={() => setIconDialog(false)}
          PaperProps={{ sx: { borderRadius: "14px" } }}
        >
          <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>Ícone da nota</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", pt: 0.5 }}>
              {ICONS.map((icon) => (
                <IconButton
                  key={icon}
                  onClick={() => { setNote({ ...note, icon }); setIconDialog(false); }}
                  sx={{
                    fontSize: "1.8rem",
                    width: 52, height: 52,
                    borderRadius: "10px",
                    border: "2px solid",
                    borderColor: note.icon === icon ? "primary.main" : "divider",
                    transition: "all 0.15s",
                    "&:hover": { transform: "scale(1.1)", backgroundColor: "action.hover" },
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};