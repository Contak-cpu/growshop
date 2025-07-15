import React from 'react';
import { Box, Typography, Button, Snackbar, Alert, useTheme } from '@mui/material';

const RegistroBaseForm = ({
  title,
  icon,
  children,
  onSubmit,
  success,
  error,
  buttonText = 'Guardar',
  loading = false,
}) => {
  const theme = useTheme();
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        maxWidth: 500,
        mx: 'auto',
        my: 3,
        borderRadius: 4,
        boxShadow: 3,
        background: theme.palette.background.paper,
        overflow: 'hidden',
        p: { xs: 2, sm: 4 },
      }}
    >
      {/* Encabezado */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: 'linear-gradient(90deg, #23272b 0%, #23272b 100%)',
          px: 3,
          py: 2,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          mb: 3,
        }}
      >
        <Box sx={{ fontSize: 40, color: theme.palette.success.main, display: 'flex', alignItems: 'center' }}>
          {icon}
        </Box>
        <Typography
          variant="h6"
          fontWeight={800}
          color="success.main"
          sx={{ letterSpacing: '-1px', fontSize: { xs: '1.1rem', sm: '1.3rem' } }}
        >
          {title}
        </Typography>
      </Box>
      {/* Cuerpo del form */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{children}</Box>
      <Button
        type="submit"
        variant="contained"
        color="success"
        size="large"
        fullWidth
        sx={{ mt: 3, fontWeight: 700, fontSize: '1.1rem', py: 1.5, borderRadius: 2, boxShadow: 1 }}
        disabled={loading}
        startIcon={icon}
      >
        {buttonText}
      </Button>
      <Snackbar open={!!success} autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%' }}>{success}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default RegistroBaseForm; 