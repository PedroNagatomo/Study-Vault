// src/components/editor/RichTextEditor.tsx
import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlock from "@tiptap/extension-code-block";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import {
  Box,
  ToggleButton,
  IconButton,
  Divider,
  Stack,
  Paper,
  Tooltip,
  Popover,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  Code,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  HorizontalRule,
  Undo,
  Redo,
  Image as ImageIcon,
  Link as LinkIcon,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatColorText,
  Highlight as HighlightIcon,
  TableChart,
  Title,
} from "@mui/icons-material";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const toolbarSx = {
  p: "6px 10px",
  mb: 0,
  backgroundColor: "transparent",
  borderBottom: "1px solid",
  borderColor: "divider",
  borderRadius: 0,
  boxShadow: "none",
};

const toggleBtnSx = {
  border: "none",
  borderRadius: "6px !important",
  color: "text.secondary",
  padding: "4px 6px",
  minWidth: 0,
  transition: "all 0.15s",
  "&.Mui-selected": {
    backgroundColor: "action.selected",
    color: "primary.main",
    "&:hover": { backgroundColor: "action.selected" },
  },
  "&:hover": {
    backgroundColor: "action.hover",
    color: "text.primary",
  },
};

const iconBtnSx = {
  borderRadius: "6px",
  color: "text.secondary",
  padding: "4px 6px",
  transition: "all 0.15s",
  "&:hover": {
    backgroundColor: "action.hover",
    color: "text.primary",
  },
};

