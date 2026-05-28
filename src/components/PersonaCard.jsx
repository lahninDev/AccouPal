import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Check, MoreHorizontal } from 'lucide-react';
import { api } from '../api';

export default function PersonaCard({ persona, active, onSelect }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const { name, portrait, motto, description, tags, color } = persona;

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Paper
          onClick={onSelect}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 2,
            pt: 4,
            borderRadius: 2.5,
            border: 2,
            borderColor: active ? 'primary.main' : 'transparent',
            bgcolor: active ? 'action.selected' : 'background.default',
            cursor: 'pointer',
            transition: 'border-color 0.15s, background-color 0.15s',
            '&:hover': { borderColor: active ? 'primary.main' : 'divider' },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: 140,
            bgcolor: color || '#888',
            opacity: 0.1,
          }}
        />
        <Avatar
          src={portrait ? api(portrait) : undefined}
          sx={{
            width: 120,
            height: 120,
            bgcolor: color || '#888',
            fontSize: '2.5rem',
            fontWeight: 700,
            mb: 2,
            boxShadow: `0 0 0 4px ${color || '#888'}22, 0 4px 20px ${color || '#888'}44`,
          }}
        >
          {!portrait && (name || '?').charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
          <Typography fontWeight={700} fontSize="0.95rem" noWrap>
            {name}
          </Typography>
          {active && <Check size={18} strokeWidth={1.5} />}
        </Box>
        {motto && (
          <Typography variant="caption" fontStyle="italic" color="text.secondary" noWrap sx={{ fontSize: '0.7rem', display: 'block', mb: 1.5, px: 1 }}>
            &ldquo;{motto}&rdquo;
          </Typography>
        )}
        {tags && tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  fontSize: '0.65rem',
                  height: 22,
                  bgcolor: active ? 'primary.main' : '#333',
                  color: active ? '#fff' : '#ccc',
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        )}
      </Paper>
      {description && (
        <IconButton
          size="small"
          onClick={() => setDetailOpen(true)}
          sx={{ position: 'absolute', top: 6, right: 6, zIndex: 2, color: 'text.secondary', bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}
        >
          <MoreHorizontal size={18} strokeWidth={1.5} />
        </IconButton>
      )}
      </Box>
      {description && (
        <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="xs">
          <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>{name}</DialogTitle>
          <DialogContent sx={{ pt: 1.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {description}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 2 }}>
            <Button onClick={() => setDetailOpen(false)} sx={{ textTransform: 'none' }}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
