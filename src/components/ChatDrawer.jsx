import { useState, useMemo } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Plus, MessageSquareText, Pencil, Trash2, Inbox, Search, Columns, Heart } from 'lucide-react';
import { BASE_URL } from '../constants';

const ICON_SIZE = 18;
const STROKE = 1.5;

function getMatchPreview(s, query, allMessages) {
  if (!query) return null;
  const q = query.toLowerCase();
  const msgs = allMessages[s.id];
  if (!msgs) return null;
  for (const m of msgs) {
    const idx = m.text.toLowerCase().indexOf(q);
    if (idx !== -1) {
      const start = Math.max(0, idx - 30);
      const end = Math.min(m.text.length, idx + q.length + 60);
      return (start > 0 ? '...' : '') + m.text.slice(start, end) + (end < m.text.length ? '...' : '');
    }
  }
  return null;
}

function Rail({ onNewChat, onToggle, onOpenSearch, onSupportClick }) {
  const [hover, setHover] = useState(false);
  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onToggle}
      sx={{ cursor: 'col-resize', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 1.5, height: '100%' }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.15s',
        }}
      >
        {hover ? (
          <Columns size={ICON_SIZE} strokeWidth={STROKE} />
        ) : (
          <Box
            component="img"
            src={`${BASE_URL}AccouPal.svg`}
            sx={{ width: 28, height: 28, filter: 'brightness(0) invert(1)', opacity: 0.7 }}
          />
        )}
      </Box>
      <Tooltip title="Search sessions" placement="right">
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onOpenSearch(); }}>
          <Search size={ICON_SIZE} strokeWidth={STROKE} />
        </IconButton>
      </Tooltip>
      <Tooltip title="New Chat" placement="right">
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onNewChat(); }}>
          <Plus size={ICON_SIZE} strokeWidth={STROKE} />
        </IconButton>
      </Tooltip>
      <Box sx={{ mt: 'auto' }} />
      <Box sx={{ mb: 0.75 }}>
        <Tooltip title="Help make AccouPal more private" placement="right">
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onSupportClick(); }}
            sx={{
              '&:hover .heart-icon': { color: '#e74c3c' },
            }}
          >
            <Heart size={ICON_SIZE} strokeWidth={STROKE} className="heart-icon" fill="currentColor" sx={{ color: 'grey.500', opacity: 0.5, transition: 'color 0.2s' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default function ChatDrawer({ sessions, currentId, onSelect, onNewChat, onDelete, onRename, open, onToggle, allMessages = {}, selectedColor }) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameDialogValue, setRenameDialogValue] = useState('');
  const [supportOpen, setSupportOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return sessions.filter((s) => {
      if ((s.title || '').toLowerCase().includes(q)) return true;
      const msgs = allMessages[s.id];
      return msgs && msgs.some((m) => (m.text || '').toLowerCase().includes(q));
    });
  }, [sessions, query, allMessages]);

  return (
    <>
      {!open ? (
        <Rail onNewChat={onNewChat} onToggle={onToggle} onOpenSearch={onToggle} onSupportClick={() => setSupportOpen(true)} />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, minHeight: 48 }}>
            <Box
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                '& img': {
                  ...(!isMobile && { filter: 'brightness(0) invert(1)', opacity: 0.7 }),
                  transition: 'filter 0.2s, opacity 0.2s',
                },
                '&:hover img': { filter: 'none', opacity: 1 },
              }}
            >
              <Box component="img" src={`${BASE_URL}AccouPal.svg`} sx={{ width: 28, height: 28 }} />
            </Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ flex: 1 }}>AccouPal</Typography>
            <IconButton size="small" onClick={onToggle}>
              <Columns size={ICON_SIZE} strokeWidth={STROKE} />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ px: 1, pt: 1, pb: 0.75 }}>
            <Button
              variant="contained"
              fullWidth
          startIcon={<Plus size={14} strokeWidth={STROKE} />}
          onClick={onNewChat}
          size="small"
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
            >
              New Chat
            </Button>
          </Box>
          <Box sx={{ px: 1, pb: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search sessions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={14} strokeWidth={STROKE} style={{ opacity: 0.4 }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: '#2e2e2e', fontSize: '0.8rem' },
                },
              }}
            />
          </Box>
          <Divider />
          <List sx={{ flex: 1, overflow: 'auto', py: 0.25 }}>
            {filtered.length === 0 && (
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, px: 1.5 }}>
                <Inbox size={24} strokeWidth={STROKE} style={{ opacity: 0.3 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', textAlign: 'center' }}>
                  {query ? 'No matching sessions' : 'No sessions yet'}
                </Typography>
              </Box>
            )}
            {filtered.map((s) => {
              const preview = getMatchPreview(s, query, allMessages);
              return (
            <ListItemButton
              key={s.id}
              selected={s.id === currentId}
              onClick={() => onSelect(s.id)}
              dense
              sx={{
                borderRadius: 1, mx: 0.5, my: 0.25, px: 1,
                ...(selectedColor && s.id === currentId ? {
                  '&.Mui-selected': {
                    bgcolor: `${selectedColor}20`,
                    '&:hover': { bgcolor: `${selectedColor}30` },
                  },
                  '&.Mui-selected .MuiListItemIcon-root': { color: selectedColor },
                  '&.Mui-selected .MuiListItemText-primary': { color: selectedColor },
                } : {}),
              }}
            >
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <MessageSquareText size={14} strokeWidth={STROKE} />
                  </ListItemIcon>
                  <ListItemText
                    primary={s.title || 'New Chat'}
                    secondary={preview || new Date(s.updated_at || s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    slotProps={{
                      primary: { noWrap: true, fontSize: '0.8rem', fontWeight: 500 },
                      secondary: preview
                        ? { fontSize: '0.65rem', noWrap: true, color: 'text.primary' }
                        : { fontSize: '0.6rem', fontStyle: 'italic', sx: { opacity: 0.8 } },
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 0.25 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); setRenameDialogValue(s.title || ''); setRenameTarget(s.id); }}
                      sx={{ opacity: 0.3, transition: 'opacity 0.15s', '&:hover': { opacity: 1 } }}
                    >
                      <Pencil size={14} strokeWidth={STROKE} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(s.id); }}
                      sx={{ opacity: 0.3, transition: 'opacity 0.15s, color 0.15s', '&:hover': { opacity: 1, color: '#e74c3c' } }}
                    >
                      <Trash2 size={14} strokeWidth={STROKE} />
                    </IconButton>
                  </Box>
                </ListItemButton>
              );
            })}
          </List>
          <Box
            onClick={() => setSupportOpen(true)}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              mx: 1, mb: 2, py: 0.75, borderRadius: 1.5,
              border: 1, borderColor: 'transparent',
              cursor: 'pointer', transition: 'bgcolor 0.2s, border-color 0.2s',
              '&:hover': { bgcolor: 'rgba(231, 76, 60, 0.08)', borderColor: 'rgba(231, 76, 60, 0.3)' },
              '&:hover .heart-icon': { color: '#e74c3c' },
            }}
          >
            <Heart size={ICON_SIZE} strokeWidth={STROKE} className="heart-icon" fill="currentColor" sx={{ color: 'grey.500', opacity: 0.5, transition: 'color 0.2s' }} />
            <Typography variant="body2" sx={{ fontSize: '0.8rem', opacity: 0.7 }}>
              Help make AccouPal more private
            </Typography>
          </Box>
        </Box>
      )}
      <Dialog open={supportOpen} onClose={() => setSupportOpen(false)} maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>Support AccouPal</DialogTitle>
        <DialogContent sx={{ pt: 1.5, pb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            AccouPal is built to keep your conversations private — no tracking, no data collection, no compromises.

            Your support helps us stay independent and keep improving privacy-first AI for everyone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setSupportOpen(false)} sx={{ textTransform: 'none' }}>Later</Button>
          <Button onClick={() => setSupportOpen(false)} variant="contained" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}>
            Contribute
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!renameTarget} onClose={() => setRenameTarget(null)} maxWidth="xs" fullWidth>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); const id = renameTarget; const val = renameDialogValue.trim(); if (!val) return; setRenameTarget(null); onRename(id, val); }}>
          <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>Rename session</DialogTitle>
          <DialogContent sx={{ pt: 2, pb: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={renameDialogValue}
              onChange={(e) => setRenameDialogValue(e.target.value)}
              autoFocus
              sx={{ '& .MuiInputBase-root': { fontSize: '0.9rem', borderRadius: 1.5 } }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 2 }}>
            <Button onClick={() => setRenameTarget(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}>
              Rename
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>Delete session?</DialogTitle>
        <DialogContent sx={{ pt: 1.5, pb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            This will permanently delete this conversation. There's no undo.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            onClick={() => { onDelete(deleteTarget); setDeleteTarget(null); }}
            variant="contained"
            color="error"
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
