import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import { Plus, X, Eye, EyeOff } from 'lucide-react';
import { buildTheme, getGreeting, getPersonality } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import useServerHealth from '../hooks/useServerHealth';
import usePersonalities from '../hooks/usePersonalities';
import AppBar from '../components/AppBar';
import ChatDrawer from '../components/ChatDrawer';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import ChatSkeleton from '../components/ChatSkeleton';
import { api } from '../api';
import PersonaPicker from '../components/PersonaPicker';

const DRAWER_W = 260;
const RAIL_W = 52;
const STORAGE_KEY = 'accoupal';
const MAX_GUEST_MSGS = 15;

function ChatBody({ msgs, isLoading, loadingSession, onNewChat, newMsgIds, onResend, memoryNote }) {
  const bottomRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  if (loadingSession) {
    return (
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <ChatSkeleton />
      </Box>
    );
  }

  if (msgs.length === 0 && !isLoading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, px: 2 }}>
        <IconButton
          onClick={onNewChat}
          sx={{ width: 64, height: 64, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          <Plus size={32} strokeWidth={1.5} style={{ color: '#fff' }} />
        </IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
          Start a new conversation
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        px: 2.5,
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        '&::-webkit-scrollbar': { width: 5 },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 3 },
      }}
    >
      {memoryNote && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <Box sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: 'rgba(88,166,255,0.1)', border: '1px solid rgba(88,166,255,0.2)', fontSize: '0.7rem', color: '#58a6ff', fontWeight: 500 }}>
            📖 {memoryNote}
          </Box>
        </Box>
      )}
      {msgs.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} animate={newMsgIds.current.has(msg.id)} onResend={onResend} />
      ))}
      {isLoading && (
        <Box sx={{ maxWidth: '60%', alignSelf: 'flex-start', px: 2, py: 1.5 }}>
          <Box sx={{ width: 24, height: 24, bgcolor: 'text.secondary', animation: 'dance 1.6s ease-in-out infinite' }} />
        </Box>
      )}
      <div ref={bottomRef} />
    </Box>
  );
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { sessionId: paramSessionId } = useParams();
  const { userId, username, isGuest, logout: authLogout, register } = useAuth();
  const serverOnline = useServerHealth();
  const personalities = usePersonalities();

  const [sessionId, setSessionId] = useState(paramSessionId || null);
  const [msgs, setMsgs] = useState(() => {
    if (isGuest) return [];
    const saved = localStorage.getItem(`${STORAGE_KEY}_msgs`);
    if (saved) return JSON.parse(saved);
    return [];
  });
  const [sessions, setSessions] = useState([]);
  const [allMessages, setAllMessages] = useState({});
  const [personality, setPersonality] = useState(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY}_personality`);
    return stored && stored !== 'null' ? stored : null;
  });
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [sessionError, setSessionError] = useState(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [reminderDismissed, setReminderDismissed] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [memoryNote, setMemoryNote] = useState(null);
  const [signupOpen, setSignupOpen] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [signupShowPw, setSignupShowPw] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const pendingNewChat = useRef(false);
  const newMsgIds = useRef(new Set());

  const persona = useMemo(
    () => personalities.find((p) => p.id === personality) || { id: personality, name: personality, motto: null, color: '#888', portrait: null },
    [personalities, personality],
  );
  const theme = useMemo(() => buildTheme(personality), [personality]);
  const selectedColor = useMemo(() => getPersonality(personality).accent, [personality]);

  useEffect(() => { if (!isGuest) localStorage.setItem(`${STORAGE_KEY}_msgs`, JSON.stringify(msgs)); }, [msgs, isGuest]);
  useEffect(() => { if (!isGuest) localStorage.setItem(`${STORAGE_KEY}_session`, JSON.stringify(sessionId)); }, [sessionId, isGuest]);
  useEffect(() => {
    if (isGuest) return;
    if (personality === null) {
      localStorage.removeItem(`${STORAGE_KEY}_personality`);
    } else {
      localStorage.setItem(`${STORAGE_KEY}_personality`, personality);
    }
  }, [personality, isGuest]);

  useEffect(() => {
    if (pendingNewChat.current && personalities.length > 0) {
      pendingNewChat.current = false;
      setShowPicker(true);
    }
  }, [personalities]);

  useEffect(() => {
    if (sessionId && msgs.length > 0) {
      setAllMessages((prev) => ({ ...prev, [sessionId]: msgs }));
    }
  }, [sessionId, msgs]);

  const fetchSessions = useCallback(async () => {
    if (isGuest) return;
    try {
      const r = await fetch(api(`/api/sessions?userId=${userId}`));
      if (r.ok) {
        const list = await r.json();
        setSessions(list);
        Promise.allSettled(
          list.map(async (s) => {
            const r2 = await fetch(api(`/api/sessions/${s.id}/messages?userId=${userId}`));
            if (!r2.ok) return;
            const data = await r2.json();
            const mapped = data.map((m) => ({ ...m, role: m.role === 'assistant' ? 'bot' : m.role, time: new Date(m.time) }));
            setAllMessages((prev) => ({ ...prev, [s.id]: mapped }));
          })
        );
      }
    } catch {}
  }, [userId, isGuest]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);
  useEffect(() => { if (sessionId) fetchSessions(); }, [sessionId]);

  useEffect(() => {
    if (isGuest) {
      if (sessionId) {
        setSessions([{
          id: sessionId,
          title: 'Guest Chat',
          personality,
          message_count: msgs.length,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }]);
      } else {
        setSessions([]);
      }
    }
  }, [isGuest, sessionId]);

  function newChat() {
    if (personalities.length > 0) {
      setShowPicker(true);
    } else {
      pendingNewChat.current = true;
    }
  }

  async function loadSession(id) {
    setLoadingSession(true);
    newMsgIds.current.clear();
    try {
      const r = await fetch(api(`/api/sessions/${id}/messages?userId=${userId}`));
      if (r.ok) {
        const data = await r.json();
        const mapped = data.map((m) => ({ ...m, role: m.role === 'assistant' ? 'bot' : m.role, time: new Date(m.time) }));
        setMsgs(mapped);
        setSessionId(id);
        const s = sessions.find((s) => s.id === id);
        if (s?.personality) setPersonality(s.personality);
        navigate(`/chat/${id}`, { replace: true });
      } else if (r.status === 404) {
        setSessionError('This session no longer exists. It may have been deleted or expired.');
        setSessions((prev) => prev.filter((s) => s.id !== id));
      } else if (r.status === 401) {
        setSessionExpired(true);
      } else {
        setSessionError(`Failed to load session (${r.status}).`);
      }
    } catch {
      setSessionError('Server unreachable. Could not load this session.');
    }
    setLoadingSession(false);
  }

  const handleSend = useCallback(async (text) => {
    const userMsg = { id: Date.now(), role: 'user', text, time: new Date() };
    newMsgIds.current.add(userMsg.id);
    setMsgs((prev) => [...prev, userMsg]);
    setIsLoading(true);

    async function trySend(endpoint) {
      const r = await fetch(api(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId, userId, personality }),
      });
      return r;
    }

    try {
      const isMemoryPersona = personality === "Mukapoleon";
      let r = await trySend(isMemoryPersona ? '/api/hermes/chat' : '/api/chat');
      if (!r.ok && isMemoryPersona && (r.status === 502 || r.status === 500)) {
        r = await trySend('/api/chat');
      }
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        if (body.error === 'guest_limit') {
          setUpgradeOpen(true);
          setIsLoading(false);
          return;
        }
        throw new Error(`Server error (${r.status})`);
      }
      const data = await r.json();
      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
        navigate(`/chat/${data.sessionId}`, { replace: true });
      }
      setMemoryNote(data._memory || null);
      const botMsg = { id: Date.now() + 1, role: 'bot', text: data.reply, time: new Date() };
      newMsgIds.current.add(botMsg.id);
      setMsgs((prev) => [...prev, botMsg]);
    } catch (err) {
      if (err.message?.includes('401')) {
        setSessionExpired(true);
        setIsLoading(false);
        return;
      }
      setMsgs((prev) => prev.map((m) => (m.id === userMsg.id ? { ...m, failed: true } : m)));
    }
    setIsLoading(false);
  }, [sessionId, userId, personality, isGuest, navigate]);

  function validatePassword(val) {
    if (!val) return 'Password is required';
    if (val.length < 8) return 'At least 8 characters';
    if (!/[a-z]/.test(val)) return 'Needs a lowercase letter';
    if (!/[A-Z]/.test(val)) return 'Needs an uppercase letter';
    if (!/\d/.test(val)) return 'Needs a number';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val)) return 'Needs a special character';
    return '';
  }

  async function handleSignup() {
    const trimmed = signupName.trim();
    if (!trimmed) return;
    const pwErr = validatePassword(signupPw);
    if (pwErr) { setSignupError(pwErr); return; }
    setSignupError('');
    setSignupLoading(true);
    try {
      await register(trimmed, signupPw);
      setSignupOpen(false);
    } catch (err) {
      setSignupError(err.message || 'Signup failed');
    }
    setSignupLoading(false);
  }

  function changePersonality(newP) {
    setPersonality(newP);
    setSessionId(null);
    newMsgIds.current.clear();
    setMsgs([{ id: Date.now(), role: 'bot', text: getGreeting(newP), time: new Date() }]);
    navigate('/chat', { replace: true });
  }

  async function handleRename(id, title) {
    try {
      const r = await fetch(api(`/api/sessions/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title }),
      });
      if (r.ok) {
        const updated = await r.json();
        setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, title: updated.title } : s)));
      }
    } catch {}
  }

  async function deleteSession(id) {
    try {
      const r = await fetch(api(`/api/sessions/${id}`), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (r.ok) {
        if (sessionId === id) newChat();
        setSessions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {}
  }

  function handleLogout() {
    authLogout();
    navigate('/login', { replace: true });
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden', bgcolor: 'background.default' }}>
        {!serverOnline && (
          <Box sx={{ px: 2, py: 0.5, bgcolor: '#e74c3c', color: '#fff', textAlign: 'center', fontSize: '0.75rem', fontWeight: 500, zIndex: 1300 }}>
            Disconnected — messages won't send
          </Box>
        )}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {isMobile ? (
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: DRAWER_W, height: '100%', bgcolor: 'background.paper' } }}
              >
                <ChatDrawer
                  open
                  sessions={sessions}
                  allMessages={allMessages}
                  currentId={sessionId}
                  onSelect={(id) => { loadSession(id); setMobileOpen(false); }}
                  onNewChat={() => { newChat(); setMobileOpen(false); }}
                  onDelete={deleteSession}
                  onRename={handleRename}
                  onToggle={() => setMobileOpen(false)}
                  selectedColor={selectedColor}
              />
            </Drawer>
          ) : (
            <Drawer
              variant="persistent"
              anchor="left"
              open
              sx={{
                width: sidebarOpen ? DRAWER_W : RAIL_W,
                flexShrink: 0,
                transition: 'width 0.2s ease',
                '& .MuiDrawer-paper': {
                  width: sidebarOpen ? DRAWER_W : RAIL_W,
                  position: 'relative',
                  bgcolor: 'background.paper',
                  borderRight: 1,
                  borderColor: 'divider',
                  transition: 'width 0.2s ease',
                  overflow: 'hidden',
                },
              }}
            >
              <ChatDrawer
                open={sidebarOpen}
                sessions={sessions}
                allMessages={allMessages}
                currentId={sessionId}
                onSelect={loadSession}
                onNewChat={newChat}
                onDelete={deleteSession}
                onRename={handleRename}
                onToggle={() => setSidebarOpen((o) => !o)}
                selectedColor={selectedColor}
              />
            </Drawer>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <AppBar
              username={username}
              onLogout={handleLogout}
              persona={persona}
              serverOnline={serverOnline}
              onMenuClick={() => setMobileOpen(true)}
            />
            {isGuest && !reminderDismissed && msgs.length >= 10 && msgs.length < MAX_GUEST_MSGS && (
              <Box sx={{ px: 2, py: 0.75, bgcolor: 'primary.main', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, fontSize: '0.8rem' }}>
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                  You have {MAX_GUEST_MSGS - msgs.length} messages left. Sign up to keep your chats.
                </Typography>
                <Button size="small" variant="contained" onClick={() => { setSignupName(''); setSignupPw(''); setSignupError(''); setSignupOpen(true); }} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
                  Sign Up
                </Button>
                <IconButton size="small" onClick={() => setReminderDismissed(true)} sx={{ color: '#fff', opacity: 0.7, '&:hover': { opacity: 1 } }}>
                  <X size={14} strokeWidth={2} />
                </IconButton>
              </Box>
            )}
            <ChatBody msgs={msgs} isLoading={isLoading} loadingSession={loadingSession} onNewChat={newChat} newMsgIds={newMsgIds} onResend={handleSend} memoryNote={memoryNote} />
            <Box sx={{ position: 'sticky', bottom: 0, zIndex: 10, boxShadow: '0 -4px 12px rgba(0,0,0,0.3)' }}>
              {personality && <ChatInput onSend={handleSend} isLoading={isLoading} />}
            </Box>
          </Box>
        </Box>
        {showPicker && personalities.length > 0 && (
          <PersonaPicker personalities={personalities} current={personality} onSelect={changePersonality} onClose={() => setShowPicker(false)} />
        )}
        <Dialog open={!!sessionError} onClose={() => setSessionError(null)} maxWidth="xs">
          <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>Session Error</DialogTitle>
          <DialogContent sx={{ pt: 1.5, pb: 1 }}>
            <Typography variant="body2" color="text.secondary">{sessionError}</Typography>
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 2 }}>
            <Button onClick={() => { setSessionError(null); newChat(); }} variant="contained" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}>
              Start New Chat
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={upgradeOpen} onClose={() => setUpgradeOpen(false)} maxWidth="xs">
          <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>Trial Complete</DialogTitle>
          <DialogContent sx={{ pt: 1.5, pb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              You've used all your trial messages. Sign up with a username to keep chatting.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 2 }}>
            <Button onClick={() => setUpgradeOpen(false)} sx={{ textTransform: 'none' }}>Later</Button>
            <Button onClick={() => { setUpgradeOpen(false); setSignupName(''); setSignupPw(''); setSignupError(''); setSignupOpen(true); }} variant="contained" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}>
              Sign Up
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={sessionExpired} onClose={() => setSessionExpired(false)} maxWidth="xs">
          <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>Session Expired</DialogTitle>
          <DialogContent sx={{ pt: 1.5, pb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Your session has expired. Please log in again to continue.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 2 }}>
            <Button onClick={() => setSessionExpired(false)} sx={{ textTransform: 'none' }}>Stay</Button>
            <Button onClick={handleLogout} variant="contained" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}>
              Log In
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={signupOpen} onClose={() => setSignupOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>Sign Up</DialogTitle>
          <DialogContent sx={{ pt: 2, pb: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {signupError && <Alert severity="error" sx={{ py: 0.5, fontSize: '0.8rem' }}>{signupError}</Alert>}
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Create an account to save your chats and get unlimited messages.
              </Typography>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                size="small"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSignup(); }}
                disabled={signupLoading}
                autoFocus
              />
              <TextField
                label="Password"
                type={signupShowPw ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                size="small"
                value={signupPw}
                onChange={(e) => setSignupPw(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSignup(); }}
                disabled={signupLoading}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSignupShowPw(!signupShowPw)} tabIndex={-1}>
                          {signupShowPw ? <EyeOff size={14} /> : <Eye size={14} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 2 }}>
            <Button onClick={() => setSignupOpen(false)} sx={{ textTransform: 'none' }} disabled={signupLoading}>Cancel</Button>
            <Button onClick={handleSignup} variant="contained" disabled={signupLoading} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}>
              {signupLoading ? 'Creating...' : 'Create Account'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
