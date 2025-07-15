import React, { useState } from 'react';
import { Typography, Alert, Snackbar, Box } from '@mui/material';
import ActionButtonForm from './ActionButtonForm.jsx';

const PASSWORD = 'growshop2024'; // Puedes cambiar esta contraseña luego

const LoginForm = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (password === PASSWORD) {
      onLogin();
    } else {
      setError('Contraseña incorrecta');
      setOpen(true);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default">
      <Box sx={{ minWidth: 320 }}>
        <Typography variant="h5" fontWeight={700} color="primary.main" mb={2} align="center">
          Acceso a Growshop
        </Typography>
        <ActionButtonForm title="Ingresar" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              marginBottom: '1rem',
              width: '100%',
            }}
          />
        </ActionButtonForm>
        <Snackbar open={open} autoHideDuration={2000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default LoginForm; 