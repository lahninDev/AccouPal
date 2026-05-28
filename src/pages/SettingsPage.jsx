import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import { ArrowLeft, Trash2 } from 'lucide-react';
import IconButton from '@mui/material/IconButton';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { userId, username, logout } = useAuth();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  useEffect(() => {
    if (userId) {
      fetch(api(`/api/user/profile?userId=${userId}`))
        .then((r) => r.ok ? r.json() : null)
        .then((d) => { if (d) setCreatedAt(new Date(d.created_at).toLocaleDateString()); })
        .catch(() => {});
    }
  }, [userId]);

  async function handleDelete() {
    setDeleting(true);
    try {
      const r = await fetch(api('/api/user'), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (r.ok) {
        logout();
        navigate('/login', { replace: true });
      } else {
        const d = await r.json();
        setError(d.error || 'Failed to delete account');
      }
    } catch {
      setError('Server unreachable');
    }
    setDeleting(false);
    setDeleteOpen(false);
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, minHeight: 48, borderBottom: 1, borderColor: 'divider' }}>
        <IconButton size="small" onClick={() => navigate('/chat')}>
          <ArrowLeft size={18} strokeWidth={1.5} />
        </IconButton>
        <Typography variant="subtitle2" fontWeight={700}>Settings</Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2, maxWidth: 520, mx: 'auto', width: '100%' }}>
        {/* Account */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Account</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1.5, py: 1, bgcolor: 'background.paper', borderRadius: 1.5 }}>
            <Typography variant="body2" color="text.secondary">Username</Typography>
            <Typography variant="body2" fontWeight={500}>{username}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1.5, py: 1, bgcolor: 'background.paper', borderRadius: 1.5 }}>
            <Typography variant="body2" color="text.secondary">Joined</Typography>
            <Typography variant="body2" fontWeight={500}>{createdAt || '...'}</Typography>
          </Box>
        </Box>

        {/* Privacy */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Privacy</Typography>
        <Box sx={{ px: 1.5, py: 1.5, bgcolor: 'background.paper', borderRadius: 1.5, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.85rem' }}>
            Messages are encrypted at rest with AES-256-GCM before they ever touch the database.
            Your identity is just a username — no email, no personal data required.
            We don't track you, sell data, or run analytics.
            The source is open.
            {process.env.NODE_ENV === 'production' && ' The only external exposure is the optional Cloudflare tunnel for public testing.'}
          </Typography>
        </Box>

        {/* Danger Zone */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: '#e74c3c' }}>Danger Zone</Typography>
        <Box sx={{ px: 1.5, py: 1.5, bgcolor: 'background.paper', borderRadius: 1.5, border: 1, borderColor: 'rgba(231,76,60,0.3)' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Permanently delete your account and all chat data. This cannot be undone.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<Trash2 size={14} strokeWidth={1.5} />}
            onClick={() => setDeleteOpen(true)}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
          >
            Delete Account
          </Button>
        </Box>
      </Box>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>Delete account?</DialogTitle>
        <DialogContent sx={{ pt: 1.5, pb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            All your sessions, messages, and data will be permanently removed. There's no undo.
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 1, py: 0.5, fontSize: '0.8rem' }}>{error}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} sx={{ textTransform: 'none' }} disabled={deleting}>Cancel</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
          >
            {deleting ? 'Deleting...' : 'Delete Forever'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
