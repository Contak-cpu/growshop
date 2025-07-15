import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CloudDownload as DownloadIcon,
  CloudUpload as UploadIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import backupService, { BackupData } from '../services/backupService';

const BackupManager = () => {
  const [lastBackupInfo, setLastBackupInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadLastBackupInfo();
  }, []);

  const loadLastBackupInfo = () => {
    const info = backupService.getLastBackupInfo();
    setLastBackupInfo(info);
  };

  const handleExportBackup = async () => {
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
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      // Limpiar input
      if (event.target) {
        event.target.value = '';
      }
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

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const StatCard = ({ title, value, icon, color }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }) => (
    <Card sx={{ height: '100%', borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            background: color,
            color: 'white',
            mr: 2,
          }}>
            {icon}
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight={700} color="primary.main">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color="primary.main" mb={3}>
        Gestión de Backups
      </Typography>

      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {/* Estadísticas del último backup */}
      {lastBackupInfo && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          <StatCard
            title="Último Backup"
            value={formatTimestamp(lastBackupInfo.timestamp)}
            icon={<CheckIcon />}
            color={theme.palette.success.main}
          />
          <StatCard
            title="Productos"
            value={lastBackupInfo.metadata.totalProducts}
            icon={<InfoIcon />}
            color={theme.palette.primary.main}
          />
          <StatCard
            title="Ventas"
            value={lastBackupInfo.metadata.totalSales}
            icon={<InfoIcon />}
            color={theme.palette.secondary.main}
          />
          <StatCard
            title="Notificaciones"
            value={lastBackupInfo.metadata.totalNotifications}
            icon={<InfoIcon />}
            color={theme.palette.warning.main}
          />
        </Box>
      )}

      {/* Acciones de backup */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={3}>
          Acciones de Backup
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          <Box>
            <Button
              variant="contained"
              fullWidth
              startIcon={isLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
              onClick={handleExportBackup}
              disabled={isLoading || !backupService.hasDataToBackup()}
              sx={{ 
                py: 2, 
                borderRadius: 2,
                background: theme.palette.primary.main,
                '&:hover': {
                  background: theme.palette.primary.dark,
                }
              }}
            >
              Exportar Backup
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Descargar todos los datos como archivo JSON
            </Typography>
          </Box>

          <Box>
            <Button
              variant="outlined"
              fullWidth
              startIcon={isLoading ? <CircularProgress size={20} /> : <UploadIcon />}
              onClick={handleImportBackup}
              disabled={isLoading}
              sx={{ 
                py: 2, 
                borderRadius: 2,
                borderColor: theme.palette.secondary.main,
                color: theme.palette.secondary.main,
                '&:hover': {
                  borderColor: theme.palette.secondary.dark,
                  background: theme.palette.secondary.light + '20',
                }
              }}
            >
              Importar Backup
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Restaurar datos desde un archivo de backup
            </Typography>
          </Box>

          <Box>
            <Button
              variant="outlined"
              fullWidth
              startIcon={isLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
              onClick={handleManualBackup}
              disabled={isLoading}
              sx={{ 
                py: 2, 
                borderRadius: 2,
                borderColor: theme.palette.success.main,
                color: theme.palette.success.main,
                '&:hover': {
                  borderColor: theme.palette.success.dark,
                  background: theme.palette.success.light + '20',
                }
              }}
            >
              Backup Manual
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Crear backup manual ahora
            </Typography>
          </Box>
        </Box>

        {/* Información adicional */}
        <Box sx={{ mt: 4, p: 3, background: theme.palette.grey[50], borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} mb={2} color="primary.main">
            Información del Sistema
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Backup Automático:</strong> Cada 30 minutos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Formato:</strong> JSON con metadatos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Almacenamiento:</strong> Local + Exportación
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Versión:</strong> 1.0.0
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Input oculto para seleccionar archivo */}
      <input
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        ref={(input) => setFileInput(input)}
        onChange={handleFileSelect}
      />
    </Box>
  );
};

export default BackupManager; 