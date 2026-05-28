import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

function fmt(date) {
  return new Date(date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ msg, animate, onResend }) {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isUser = msg.role === 'user';
  const c = theme?.custom || {};

  return (
    <Box
      sx={{
        maxWidth: isMobile ? '100%' : '72%',
        px: isMobile ? 1 : 2,
        py: isMobile ? 0.75 : 1.25,
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        bgcolor: isUser ? c.bubbleUser : c.bubbleBot,
        color: isUser ? c.bubbleUserText : c.bubbleBotText,
        animation: animate ? 'popIn 0.15s ease-out' : 'none',
        wordBreak: 'break-word',
        opacity: msg.failed ? 0.6 : 1,
      }}
    >
      <Box
        sx={{
          lineHeight: 1.5, fontSize: '0.925rem',
          '& p': { m: 0 },
          '& p + p': { mt: 1.5 },
          '& code': { bgcolor: 'rgba(0,0,0,0.25)', px: 0.5, py: 0.2, borderRadius: 0.5, fontSize: '0.85em' },
          '& pre': { bgcolor: 'rgba(0,0,0,0.3)', p: 1.5, borderRadius: 1.5, overflow: 'auto', fontSize: '0.85em', my: 1 },
          '& ul, & ol': { m: 0.5, pl: 2 },
          '& li': { m: 0.25 },
          '& a': { color: 'inherit', textDecoration: 'underline' },
        }}
      >
        <ReactMarkdown>{msg.text}</ReactMarkdown>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.5 }}>
        {isUser && msg.failed && onResend && (
          <IconButton
            size="small"
            onClick={() => onResend(msg.text)}
            title="Resend"
            sx={{ p: 0.3, color: 'error.main', '&:hover': { bgcolor: 'error.main', color: '#fff' } }}
          >
            <RefreshCw size={14} strokeWidth={1.5} />
          </IconButton>
        )}
        <Typography variant="caption" sx={{ opacity: 0.35, fontSize: '0.65rem' }}>
          {fmt(msg.time)}
        </Typography>
      </Box>
    </Box>
  );
}
