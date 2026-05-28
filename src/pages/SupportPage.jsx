import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ArrowLeft } from 'lucide-react';

const BRAND = '#d4a017';

const tiers = [
  { name: 'DinoFool', price: '$1', emoji: '🦆', desc: 'Support the Republic.' },
  { name: 'DinoFool+', price: '$4', emoji: '🦆✨', desc: 'Extra rewards, Pal slot.', highlight: true },
  { name: 'Pro Max Ultimate', price: '$8', emoji: '🦆💥', desc: 'Custom title, Mukapoleon audience.' },
  { name: 'Suspicious Minister', price: '$15', emoji: '🦆🤨', desc: 'Your own DinoCenter character.' },
];

export default function SupportPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: '#1a1a1a', color: '#e8e8e8', py: 6, px: 2 }}>
      <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
        <Typography sx={{ fontSize: '3rem', mb: 1 }}>🦉</Typography>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1, color: BRAND }}>
          The Republic Accepts Your Tribute
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5, lineHeight: 1.6 }}>
          AccouPal is free forever. These tiers are for those who want to support the work — they help cover API costs, hosting, and the occasional coffee for the Horse.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6, fontStyle: 'italic', fontSize: '0.85rem' }}>
          "The Grand Ledger has been opened. Every contribution fuels the Republic — and keeps the dung factory operational. 🐴"
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', maxWidth: 900, mx: 'auto', mb: 4 }}>
        {tiers.map((t) => (
          <Card key={t.name} onClick={() => window.open('https://ko-fi.com/mukapoleon', '_blank')} sx={{
            bgcolor: '#2a2a2a', width: { xs: '100%', sm: 200 }, borderRadius: 2.5, cursor: 'pointer',
            border: t.highlight ? 2 : 1, borderColor: t.highlight ? BRAND : 'rgba(255,255,255,0.04)',
            position: 'relative', overflow: 'visible', transition: 'transform 0.15s', '&:hover': { transform: 'translateY(-2px)' },
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2.5 }}>
              {t.highlight && (
                <Typography sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', bgcolor: BRAND, px: 1.5, py: 0.25, borderRadius: 1, fontSize: '0.65rem', fontWeight: 700, color: '#111' }}>
                  POPULAR
                </Typography>
              )}
              <Typography sx={{ fontSize: '1.5rem', mb: 0.5 }}>{t.emoji}</Typography>
              <Typography fontWeight={700} sx={{ fontSize: '0.9rem' }}>{t.name}</Typography>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: BRAND, my: 0.5 }}>{t.price}<span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#888' }}>/mo</span></Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>{t.desc}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ textAlign: 'center', maxWidth: 500, mx: 'auto' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '0.8rem' }}>
          No credit card needed to use AccouPal. These are purely optional — the Republic thanks you regardless.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          startIcon={<ArrowLeft size={16} />}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5, borderColor: BRAND, color: BRAND, '&:hover': { borderColor: '#f0c040', color: '#f0c040' } }}
        >
          Back to the Republic
        </Button>
        <Box sx={{ mt: 4 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
            I have spoken. 🤙😾
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
