// src/pages/RegisterPage.tsx
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
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  ArrowForward,
  ArrowBack,
  CheckCircleOutline,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const steps = ['Dados básicos', 'Informações adicionais'];

// ─── Shared layout shell (same as LoginPage) ──────────────────────────────────

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
        maxWidth: 440,
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

// ─── Custom stepper ───────────────────────────────────────────────────────────

const CustomStepper: React.FC<{ activeStep: number }> = ({ activeStep }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, px: 4, py: 2.25, borderBottom: '1px solid', borderColor: 'divider' }}>
    {steps.map((label, i) => {
      const done = i < activeStep;
      const active = i === activeStep;
      return (
        <React.Fragment key={label}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s',
                ...(done
                  ? { bgcolor: 'success.main', color: '#fff' }
                  : active
                  ? { bgcolor: 'primary.main', color: '#fff' }
                  : { bgcolor: 'action.selected', color: 'text.disabled' }
                ),
              }}
            >
              {done
                ? <CheckCircleOutline sx={{ fontSize: 16 }} />
                : <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, lineHeight: 1 }}>{i + 1}</Typography>
              }
            </Box>
            <Typography
              sx={{
                fontSize: '0.78rem',
                fontWeight: active ? 600 : 400,
                color: active ? 'text.primary' : done ? 'success.main' : 'text.disabled',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </Typography>
          </Box>

          {i < steps.length - 1 && (
            <Box
              sx={{
                flex: 1,
                height: '1px',
                mx: 1.5,
                bgcolor: i < activeStep ? 'success.light' : 'divider',
                transition: 'background-color 0.3s',
              }}
            />
          )}
        </React.Fragment>
      );
    })}
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
  '& .MuiFormHelperText-root': { fontSize: '0.75rem', mx: '2px' },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.username || !formData.email || !formData.password) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não conferem');
        return;
      }
      if (formData.password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres');
        return;
      }
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Erro ao criar conta. Tente novamente.'
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
          pb: 3,
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
          Criar conta
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
          Comece a organizar seus estudos gratuitamente
        </Typography>
      </Box>

      {/* Custom stepper */}
      <CustomStepper activeStep={activeStep} />

      {/* Form body */}
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

        {/* Step 0: credentials */}
        {activeStep === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nome de usuário"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              autoFocus
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
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
              helperText="Mínimo de 6 caracteres"
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

            <TextField
              fullWidth
              label="Confirmar senha"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              error={
                formData.confirmPassword.length > 0 &&
                formData.password !== formData.confirmPassword
              }
              helperText={
                formData.confirmPassword.length > 0 &&
                formData.password !== formData.confirmPassword
                  ? 'As senhas não conferem'
                  : ''
              }
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {/* Step 1: profile */}
        {activeStep === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Visual cue for optional step */}
            <Box
              sx={{
                p: 2,
                borderRadius: '10px',
                bgcolor: (t) => alpha(t.palette.info.main, 0.06),
                border: '1px solid',
                borderColor: (t) => alpha(t.palette.info.main, 0.15),
              }}
            >
              <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', lineHeight: 1.5 }}>
                Este passo é <strong>opcional</strong>. Você pode pular e completar seu perfil depois.
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Nome completo"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              autoFocus
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {/* Navigation */}
        <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
          {activeStep === 0 ? (
            <>
              <Button
                component={RouterLink}
                to="/login"
                fullWidth
                variant="outlined"
                sx={{
                  height: 44,
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': { borderColor: 'text.disabled', bgcolor: 'action.hover' },
                }}
              >
                Já tenho conta
              </Button>
              <Button
                onClick={handleNext}
                fullWidth
                variant="contained"
                disableElevation
                endIcon={<ArrowForward sx={{ fontSize: '16px !important' }} />}
                sx={{
                  height: 44,
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Próximo
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleBack}
                variant="outlined"
                startIcon={<ArrowBack sx={{ fontSize: '16px !important' }} />}
                sx={{
                  height: 44,
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  borderColor: 'divider',
                  color: 'text.secondary',
                  px: 2.5,
                  '&:hover': { borderColor: 'text.disabled', bgcolor: 'action.hover' },
                }}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                disableElevation
                sx={{
                  height: 44,
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                {isLoading
                  ? <CircularProgress size={20} color="inherit" />
                  : 'Criar conta'
                }
              </Button>
            </>
          )}
        </Box>

        {/* Terms hint — only on final step */}
        {activeStep === 1 && (
          <Typography
            sx={{ textAlign: 'center', mt: 2, fontSize: '0.75rem', color: 'text.disabled' }}
          >
            Ao criar sua conta você concorda com nossos{' '}
            <Link underline="hover" sx={{ cursor: 'pointer', color: 'text.secondary' }}>
              Termos de uso
            </Link>
          </Typography>
        )}
      </Box>
    </AuthShell>
  );
};