const MenuBar = ({ editor }: { editor: any }) => {
  const [colorAnchor, setColorAnchor] = React.useState<HTMLElement | null>(null);
  const [highlightAnchor, setHighlightAnchor] = React.useState<HTMLElement | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [linkUrl, setLinkUrl] = React.useState("");
  const [headingAnchor, setHeadingAnchor] = React.useState<HTMLElement | null>(null);

  if (!editor) return null;

  const colors = [
    "#000000", "#434343", "#666666", "#999999", "#B7B7B7", "#CCCCCC",
    "#D9D9D9", "#EFEFEF", "#F3F3F3", "#FFFFFF", "#980000", "#FF0000",
    "#FF9900", "#FFD700", "#00FF00", "#00FFFF", "#0000FF", "#9900FF",
    "#FF00FF", "#E6B8AF", "#F4CCCC", "#FCE5CD", "#FFF2CC", "#D9EAD3",
    "#D0E0E3", "#C9DAF8", "#CFE2F3", "#D9D2E9", "#B45F06", "#CC0000",
    "#E69138", "#F1C232", "#6AA84F", "#45818E", "#3D85C6", "#674EA7", "#A64D79",
  ];

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setImageDialogOpen(false);
    }
  };

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setLinkDialogOpen(false);
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const handleHeadingClick = (event: React.MouseEvent<HTMLElement>) => {
    setHeadingAnchor(event.currentTarget);
  };

  const popoverPaper = {
    elevation: 2,
    sx: {
      borderRadius: "10px",
      border: "1px solid",
      borderColor: "divider",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    },
  };

  return (
    <>
      <Paper elevation={0} sx={toolbarSx}>
        <Stack direction="row" spacing={0.25} alignItems="center" flexWrap="wrap" gap={0.25}>

          {/* Desfazer/Refazer */}
          <Tooltip title="Desfazer" placement="top">
            <IconButton size="small" onClick={() => editor.chain().focus().undo().run()} sx={iconBtnSx}>
              <Undo sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refazer" placement="top">
            <IconButton size="small" onClick={() => editor.chain().focus().redo().run()} sx={iconBtnSx}>
              <Redo sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5, opacity: 0.5 }} />

          {/* Títulos */}
          <Tooltip title="Títulos" placement="top">
            <ToggleButton
              size="small"
              value="heading"
              selected={editor.isActive("heading")}
              onClick={handleHeadingClick}
              sx={toggleBtnSx}
            >
              <Title sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>

          <Popover
            open={Boolean(headingAnchor)}
            anchorEl={headingAnchor}
            onClose={() => setHeadingAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            PaperProps={popoverPaper}
          >
            <Box sx={{ p: 0.75 }}>
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <Button
                  key={level}
                  fullWidth
                  size="small"
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: level as any }).run();
                    setHeadingAnchor(null);
                  }}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    borderRadius: "6px",
                    px: 1.5,
                    py: 0.5,
                    fontSize: `${1.2 - level * 0.1}rem`,
                    fontWeight: level <= 3 ? 600 : 500,
                    color: "text.primary",
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  Título {level}
                </Button>
              ))}
              <Divider sx={{ my: 0.5, opacity: 0.5 }} />
              <Button
                fullWidth
                size="small"
                onClick={() => {
                  editor.chain().focus().setParagraph().run();
                  setHeadingAnchor(null);
                }}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  borderRadius: "6px",
                  px: 1.5,
                  py: 0.5,
                  color: "text.secondary",
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                Parágrafo
              </Button>
            </Box>
          </Popover>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5, opacity: 0.5 }} />

          {/* Formatação de Texto */}
          <Tooltip title="Negrito" placement="top">
            <ToggleButton size="small" value="bold" selected={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} sx={toggleBtnSx}>
              <FormatBold sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Itálico" placement="top">
            <ToggleButton size="small" value="italic" selected={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} sx={toggleBtnSx}>
              <FormatItalic sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Sublinhado" placement="top">
            <ToggleButton size="small" value="underline" selected={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} sx={toggleBtnSx}>
              <FormatUnderlined sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Tachado" placement="top">
            <ToggleButton size="small" value="strike" selected={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} sx={toggleBtnSx}>
              <FormatStrikethrough sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5, opacity: 0.5 }} />

          {/* Cor do Texto */}
          <Tooltip title="Cor do texto" placement="top">
            <IconButton size="small" onClick={(e) => setColorAnchor(e.currentTarget)} sx={iconBtnSx}>
              <FormatColorText sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Popover
            open={Boolean(colorAnchor)}
            anchorEl={colorAnchor}
            onClose={() => setColorAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            PaperProps={popoverPaper}
          >
            <Box sx={{ p: 1, display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 0.5 }}>
              {colors.map((color) => (
                <Box
                  key={color}
                  onClick={() => { editor.chain().focus().setColor(color).run(); setColorAnchor(null); }}
                  sx={{
                    width: 22, height: 22,
                    backgroundColor: color,
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "transform 0.1s",
                    "&:hover": { transform: "scale(1.2)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" },
                  }}
                />
              ))}
            </Box>
          </Popover>

          {/* Marca-texto */}
          <Tooltip title="Marca-texto" placement="top">
            <IconButton size="small" onClick={(e) => setHighlightAnchor(e.currentTarget)} sx={iconBtnSx}>
              <HighlightIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Popover
            open={Boolean(highlightAnchor)}
            anchorEl={highlightAnchor}
            onClose={() => setHighlightAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            PaperProps={popoverPaper}
          >
            <Box sx={{ p: 1, display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 0.5 }}>
              {colors.map((color) => (
                <Box
                  key={color}
                  onClick={() => { editor.chain().focus().toggleHighlight({ color }).run(); setHighlightAnchor(null); }}
                  sx={{
                    width: 22, height: 22,
                    backgroundColor: color,
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "transform 0.1s",
                    "&:hover": { transform: "scale(1.2)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" },
                  }}
                />
              ))}
            </Box>
          </Popover>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5, opacity: 0.5 }} />

          {/* Alinhamento */}
          <Tooltip title="Alinhar à esquerda" placement="top">
            <ToggleButton size="small" value="left" selected={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} sx={toggleBtnSx}>
              <FormatAlignLeft sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Centralizar" placement="top">
            <ToggleButton size="small" value="center" selected={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} sx={toggleBtnSx}>
              <FormatAlignCenter sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Alinhar à direita" placement="top">
            <ToggleButton size="small" value="right" selected={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} sx={toggleBtnSx}>
              <FormatAlignRight sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Justificar" placement="top">
            <ToggleButton size="small" value="justify" selected={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} sx={toggleBtnSx}>
              <FormatAlignJustify sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5, opacity: 0.5 }} />

          {/* Listas */}
          <Tooltip title="Lista com marcadores" placement="top">
            <ToggleButton size="small" value="bulletList" selected={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} sx={toggleBtnSx}>
              <FormatListBulleted sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Lista numerada" placement="top">
            <ToggleButton size="small" value="orderedList" selected={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} sx={toggleBtnSx}>
              <FormatListNumbered sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5, opacity: 0.5 }} />

          {/* Blocos */}
          <Tooltip title="Citação" placement="top">
            <ToggleButton size="small" value="blockquote" selected={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} sx={toggleBtnSx}>
              <FormatQuote sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Bloco de código" placement="top">
            <ToggleButton size="small" value="codeBlock" selected={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} sx={toggleBtnSx}>
              <Code sx={{ fontSize: 18 }} />
            </ToggleButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5, opacity: 0.5 }} />

          {/* Inserir */}
          <Tooltip title="Inserir imagem" placement="top">
            <IconButton size="small" onClick={() => setImageDialogOpen(true)} sx={iconBtnSx}>
              <ImageIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Inserir link" placement="top">
            <IconButton size="small" onClick={() => setLinkDialogOpen(true)} sx={iconBtnSx}>
              <LinkIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Inserir tabela" placement="top">
            <IconButton size="small" onClick={addTable} sx={iconBtnSx}>
              <TableChart sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Linha horizontal" placement="top">
            <IconButton size="small" onClick={() => editor.chain().focus().setHorizontalRule().run()} sx={iconBtnSx}>
              <HorizontalRule sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>

      {/* Dialog para Link */}
      <Dialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px" } }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Inserir Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            fullWidth
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addLink()}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setLinkDialogOpen(false)} sx={{ borderRadius: "8px" }}>Cancelar</Button>
          <Button onClick={addLink} variant="contained" sx={{ borderRadius: "8px" }}>Adicionar Link</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Imagem */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px" } }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Inserir Imagem</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL da Imagem"
            fullWidth
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addImage()}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setImageDialogOpen(false)} sx={{ borderRadius: "8px" }}>Cancelar</Button>
          <Button onClick={addImage} variant="contained" sx={{ borderRadius: "8px" }}>Adicionar Imagem</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Comece a escrever seus estudos...",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "editor-link" },
      }),
      Image.configure({
        HTMLAttributes: { class: "editor-image" },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder }),
      CodeBlock.configure({
        HTMLAttributes: { class: "editor-code-block" },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  return (
    <Box
      sx={{
        "& .ProseMirror": {
          minHeight: "320px",
          padding: "20px 24px",
          outline: "none",
          fontSize: "15.5px",
          lineHeight: "1.75",
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          color: "text.primary",

          "& p": { margin: "0 0 10px" },
          "& h1": { fontSize: "2em", fontWeight: 700, margin: "28px 0 12px", letterSpacing: "-0.02em", lineHeight: 1.25 },
          "& h2": { fontSize: "1.5em", fontWeight: 600, margin: "22px 0 10px", letterSpacing: "-0.01em", lineHeight: 1.3 },
          "& h3": { fontSize: "1.2em", fontWeight: 600, margin: "18px 0 8px" },
          "& h4, & h5, & h6": { fontWeight: 600, margin: "14px 0 6px" },

          "& ul, & ol": { paddingLeft: "22px", margin: "6px 0 10px" },
          "& li": { margin: "4px 0", lineHeight: 1.65 },
          "& li > p": { margin: 0 },

          "& blockquote": {
            borderLeft: "3px solid",
            borderColor: "primary.light",
            marginLeft: 0,
            marginRight: 0,
            paddingLeft: "16px",
            paddingTop: "4px",
            paddingBottom: "4px",
            color: "text.secondary",
            fontStyle: "italic",
            borderRadius: "0 4px 4px 0",
            background: "rgba(0,0,0,0.025)",
          },

          "& pre": {
            background: "#1a1b26",
            color: "#a9b1d6",
            borderRadius: "10px",
            padding: "14px 18px",
            fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace',
            fontSize: "13.5px",
            overflowX: "auto",
            margin: "12px 0",
          },
          "& code": {
            background: "rgba(100,100,120,0.1)",
            borderRadius: "4px",
            padding: "2px 6px",
            fontSize: "0.875em",
            fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace',
            color: "inherit",
          },
          "& pre code": { background: "none", padding: 0, fontSize: "inherit" },

          "& img": {
            maxWidth: "100%",
            height: "auto",
            margin: "10px 0",
            borderRadius: "8px",
            display: "block",
          },
          "& a": {
            color: "primary.main",
            textDecoration: "underline",
            textDecorationThickness: "1px",
            textUnderlineOffset: "2px",
            cursor: "pointer",
            "&:hover": { opacity: 0.8 },
          },

          "& table": {
            borderCollapse: "collapse",
            margin: "14px 0",
            width: "100%",
            borderRadius: "8px",
            overflow: "hidden",
          },
          "& th, & td": {
            border: "1px solid rgba(0,0,0,0.1)",
            padding: "8px 14px",
            textAlign: "left",
            fontSize: "14px",
          },
          "& th": {
            backgroundColor: "rgba(0,0,0,0.04)",
            fontWeight: 600,
            fontSize: "13px",
            letterSpacing: "0.02em",
          },
          "& tr:hover td": { backgroundColor: "rgba(0,0,0,0.015)" },

          "& hr": {
            border: "none",
            borderTop: "1px solid",
            borderColor: "divider",
            margin: "20px 0",
          },

          "& .is-editor-empty:first-child::before": {
            color: "text.disabled",
            content: "attr(data-placeholder)",
            float: "left",
            height: 0,
            pointerEvents: "none",
          },
        },
      }}
    >
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </Box>
  );
};