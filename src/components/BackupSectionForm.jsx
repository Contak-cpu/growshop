import React, { useState, useEffect, useRef } from 'react';
import { Typography, Alert, Snackbar, Box, Button, Grid } from '@mui/material';
import ActionButtonForm from './ActionButtonForm.jsx';
import backupService from '../services/backupService';

const BackupSectionForm = () => {
  const [lastBackupInfo, setLastBackupInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    loadLastBackupInfo();
  }, []);

  const loadLastBackupInfo = () => {
    const info = backupService.getLastBackupInfo();
    setLastBackupInfo(info);
  };

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
      loadLastBackupInfo();
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
      loadLastBackupInfo();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al crear backup manual' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color="primary.main" mb={3}>
        Gestión de Backups
      </Typography>
      <ActionButtonForm title="Crear Backup Manual" onSubmit={handleManualBackup}>
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
      </ActionButtonForm>
      {lastBackupInfo && (
        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight={600}>Último Backup:</Typography>
          <Typography variant="body2">{new Date(lastBackupInfo.timestamp).toLocaleString('es-AR')}</Typography>
        </Box>
      )}
      {message && (
        <Snackbar open={!!message} autoHideDuration={2000} onClose={() => setMessage(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity={message.type} sx={{ width: '100%' }}>{message.text}</Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default BackupSectionForm; 