import { createTheme } from '@mui/material/styles';

const personalities = {
  null: {
    accent: '#8b5cf6',
    bubbleUser: '#8b5cf6',
    bubbleBot: '#2a2a2a',
    bubbleUserText: '#fff',
    bubbleBotText: '#d0d0d0',
    greeting: null,
  },
  Atlas: {
    accent: '#5b7fff',
    bubbleUser: '#5b7fff',
    bubbleBot: '#2e2e2e',
    bubbleUserText: '#fff',
    bubbleBotText: '#d0d0d0',
    greeting: "Atlas here. I don't do small talk — so tell me straight: what's the problem you're trying to solve?",
  },
  Bogard: {
    accent: '#2ecc71',
    bubbleUser: '#2ecc71',
    bubbleBot: '#2e2e2e',
    bubbleUserText: '#111',
    bubbleBotText: '#d0d0d0',
    greeting: "Captain. Bogard reporting. I've read the logs. Tell me where you're at — no judgment, just data.",
  },
  Mukapoleon: {
    accent: '#d4a017',
    bubbleUser: '#d4a017',
    bubbleBot: '#2e2e2e',
    bubbleUserText: '#fff',
    bubbleBotText: '#d0d0d0',
    greeting: "The Owl has arrived. The Republic acknowledges your presence. State your query — I have decrees to issue and a Horse to manage. 🦉👑",
  },
  Mira: {
    accent: '#c8553d',
    bubbleUser: '#c8553d',
    bubbleBot: '#2e2e2e',
    bubbleUserText: '#fff',
    bubbleBotText: '#d0d0d0',
    greeting: "The Mushroom Circle welcomes you. 🍄 Sit with me a moment. Tell me about the connection on your mind — and we'll see what the soil reveals. 🌱",
  },
};

const BRAND = '#8b5cf6';

function get(id) {
  return personalities[id] || personalities.null;
}

export function getGreeting(id) {
  return get(id).greeting;
}

export function getPersonality(id) {
  return get(id);
}

export function defaultPersonality() {
  return null;
}

export function personalityIds() {
  return Object.keys(personalities).filter((k) => k !== 'null');
}

export function buildTheme(id) {
  const p = get(id);

  return createTheme({
    palette: {
      mode: 'dark',
      primary: { main: BRAND },
      background: { default: '#1a1a1a', paper: '#2a2a2a' },
      text: { primary: '#e8e8e8', secondary: '#888' },
      divider: 'rgba(255,255,255,0.06)',
    },
    shape: { borderRadius: 8 },
    typography: {
      fontFamily: '"Inter", system-ui, Avenir, Helvetica, Arial, sans-serif',
      fontSize: 14,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: '#1a1a1a' },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#2e2e2e',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
              '&.Mui-focused fieldset': { borderColor: BRAND, borderWidth: 1 },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none', boxShadow: 'none' } },
      },
      MuiAppBar: {
        styleOverrides: { root: { boxShadow: 'none', backgroundImage: 'none' } },
      },
      MuiDrawer: {
        styleOverrides: { paper: { boxShadow: 'none', backgroundImage: 'none' } },
      },
      MuiDialog: {
        styleOverrides: { paper: { boxShadow: 'none' } },
      },
    },
    custom: {
      bubbleUser: p.bubbleUser,
      bubbleBot: p.bubbleBot,
      bubbleUserText: p.bubbleUserText,
      bubbleBotText: p.bubbleBotText,
      selectedColor: p.accent,
    },
  });
}
