import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BackupIcon from '@mui/icons-material/Backup';
import Dashboard from './components/Dashboard';
import RegistrarProductoForm from './components/RegistrarProductoForm.jsx';
import ProductosRegistradosForm from './components/ProductosRegistradosForm.jsx';
import RegistrarVentaForm from './components/RegistrarVentaForm.jsx';
import VentasRegistradasForm from './components/VentasRegistradasForm.jsx';
import ReportesAvanzadosForm from './components/ReportesAvanzadosForm.jsx';
import GraficoFiltrosReportesForm from './components/GraficoFiltrosReportesForm.jsx';
import InformeGeneralBackupForm from './components/InformeGeneralBackupForm.jsx';
import AccionesBackupForm from './components/AccionesBackupForm.jsx';
import SalesHistory from './components/SalesHistory';
import AdvancedReports from './components/AdvancedReports';
import BackupManager from './components/BackupManager';
import NotificationSystem from './components/NotificationSystem';
import Login from './components/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import notificationService from './services/notificationService';
import GrowshopForm from './components/GrowshopForm.jsx';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const pages = [
  { label: 'Dashboard', icon: <DashboardIcon sx={{ mr: 1 }} />, component: <Dashboard /> },
  {
    label: 'Productos',
    icon: <LocalMallIcon sx={{ mr: 1 }} />,
    component: <GrowshopForm />,
  },
  {
    label: 'Ventas',
    icon: <ShoppingCartIcon sx={{ mr: 1 }} />,
    component: (
      <Box>
        <RegistrarVentaForm onSaleSaved={() => {}} editingSale={null} />
        <Box mt={4} />
        <VentasRegistradasForm />
      </Box>
    ),
  },
  {
    label: 'Reportes',
    icon: <AssessmentIcon sx={{ mr: 1 }} />,
    component: (
      <Box>
        <ReportesAvanzadosForm />
        <Box mt={4} />
        <GraficoFiltrosReportesForm />
      </Box>
    ),
  },
  {
    label: 'Backup',
    icon: <BackupIcon sx={{ mr: 1 }} />,
    component: (
      <Box>
        <InformeGeneralBackupForm />
        <Box mt={4} />
        <AccionesBackupForm />
      </Box>
    ),
  },
  { label: 'Historial', icon: <HistoryEduIcon sx={{ mr: 1 }} />, component: <SalesHistory /> },
];

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#181c1f',
      paper: '#23272b',
    },
    primary: { main: '#43a047' },
    secondary: { main: '#6EC6FF' },
    text: {
      primary: '#fff',
      secondary: '#b0b8c1',
    },
    success: { main: '#43a047' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  const [page, setPage] = useState(0);
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem('growshop_auth') === '1');
  const [notifications, setNotifications] = useState(notificationService.getAll());

  useEffect(() => {
    // Actualizar notificaciones cada 5 segundos
    const interval = setInterval(() => {
      setNotifications(notificationService.getAll());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
    localStorage.setItem('growshop_auth', '1');
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('growshop_auth');
  };

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications(notificationService.getAll());
  };

  const handleDeleteNotification = (id: string) => {
    notificationService.delete(id);
    setNotifications(notificationService.getAll());
  };

  const handleClearAllNotifications = () => {
    notificationService.clearAll();
    setNotifications(notificationService.getAll());
  };

  if (!authenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default' }}>
        <AppBar position="static" color="primary" elevation={2} sx={{ borderRadius: 0, boxShadow: 2 }}>
          <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LocalMallIcon sx={{ fontSize: 36, color: 'secondary.main', mr: 1 }} />
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: '-1px', color: 'white' }}
            >
              Growshop Control
            </Typography>
            {pages.map((p, i) => (
              <Button
                key={p.label}
                color={page === i ? 'secondary' : 'inherit'}
                onClick={() => setPage(i)}
                startIcon={p.icon}
                sx={{
                  fontWeight: page === i ? 800 : 500,
                  borderBottom: page === i ? '3px solid #6EC6FF' : 'none',
                  borderRadius: 0,
                  mx: 1,
                  color: page === i ? 'secondary.main' : 'white',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  transition: 'all 0.2s',
                }}
              >
                {p.label}
              </Button>
            ))}
            <NotificationSystem
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDeleteNotification={handleDeleteNotification}
              onClearAll={handleClearAllNotifications}
            />
            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />} sx={{ ml: 2 }}>
              Salir
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, backgroundColor: 'transparent' }}>
          {pages[page].component}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
