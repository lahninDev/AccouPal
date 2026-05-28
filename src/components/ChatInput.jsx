import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Send } from 'lucide-react';

const MAX = 2000;

export default function ChatInput({ onSend, isLoading }) {
  const [text, setText] = useState('');
  const over = text.length > MAX;

  const send = useCallback(() => {
    const msg = text.trim();
    if (!msg || isLoading || over) return;
    setText('');
    onSend(msg);
  }, [text, isLoading, over, onSend]);

  return (
    <Box sx={{ display: 'flex', gap: 1, p: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper', alignItems: 'center' }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
        disabled={isLoading}
        error={over}
        slotProps={{
          input: {
            sx: { borderRadius: 5, pr: 1, bgcolor: '#2e2e2e' },
            endAdornment: (
              <InputAdornment position="end">
                <Box
                  component="span"
                  sx={{ fontSize: '0.7rem', color: over ? 'error.main' : 'text.secondary', fontWeight: over ? 600 : 400, mr: 0.5 }}
                >
                  {text.length}/{MAX}
                </Box>
              </InputAdornment>
            ),
          },
        }}
      />
      <IconButton
        color="primary"
        onClick={send}
        disabled={!text.trim() || isLoading || over}
        size="small"
        sx={{
          bgcolor: text.trim() && !isLoading ? 'primary.main' : 'transparent',
          color: text.trim() && !isLoading ? '#fff' : 'text.secondary',
          '&:hover': { bgcolor: text.trim() && !isLoading ? 'primary.dark' : 'transparent' },
          transition: 'all 0.15s',
        }}
      >
        <Send size={18} strokeWidth={1.5} />
      </IconButton>
    </Box>
  );
}
