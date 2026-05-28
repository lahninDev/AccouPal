import { BrowserRouter } from 'react-router-dom';
import { BASE_URL } from './constants';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { buildTheme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './router';

export default function App() {
  return (
    <BrowserRouter basename={BASE_URL.replace(/\/+$/, '')}>
      <ThemeProvider theme={buildTheme(null)}>
        <CssBaseline />
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
