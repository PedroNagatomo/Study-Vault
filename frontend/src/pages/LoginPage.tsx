// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Link,
  alpha,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ─── Shared layout shell ───────────────────────────────────────────────────────

const AuthShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: (t) => t.palette.grey[50],
      p: 2,
    }}
  >
    <Box
      sx={{
        width: '100%',
        maxWidth: 420,
        bgcolor: 'background.paper',
        borderRadius: '20px',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      {children}
    </Box>
  </Box>
);

// ─── Shared field style ────────────────────────────────────────────────────────

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontSize: '0.9rem',
    '& fieldset': { borderColor: 'divider' },
    '&:hover fieldset': { borderColor: 'text.disabled' },
  },
  '& .MuiInputLabel-root': { fontSize: '0.9rem' },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(formData);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Erro ao fazer login. Verifique suas credenciais.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell>
      {/* Header */}
      <Box
        sx={{
          px: 4,
          pt: 4.5,
          pb: 3.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '14px',
            bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            mx: 'auto',
            mb: 2,
          }}
        >
          📚
        </Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, letterSpacing: '-0.02em', mb: 0.5 }}
        >
          StudyVault
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
          Faça login para continuar seus estudos
        </Typography>
      </Box>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ px: 4, py: 3.5 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              borderRadius: '10px',
              fontSize: '0.82rem',
              alignItems: 'center',
            }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            autoFocus
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ fontSize: 18, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ fontSize: 18, color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                    sx={{ color: 'text.disabled', '&:hover': { color: 'text.secondary' } }}
                  >
                    {showPassword
                      ? <VisibilityOff sx={{ fontSize: 18 }} />
                      : <Visibility sx={{ fontSize: 18 }} />
                    }
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          disableElevation
          sx={{
            mt: 3,
            height: 44,
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: 600,
            textTransform: 'none',
            letterSpacing: '0',
          }}
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Entrar'}
        </Button>

        <Typography
          variant="body2"
          sx={{ textAlign: 'center', mt: 2.5, color: 'text.secondary', fontSize: '0.82rem' }}
        >
          Não tem uma conta?{' '}
          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
            sx={{ fontWeight: 600, color: 'primary.main' }}
          >
            Cadastre-se
          </Link>
        </Typography>
      </Box>
    </AuthShell>
  );
};