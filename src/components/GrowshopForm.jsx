import React, { useState } from 'react';
import RegistrarProductoForm from './RegistrarProductoForm.jsx';
import ProductosRegistradosForm from './ProductosRegistradosForm.jsx';
import RegistrarVentaForm from './RegistrarVentaForm.jsx';
import VentasRegistradasForm from './VentasRegistradasForm.jsx';
import ReportesAvanzadosForm from './ReportesAvanzadosForm.jsx';
import GraficoFiltrosReportesForm from './GraficoFiltrosReportesForm.jsx';
import InformeGeneralBackupForm from './InformeGeneralBackupForm.jsx';
import AccionesBackupForm from './AccionesBackupForm.jsx';
import { Box, ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';

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

// Solo se muestra la sección de productos, sin tabs ni títulos
const GrowshopForm = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ background: '#181c1f', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <RegistrarProductoForm onProductSaved={() => {}} editingProduct={null} />
          <Box mt={4} />
          <ProductosRegistradosForm onEditProduct={null} />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default GrowshopForm; 