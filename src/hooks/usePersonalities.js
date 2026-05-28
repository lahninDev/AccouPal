import { useState, useEffect } from 'react';
import { api } from '../api';

export default function usePersonalities() {
  const [personalities, setPersonalities] = useState([]);

  useEffect(() => {
    fetch(api('/api/personalities'))
      .then((r) => { if (r.ok) return r.json(); })
      .then((d) => { if (d) setPersonalities(d); })
      .catch(() => {});
  }, []);

  return personalities;
}
