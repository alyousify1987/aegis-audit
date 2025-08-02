// src/App.tsx

import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { useUserStore } from './store/user.store';
import { MainLayout } from './components/Layout';
import { AppHeader } from './components/AppHeader';

// --- START OF THE FIX: Enhanced Theme Configuration ---
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7df9ff',
    },
    background: {
      default: '#1a1a1a',
      paper: '#242424',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#b0b0b0',
    },
  },
  // This section ensures the correct fonts and sizes are used everywhere.
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','), // Default body font is Inter
    h1: { fontFamily: ['Poppins', 'sans-serif'].join(','), fontWeight: 700 },
    h2: { fontFamily: ['Poppins', 'sans-serif'].join(','), fontWeight: 600 },
    h3: { fontFamily: ['Poppins', 'sans-serif'].join(','), fontWeight: 600 },
    h4: { fontFamily: ['Poppins', 'sans-serif'].join(','), fontWeight: 600 },
    h5: { fontFamily: ['Poppins', 'sans-serif'].join(','), fontWeight: 500 },
    h6: { fontFamily: ['Poppins', 'sans-serif'].join(','), fontWeight: 500 }, // Our Hub titles
    button: {
      fontFamily: ['Poppins', 'sans-serif'].join(','),
      fontWeight: 500,
      textTransform: 'none' // A more modern look for buttons
    }
  },
});
// --- END OF THE FIX ---


function App() {
  const { isLoggedIn } = useUserStore();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'background.default' }}>
        {isLoggedIn ? (
          <MainLayout />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
            <AppHeader />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;