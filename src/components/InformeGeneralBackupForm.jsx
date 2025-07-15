import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import backupService from '../services/backupService';

const InformeGeneralBackupForm = () => {
  const [lastBackupInfo, setLastBackupInfo] = useState(null);

  useEffect(() => {
    setLastBackupInfo(backupService.getLastBackupInfo());
  }, []);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Informe General de Backup
      </Typography>
      {lastBackupInfo ? (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Último Backup</Typography>
              <Typography fontWeight={700}>{new Date(lastBackupInfo.timestamp).toLocaleString('es-AR')}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Productos</Typography>
              <Typography fontWeight={700}>{lastBackupInfo.metadata.totalProducts}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Ventas</Typography>
              <Typography fontWeight={700}>{lastBackupInfo.metadata.totalSales}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Notificaciones</Typography>
              <Typography fontWeight={700}>{lastBackupInfo.metadata.totalNotifications}</Typography>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Typography color="text.secondary">No hay información de backup disponible.</Typography>
      )}
    </Paper>
  );
};

export default InformeGeneralBackupForm; 