import { useState, useEffect } from 'react';
import { api } from '../api';

export default function useServerHealth() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let timer;
    async function check() {
      try {
        const res = await fetch(api('/api/health'), { signal: AbortSignal.timeout(5000) });
        setOnline(res.ok);
      } catch {
        setOnline(false);
      }
    }
    check();
    timer = setInterval(check, 30000);
    return () => clearInterval(timer);
  }, []);

  return online;
}
