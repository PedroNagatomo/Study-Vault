// src/pages/NotesList.tsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  SpeedDial,
  SpeedDialIcon,
  Menu,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Box,
  Divider,
  alpha,
  Avatar,
  Tooltip,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Search,
  Star,
  StarBorder,
  ViewList,
  ViewModule,
  SortByAlpha,
  AccessTime,
  FilterList,
  CheckCircleOutline,
  RadioButtonUnchecked,
  Pending,
  Logout,
  Person,
  Settings,
  HelpOutline,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { noteService } from "../services/noteService";
import { useAuth } from "../contexts/AuthContext";

interface StudyNote {
  id?: string;
  title: string;
  content: string;
  status: string;
  tags: string[];
  color?: string;
  icon?: string;
  isFavorite: boolean;
  updatedAt?: string;
}

const statusConfig: Record<
  string,
  {
    label: string;
    color: "default" | "success" | "warning";
    icon: React.ReactNode;
  }
> = {
  COMPLETED: {
    label: "Concluído",
    color: "success",
    icon: <CheckCircleOutline sx={{ fontSize: 12 }} />,
  },
  IN_PROGRESS: {
    label: "Em progresso",
    color: "warning",
    icon: <Pending sx={{ fontSize: 12 }} />,
  },
  DRAFT: {
    label: "Rascunho",
    color: "default",
    icon: <RadioButtonUnchecked sx={{ fontSize: 12 }} />,
  },
};

const filterConfig = [
  { key: "ALL", label: "Todas" },
  { key: "DRAFT", label: "Rascunhos" },
  { key: "IN_PROGRESS", label: "Em progresso" },
  { key: "COMPLETED", label: "Concluídas" },
] as const;

// ─── Card ─────────────────────────────────────────────────────────────────────

