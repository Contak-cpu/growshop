import React, { useState } from 'react';
import GrowshopForm from './GrowshopForm.jsx';
import RestauranteForm from './RestauranteForm.jsx';
import ComercioMinoristaForm from './ComercioMinoristaForm.jsx';
import { Box, Typography, MenuItem, Select, Paper } from '@mui/material';

const TipoComercioForm = () => {
  const [tipo, setTipo] = useState('growshop');

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={3} color="primary.main">
        Selecciona el tipo de comercio
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Select
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          fullWidth
        >
          <MenuItem value="growshop">Growshop</MenuItem>
          <MenuItem value="restaurante">Restaurante</MenuItem>
          <MenuItem value="comercio">Comercio Minorista</MenuItem>
        </Select>
      </Box>
      {tipo === 'growshop' && <GrowshopForm />}
      {tipo === 'restaurante' && <RestauranteForm />}
      {tipo === 'comercio' && <ComercioMinoristaForm />}
    </Paper>
  );
};

export default TipoComercioForm; 