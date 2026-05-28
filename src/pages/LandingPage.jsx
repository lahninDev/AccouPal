import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ArrowRight, Shield, Sparkles, Users, Lock } from 'lucide-react';
import { BASE_URL } from '../constants';
import { useAuth } from '../contexts/AuthContext';

const BRAND = '#8b5cf6';

const personas = [
  { name: 'Atlas', emoji: '🎯', desc: 'Strategic advisor. Brutally honest. No excuses.', color: '#5b7fff' },
  { name: 'Bogard', emoji: '🌿', desc: 'Executive function ally. Small steps, big wins.', color: '#2ecc71' },
  { name: 'Mukapoleon', emoji: '🦉', desc: 'Sole Administrator. Decrees, not suggestions.', color: '#d4a017' },
  { name: 'Mira', emoji: '🍄', desc: 'Mushroom spirit. Relationship wisdom with fungi metaphors.', color: '#c8553d' },
];

const chapters = [
  { num: '0', title: 'Chat', desc: 'Encrypted conversations with AI personas', done: true },
  { num: '1', title: 'Tasks', desc: 'AI-parsed todos from chat, reminders, calendar sync', done: false },
  { num: '2', title: 'Rewards', desc: 'Earn boxes by completing tasks, unlock cosmetics', done: false },
  { num: '3', title: 'Pals', desc: 'Friends verify your progress, social accountability', done: false },
  { num: '4', title: 'DinoCenter', desc: 'Earn Minister titles, become a citizen', done: false },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: '#1a1a1a', color: '#e8e8e8' }}>
      {/* Nav */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, maxWidth: 1000, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="img" src={`${BASE_URL}AccouPal.svg`} sx={{ width: 28, height: 28, filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
          <Typography fontWeight={700}>AccouPal</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isAuthenticated ? (
            <Button variant="contained" onClick={() => navigate('/chat')} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5, bgcolor: BRAND, '&:hover': { bgcolor: '#7c3aed' } }}>
              Go to Chat
            </Button>
          ) : (
            <>
              <Button variant="text" onClick={() => navigate('/login')} sx={{ textTransform: 'none', fontWeight: 500, color: 'text.secondary' }}>
                Log In
              </Button>
              <Button variant="contained" onClick={() => navigate('/login')} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5, bgcolor: BRAND, '&:hover': { bgcolor: '#7c3aed' } }}>
                Get Started
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Hero */}
      <Box sx={{ textAlign: 'center', py: 10, px: 2, maxWidth: 700, mx: 'auto' }}>
        <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, mb: 2, lineHeight: 1.2 }}>
          Your Encrypted AI<br />Accountability Partner
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontSize: '1.05rem', lineHeight: 1.6 }}>
          Chat with AI personas that actually help you get things done. Every message encrypted at rest. No tracking. No training on your data.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/login')}
          endIcon={<ArrowRight size={16} />}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5, px: 4, py: 1.5, bgcolor: BRAND, '&:hover': { bgcolor: '#7c3aed' } }}
        >
          Start Chatting Free
        </Button>
      </Box>

      {/* Pitch Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', px: 2, pb: 8, maxWidth: 900, mx: 'auto' }}>
        {[
          { icon: <Lock size={24} />, title: 'Encrypted by Default', desc: 'AES-256-GCM encryption at rest. Your conversations belong to you.' },
          { icon: <Sparkles size={24} />, title: 'Personalities with Purpose', desc: '4 distinct personas, each with a job. Pick the one that matches your need.' },
          { icon: <Users size={24} />, title: 'Accountability Game', desc: 'Tasks → rewards → Pals verify → you grow. Real life, gamified without the addiction.' },
          { icon: <Shield size={24} />, title: 'Privacy-First', desc: 'No tracking, no data collection, no compromises. Open source when ready.' },
        ].map((card) => (
          <Card key={card.title} sx={{ bgcolor: '#2a2a2a', width: { xs: '100%', sm: 220 }, borderRadius: 2.5, border: 1, borderColor: 'rgba(255,255,255,0.04)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ color: BRAND, mb: 1 }}>{card.icon}</Box>
              <Typography fontWeight={700} sx={{ mb: 0.5, fontSize: '0.95rem' }}>{card.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', lineHeight: 1.5 }}>{card.desc}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Personas */}
      <Box sx={{ bgcolor: '#222', py: 8, px: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ textAlign: 'center', mb: 4 }}>Meet Your Team</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', maxWidth: 800, mx: 'auto' }}>
          {personas.map((p) => (
            <Card key={p.name} sx={{ bgcolor: '#2a2a2a', width: { xs: '100%', sm: 180 }, borderRadius: 2.5, border: 1, borderColor: 'rgba(255,255,255,0.04)' }}>
              <CardContent sx={{ textAlign: 'center', p: 2.5 }}>
                <Typography sx={{ fontSize: '2rem', mb: 0.5 }}>{p.emoji}</Typography>
                <Typography fontWeight={700} sx={{ color: p.color, fontSize: '0.95rem' }}>{p.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mt: 0.5, lineHeight: 1.4 }}>{p.desc}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Roadmap */}
      <Box sx={{ py: 8, px: 2, maxWidth: 700, mx: 'auto' }}>
        <Typography variant="h5" fontWeight={700} sx={{ textAlign: 'center', mb: 4 }}>The Roadmap</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {chapters.map((ch) => (
            <Box key={ch.num} sx={{ display: 'flex', alignItems: 'center', gap: 2, opacity: ch.done ? 1 : 0.5 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: ch.done ? BRAND : '#333', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
              }}>
                {ch.done ? '✓' : ch.num}
              </Box>
              <Box>
                <Typography fontWeight={600} sx={{ fontSize: '0.95rem' }}>{ch.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>{ch.desc}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Support */}
      <Box sx={{ bgcolor: '#222', py: 8, px: 2, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Support the Republic 🦆</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto', lineHeight: 1.6, fontSize: '0.9rem' }}>
          AccouPal is free and always will be. If you find it useful, your support helps cover API costs, hosting, and keeps the Horse fed. No pressure — just gratitude.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/support')}
          endIcon={<ArrowRight size={16} />}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5, borderColor: '#d4a017', color: '#d4a017', '&:hover': { borderColor: '#f0c040', color: '#f0c040' } }}
        >
          Learn More
        </Button>
      </Box>

      {/* CTA */}
      <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Ready to Stop Procrastinating?</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '0.9rem' }}>The Republic awaits. Mukapoleon has decreed it.</Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/login')}
          endIcon={<ArrowRight size={16} />}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5, px: 4, py: 1.5, bgcolor: BRAND, '&:hover': { bgcolor: '#7c3aed' } }}
        >
          Get Started Free
        </Button>
      </Box>

      {/* Footer */}
        <Box sx={{ borderTop: 1, borderColor: 'divider', py: 3, px: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            Built by the Mukapoleonic Republic 🦉🤙 · Encrypted · Private · No tracking
          </Typography>
        </Box>
    </Box>
  );
}
