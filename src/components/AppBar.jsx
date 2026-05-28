import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LogOut, Menu } from 'lucide-react';
import ConnectionBadge from './ConnectionBadge';
import { api } from '../api';

export default function AppBar({ username, onLogout, persona, serverOnline, onMenuClick }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { name, portrait, motto } = persona || {};

  return (
    <MuiAppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar variant="dense" sx={{ minHeight: 48, px: isMobile ? 0.75 : 1.5, gap: 0.25 }}>
        {onMenuClick && isMobile && (
          <Box onClick={onMenuClick} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mx: 0.25, cursor: 'pointer' }}>
            <IconButton size="small" sx={{ p: 0.5 }}>
              <Menu size={18} strokeWidth={1.5} />
            </IconButton>
            <Box component="img" src="/AccouPal.svg" sx={{ width: 28, height: 28, filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
          </Box>
        )}
        {name && (
          <>
            <Avatar src={portrait ? api(portrait) : undefined} alt={name} sx={{ width: 28, height: 28, mr: 0.75 }} />
            <Box sx={{ minWidth: 0, mr: 1 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {name}
              </Typography>
              {motto && (
                <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.65rem', lineHeight: 1.2, display: 'block' }}>
                  {motto}
                </Typography>
              )}
            </Box>
          </>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <ConnectionBadge online={serverOnline} />
        <IconButton size="small" onClick={() => navigate('/settings')} sx={{ mx: 0.25 }}>
          <Avatar sx={{ width: 26, height: 26, fontSize: '0.75rem', bgcolor: 'primary.main', cursor: 'pointer' }}>
            {(username || '?')[0].toUpperCase()}
          </Avatar>
        </IconButton>
        {onLogout && (
          <>
            <IconButton size="small" onClick={() => setConfirmOpen(true)}>
              <LogOut size={18} strokeWidth={1.5} />
            </IconButton>
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs">
              <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>Leave?</DialogTitle>
              <DialogContent sx={{ pt: 1.5, pb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">Are you sure you want to quit?</Typography>
              </DialogContent>
              <DialogActions sx={{ px: 2, pb: 2 }}>
                <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
                <Button onClick={() => { setConfirmOpen(false); onLogout(); }} variant="contained" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}>
                  Logout
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Toolbar>
    </MuiAppBar>
  );
}
