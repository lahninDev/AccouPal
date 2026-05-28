import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

export default function ConnectionBadge({ online }) {
  return (
    <Tooltip title={online ? 'Connected' : 'Disconnected'}>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          bgcolor: online ? '#2ecc71' : '#e74c3c',
          boxShadow: (t) => `0 0 0 2px ${t.palette.background.paper}`,
          flexShrink: 0,
        }}
      />
    </Tooltip>
  );
}
