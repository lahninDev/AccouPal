import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function ChatSkeleton() {
  return (
    <>
      {[70, 50, 60, 40, 55].map((w, i) => (
        <Box
          key={i}
          sx={{ alignSelf: i % 2 === 0 ? 'flex-end' : 'flex-start', maxWidth: '60%' }}
        >
          <Skeleton variant="rounded" width={`${w}%`} height={44} sx={{ borderRadius: 2, bgcolor: 'divider' }} />
        </Box>
      ))}
    </>
  );
}