const SortableNoteCard: React.FC<{ note: StudyNote }> = ({ note }) => {
  const navigate = useNavigate();
  const { setNodeRef, transform, transition } = useSortable({
    id: note.id || "temp",
  });

  const status = statusConfig[note.status] ?? statusConfig.DRAFT;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Strip HTML tags for preview text
  const plainText = note.content.replace(/<[^>]*>/g, "").slice(0, 160);

  return (
    <Grid item xs={12} sm={6} md={4} ref={setNodeRef} style={style}>
      <Card
        onClick={() => navigate(`/note/${note.id}`)}
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          backgroundColor: note.color || "#FFFFFF",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "16px",
          position: "relative",
          overflow: "hidden",
          transition:
            "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.07)",
            borderColor: "transparent",
          },
          "&:active": {
            transform: "translateY(0)",
          },
          // Thin accent bar on top based on status
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            backgroundColor:
              note.status === "COMPLETED"
                ? "success.light"
                : note.status === "IN_PROGRESS"
                  ? "warning.light"
                  : "transparent",
          },
        }}
      >
        <CardContent sx={{ flex: 1, pt: 2.5, pb: 0, px: 2.25 }}>
          {/* Header row */}
          <Stack direction="row" alignItems="flex-start" spacing={1} mb={1.5}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor: "rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                flexShrink: 0,
              }}
            >
              {note.icon || "📝"}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  lineHeight: 1.35,
                  letterSpacing: "-0.01em",
                  color: "text.primary",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {note.title || "Sem título"}
              </Typography>
            </Box>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                // Toggle favorite
                noteService
                  .updateNote(note.id!, { isFavorite: !note.isFavorite } as any)
                  .then(() => {
                    note.isFavorite = !note.isFavorite;
                  })
                  .catch(console.error);
              }}
              sx={{
                mt: "-4px",
                mr: "-6px",
                borderRadius: "8px",
                width: 28,
                height: 28,
                flexShrink: 0,
                color: note.isFavorite ? "warning.main" : "text.disabled",
                transition: "color 0.15s",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.05)",
                  color: note.isFavorite ? "warning.dark" : "text.secondary",
                },
              }}
            >
              {note.isFavorite ? (
                <Star sx={{ fontSize: 16 }} />
              ) : (
                <StarBorder sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Stack>

          {/* Preview text */}
          {plainText && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: "0.78rem",
                lineHeight: 1.65,
                mb: 1.75,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {plainText}
            </Typography>
          )}

          {/* Tags */}
          {note.tags?.length > 0 && (
            <Stack
              direction="row"
              spacing={0.5}
              flexWrap="wrap"
              gap={0.5}
              mb={0.5}
            >
              {note.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.67rem",
                    fontWeight: 500,
                    borderRadius: "5px",
                    backgroundColor: "rgba(0,0,0,0.06)",
                    color: "text.secondary",
                    border: "none",
                    "& .MuiChip-label": { px: "6px" },
                  }}
                />
              ))}
            </Stack>
          )}
        </CardContent>

        {/* Footer */}
        <CardActions
          disableSpacing
          sx={{
            px: 2.25,
            pt: 1.25,
            pb: 1.75,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.68rem",
              color: "text.disabled",
              fontWeight: 400,
              letterSpacing: "0.01em",
            }}
          >
            {note.updatedAt
              ? new Date(note.updatedAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Sem data"}
          </Typography>

          <Chip
            icon={status.icon as any}
            label={status.label}
            size="small"
            color={status.color}
            variant="outlined"
            sx={{
              height: 22,
              borderRadius: "6px",
              fontSize: "0.67rem",
              fontWeight: 600,
              letterSpacing: "0.01em",
              "& .MuiChip-icon": { fontSize: 11, ml: "5px" },
              "& .MuiChip-label": { pr: "7px" },
            }}
          />
        </CardActions>
      </Card>
    </Grid>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export const NotesList: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"updated" | "alpha">("updated");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await noteService.getAllNotes();
      setNotes(data);
    } catch (error) {
      console.error("Erro ao carregar notas:", error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Implementar reordenação
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredNotes = notes
    .filter(
      (note) =>
        searchTerm === "" ||
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((note) => filterStatus === "ALL" || note.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "alpha") return a.title.localeCompare(b.title);
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });

  const countByStatus = (key: string) =>
    key === "ALL" ? notes.length : notes.filter((n) => n.status === key).length;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: (t) => t.palette.grey[50] }}>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        {/* ── Topbar ── */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: "18px",
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            bgcolor: "background.paper",
          }}
        >
          {/* Brand + user + search + controls */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1.5}
            sx={{ px: 3, pt: 2.5, pb: 2 }}
          >
            {/* Brand + User */}
            <Stack direction="row" alignItems="center" spacing={2}>
              {/* Brand */}
              <Stack direction="row" alignItems="center" spacing={1.25}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                  }}
                >
                  📚
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                      color: "text.primary",
                    }}
                  >
                    StudyVault
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      color: "text.disabled",
                      lineHeight: 1,
                    }}
                  >
                    {notes.length} nota{notes.length !== 1 ? "s" : ""}
                  </Typography>
                </Box>
              </Stack>

              {/* User info */}
              {user && (
                <Box
                  onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "background-color 0.15s",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
                      color: "primary.main",
                    }}
                  >
                    {user.fullName?.charAt(0) ||
                      user.username?.charAt(0) ||
                      "U"}
                  </Avatar>
                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        lineHeight: 1.1,
                        color: "text.primary",
                      }}
                    >
                      {user.fullName || user.username}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        color: "text.disabled",
                        lineHeight: 1,
                      }}
                    >
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Stack>

            {/* User Menu */}
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={() => setUserMenuAnchor(null)}
              transformOrigin={{ horizontal: "left", vertical: "top" }}
              anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
              PaperProps={{
                elevation: 0,
                sx: {
                  mt: 0.75,
                  minWidth: 220,
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
                  p: 0.5,
                  overflow: "visible",
                },
              }}
            >
              {/* User info header */}
              <Box sx={{ px: 1.5, py: 1.25, mb: 0.5 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "text.primary",
                  }}
                >
                  {user?.fullName || user?.username}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.72rem", color: "text.disabled" }}
                >
                  {user?.email}
                </Typography>
              </Box>

              <Divider sx={{ my: 0.5 }} />

              <MenuItem
                onClick={() => {
                  setUserMenuAnchor(null);
                  // Implementar página de perfil futuramente
                }}
                sx={{ borderRadius: "8px", fontSize: "0.85rem", py: 0.75 }}
              >
                <ListItemIcon>
                  <Person sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText>Perfil</ListItemText>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  setUserMenuAnchor(null);
                  // Implementar configurações
                }}
                sx={{ borderRadius: "8px", fontSize: "0.85rem", py: 0.75 }}
              >
                <ListItemIcon>
                  <Settings sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText>Configurações</ListItemText>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  setUserMenuAnchor(null);
                  // Implementar ajuda
                }}
                sx={{ borderRadius: "8px", fontSize: "0.85rem", py: 0.75 }}
              >
                <ListItemIcon>
                  <HelpOutline sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText>Ajuda</ListItemText>
              </MenuItem>

              <Divider sx={{ my: 0.5 }} />

              <MenuItem
                onClick={handleLogout}
                sx={{
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  py: 0.75,
                  color: "error.main",
                  "&:hover": {
                    bgcolor: (t) => alpha(t.palette.error.main, 0.08),
                  },
                }}
              >
                <ListItemIcon>
                  <Logout sx={{ fontSize: 18, color: "error.main" }} />
                </ListItemIcon>
                <ListItemText>Sair</ListItemText>
              </MenuItem>
            </Menu>

            {/* Controls */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              flexWrap="wrap"
            >
              {/* Search */}
              <TextField
                placeholder="Buscar notas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: 16, color: "text.disabled" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    height: 36,
                    bgcolor: (t) => t.palette.grey[50],
                    "& fieldset": { borderColor: "divider" },
                    "&:hover fieldset": { borderColor: "text.disabled" },
                  },
                }}
                sx={{ width: { xs: "100%", sm: 240 } }}
              />

              {/* Sort button */}
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size="small"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  border: "1px solid",
                  borderColor: "divider",
                  color: "text.secondary",
                  bgcolor: (t) => t.palette.grey[50],
                  "&:hover": {
                    bgcolor: "action.hover",
                    borderColor: "text.disabled",
                  },
                }}
              >
                <FilterList sx={{ fontSize: 17 }} />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 0.75,
                    minWidth: 190,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
                    p: 0.5,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    color: "text.disabled",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    px: 1.5,
                    py: 0.75,
                  }}
                >
                  Ordenar por
                </Typography>
                {[
                  {
                    value: "updated",
                    label: "Mais recentes",
                    Icon: AccessTime,
                  },
                  { value: "alpha", label: "Alfabética", Icon: SortByAlpha },
                ].map(({ value, label, Icon }) => (
                  <MenuItem
                    key={value}
                    selected={sortBy === value}
                    onClick={() => {
                      setSortBy(value as any);
                      setAnchorEl(null);
                    }}
                    sx={{
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      py: 0.75,
                      "&.Mui-selected": {
                        fontWeight: 600,
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                        color: "primary.main",
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: 17, mr: 1.25, opacity: 0.7 }} />
                    {label}
                  </MenuItem>
                ))}
              </Menu>

              {/* View toggle */}
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_e, v) => {
                  if (v) setViewMode(v);
                }}
                size="small"
                sx={{
                  height: 36,
                  bgcolor: (t) => t.palette.grey[50],
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "10px",
                  overflow: "hidden",
                  "& .MuiToggleButton-root": {
                    border: "none",
                    borderRadius: "0 !important",
                    px: 1.25,
                    color: "text.disabled",
                    "&.Mui-selected": {
                      bgcolor: "background.paper",
                      color: "text.primary",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                    },
                    "&:hover": { bgcolor: "action.hover" },
                  },
                }}
              >
                <ToggleButton value="grid">
                  <ViewModule sx={{ fontSize: 17 }} />
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewList sx={{ fontSize: 17 }} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>

          <Divider />

          {/* Status filters */}
          <Stack direction="row" spacing={0.5} sx={{ px: 2.5, py: 1.5 }}>
            {filterConfig.map(({ key, label }) => {
              const active = filterStatus === key;
              const count = countByStatus(key);
              return (
                <Box
                  key={key}
                  onClick={() => setFilterStatus(key)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    px: 1.5,
                    py: 0.6,
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontSize: "0.8rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? "primary.main" : "text.secondary",
                    bgcolor: active
                      ? (t) => alpha(t.palette.primary.main, 0.08)
                      : "transparent",
                    "&:hover": {
                      bgcolor: active
                        ? (t) => alpha(t.palette.primary.main, 0.1)
                        : "action.hover",
                    },
                  }}
                >
                  {label}
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 18,
                      height: 18,
                      borderRadius: "5px",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      px: "4px",
                      bgcolor: active
                        ? (t) => alpha(t.palette.primary.main, 0.15)
                        : "action.selected",
                      color: active ? "primary.main" : "text.disabled",
                    }}
                  >
                    {count}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Paper>

        {/* ── Empty state ── */}
        {filteredNotes.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 12,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "18px",
                bgcolor: "action.selected",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.75rem",
                mx: "auto",
                mb: 2,
              }}
            >
              {searchTerm ? "🔍" : "📭"}
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                mb: 0.5,
                fontSize: "1rem",
              }}
            >
              {searchTerm ? "Nenhum resultado" : "Nenhuma nota ainda"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.disabled", fontSize: "0.85rem" }}
            >
              {searchTerm
                ? `Não encontramos nada para "${searchTerm}"`
                : "Crie sua primeira nota clicando no botão +"}
            </Typography>
          </Box>
        )}

        {/* ── Grid ── */}
        {filteredNotes.length > 0 && (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredNotes.map((n) => n.id || "temp")}
              strategy={rectSortingStrategy}
            >
              <Grid container spacing={2}>
                {filteredNotes.map((note) => (
                  <SortableNoteCard key={note.id} note={note} />
                ))}
              </Grid>
            </SortableContext>
          </DndContext>
        )}

        {/* ── FAB ── */}
        <SpeedDial
          ariaLabel="Criar nova nota"
          sx={{
            position: "fixed",
            bottom: 36,
            right: 36,
            "& .MuiSpeedDial-fab": {
              width: 52,
              height: 52,
              borderRadius: "16px",
              boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
              transition: "box-shadow 0.2s, transform 0.2s",
              "&:hover": {
                boxShadow: "0 12px 36px rgba(0,0,0,0.22)",
                transform: "scale(1.04)",
              },
            },
          }}
          icon={<SpeedDialIcon />}
          onClick={() => navigate("/note/new")}
        />
      </Container>
    </Box>
  );
};
