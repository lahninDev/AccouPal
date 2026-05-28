import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Eye, EyeOff } from 'lucide-react';
import { BASE_URL } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import useServerHealth from '../hooks/useServerHealth';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, guestLogin } = useAuth();
  const serverOnline = useServerHealth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [pwError, setPwError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  function validatePassword(val) {
    if (!val) return 'Password is required';
    if (val.length < 8) return 'At least 8 characters';
    if (!/[a-z]/.test(val)) return 'Needs a lowercase letter';
    if (!/[A-Z]/.test(val)) return 'Needs an uppercase letter';
    if (!/\d/.test(val)) return 'Needs a number';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val)) return 'Needs a special character';
    return '';
  }

  async function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const pwErr = validatePassword(password);
    if (pwErr) { setPwError(pwErr); return; }
    setPwError('');
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(trimmed, password);
      } else {
        await login(trimmed, password);
      }
      navigate('/chat', { replace: true });
    } catch (err) {
      const msg = err.message || 'Login failed';
      if (msg === 'Account not found') {
        setError(`"${trimmed}" doesn't have an account yet.`);
        setIsRegister(true);
      } else {
        setError(msg);
      }
    }
    setLoading(false);
  }

  async function handleGuest() {
    setError('');
    setLoading(true);
    try {
      await guestLogin();
      navigate('/chat', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to start guest session');
    }
    setLoading(false);
  }

  return (
    <Box sx={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ maxWidth: 380, width: '100%', borderRadius: 2.5 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
          {!serverOnline && (
            <Alert severity="warning" sx={{ width: '100%', py: 0.5, fontSize: '0.8rem' }}>
              Server unreachable
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Box component="a" href="/" sx={{ cursor: 'pointer', display: 'flex' }}>
              <Box component="img" src={`${BASE_URL}AccouPal.svg`} sx={{ width: 80, height: 80 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', textAlign: 'center' }}>
              Your accountability partner.
            </Typography>
          </Box>
          {error && <Alert severity="error" sx={{ py: 0.5, fontSize: '0.8rem' }}>{error}</Alert>}
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            disabled={loading}
            autoFocus
          />
          <TextField
            label="Password"
            type={showPw ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            size="small"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPwError(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            disabled={loading}
            error={!!pwError}
            helperText={pwError}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
          >
            {isRegister ? 'Create Account' : 'Start'}
          </Button>
          {isRegister && (
            <Button
              fullWidth
              onClick={() => { setIsRegister(false); setError(''); }}
              disabled={loading}
              sx={{ textTransform: 'none', fontWeight: 500, fontSize: '0.8rem', color: 'text.secondary' }}
            >
              Already have an account? Log in
            </Button>
          )}
          <Divider sx={{ my: 0.25 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>or</Typography>
          </Divider>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleGuest}
            disabled={loading}
            sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 1.5, borderColor: 'divider', color: 'text.secondary', '&:hover': { borderColor: 'text.primary', color: 'text.primary' } }}
          >
            Continue as Guest
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
