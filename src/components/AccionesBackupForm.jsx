import React, { useRef, useState } from 'react';
import { Box, Typography, Paper, Button, Snackbar, Alert, Grid } from '@mui/material';
import backupService from '../services/backupService';

const AccionesBackupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef();

  const handleExportBackup = () => {
    setIsLoading(true);
    setMessage(null);
    try {
      backupService.exportBackup();
      setMessage({ type: 'success', text: 'Backup exportado correctamente' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al exportar backup' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportBackup = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    setMessage(null);
    try {
      await backupService.importBackup(file);
      setMessage({ type: 'success', text: 'Backup importado correctamente' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al importar backup' });
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  const handleManualBackup = () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const backup = backupService.createBackup();
      backupService.saveBackup(backup);
      setMessage({ type: 'success', text: 'Backup manual creado correctamente' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al crear backup manual' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Acciones de Backup
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" fullWidth onClick={handleExportBackup} disabled={isLoading}>
            Exportar Backup
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" fullWidth onClick={handleImportBackup} disabled={isLoading}>
            Importar Backup
          </Button>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" color="success" fullWidth onClick={handleManualBackup} disabled={isLoading}>
            Crear Backup Manual
          </Button>
        </Grid>
      </Grid>
      {message && (
        <Snackbar open={!!message} autoHideDuration={2000} onClose={() => setMessage(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity={message.type} sx={{ width: '100%' }}>{message.text}</Alert>
        </Snackbar>
      )}
    </Paper>
  );
};

export default AccionesBackupForm; 