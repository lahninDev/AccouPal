import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { X } from 'lucide-react';
import PersonaCard from './PersonaCard';

export default function PersonaPicker({ personalities, current, onSelect, onClose }) {
  const isMobile = useMediaQuery('(max-width: 599px)');
  const cols = isMobile ? 1 : 2;

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 2.5, m: isMobile ? 1 : undefined } } }}>
      <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Choose a Persona
        <IconButton size="small" onClick={onClose}>
          <X size={18} strokeWidth={1.5} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 1.5,
            mt: 1,
          }}
        >
          {personalities.map((p, i) => {
            const active = p.id === current;
            const odd = !isMobile && personalities.length % 2 !== 0 && i === personalities.length - 1;
            return (
              <Box
                key={p.id}
                sx={odd ? { gridColumn: '1 / -1', justifySelf: 'center', maxWidth: 'calc(50% - 8px)', width: '100%' } : {}}
              >
                <PersonaCard
                  persona={p}
                  active={active}
                  onSelect={() => { onSelect(p.id); onClose(); }}
                />
              </Box>
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
