import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, Snackbar } from '@mui/material';

const PASSWORD = 'growshop2024'; // Puedes cambiar esta contraseña luego

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      onLogin();
    } else {
      setError('Contraseña incorrecta');
      setOpen(true);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, minWidth: 320 }}>
        <Typography variant="h5" fontWeight={700} color="primary.main" mb={2} align="center">
          Acceso a Growshop
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" size="large">
            Ingresar
          </Button>
        </Box>
        <Snackbar open={open} autoHideDuration={2000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default Login; 