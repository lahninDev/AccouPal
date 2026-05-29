import { useState, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import { Send, Smile } from 'lucide-react';

const MAX = 2000;

const EMOJIS = [
  '🦉','👑','🤙','😾','📒','🐴','💩','🤨','✅','😹','🙀','😻',
  '🐸','🏛️','⚜️','📜','🔮','✨','😂','👍','🔥','💀','🚀','💡',
  '😭','😤','😏','🤔','🙄','😁','🥺','💪','🧠','👀','❤️','🤡',
];

export default function ChatInput({ onSend, isLoading }) {
  const [text, setText] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);
  const over = text.length > MAX;

  const send = useCallback(() => {
    const msg = text.trim();
    if (!msg || isLoading || over) return;
    setText('');
    onSend(msg);
  }, [text, isLoading, over, onSend]);

  const insertEmoji = useCallback((emoji) => {
    const el = inputRef.current;
    const cursor = el ? el.selectionStart : text.length;
    if (text.length + emoji.length > MAX) return;
    setText((prev) => prev.slice(0, cursor) + emoji + prev.slice(cursor));
    setEmojiOpen(false);
    setTimeout(() => { el?.focus(); }, 0);
  }, [text.length]);

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
        inputRef={inputRef}
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
        size="small"
        onClick={(e) => { setAnchorEl(e.currentTarget); setEmojiOpen((o) => !o); }}
        sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
      >
        <Smile size={18} strokeWidth={1.5} />
      </IconButton>
      <Popper open={emojiOpen} anchorEl={anchorEl} placement="top-end" disablePortal>
        <Paper sx={{ p: 1, maxWidth: 220, display: 'flex', flexWrap: 'wrap', gap: 0.5, bgcolor: '#222', border: '1px solid #333' }}>
          {EMOJIS.map((e) => (
            <Box
              key={e}
              component="button"
              onClick={() => insertEmoji(e)}
              sx={{
                width: 32, height: 32, fontSize: '1.1rem', cursor: 'pointer', border: 'none', borderRadius: 1,
                bgcolor: 'transparent', '&:hover': { bgcolor: '#333' }, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {e}
            </Box>
          ))}
        </Paper>
      </Popper>
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
