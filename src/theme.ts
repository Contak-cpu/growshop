import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#223A5E', // Azul oscuro
      contrastText: '#fff',
    },
    secondary: {
      main: '#6EC6FF', // Celeste claro
      contrastText: '#223A5E',
    },
    background: {
      default: '#F4F6F8', // Gris claro
      paper: '#fff',
    },
    text: {
      primary: '#222831', // Gris oscuro
      secondary: '#223A5E',
    },
    error: {
      main: '#D32F2F',
    },
    success: {
      main: '#388E3C',
    },
    warning: {
      main: '#FFA000',
    },
    info: {
      main: '#0288D1',
    },
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-1px' },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          fontWeight: 700,
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },
  },
});

export default theme; 