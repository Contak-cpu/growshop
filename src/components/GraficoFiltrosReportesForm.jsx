import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, MenuItem, TextField } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import salesService from '../services/salesService';

const GraficoFiltrosReportesForm = () => {
  const [sales, setSales] = useState([]);
  const [dias, setDias] = useState(7);
  const [data, setData] = useState([]);

  useEffect(() => {
    setSales(salesService.getAll());
  }, []);

  useEffect(() => {
    const lastNDays = Array.from({ length: dias }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    }).reverse();
    const chartData = lastNDays.map(day => ({
      date: new Date(day).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }),
      ventas: sales.filter(sale => new Date(sale.createdAt).toDateString() === day).reduce((sum, sale) => sum + sale.totalAmount, 0),
    }));
    setData(chartData);
  }, [sales, dias]);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Gráfico de Ventas por Día
      </Typography>
      <Box sx={{ mb: 2, maxWidth: 200 }}>
        <TextField
          select
          label="Días a mostrar"
          value={dias}
          onChange={e => setDias(Number(e.target.value))}
          fullWidth
        >
          {[7, 15, 30].map(opt => (
            <MenuItem key={opt} value={opt}>{opt} días</MenuItem>
          ))}
        </TextField>
      </Box>
      <Box sx={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={value => [`$${value}`, 'Ventas']} />
            <Legend />
            <Line type="monotone" dataKey="ventas" stroke="#1976d2" strokeWidth={3} dot={{ fill: '#1976d2', strokeWidth: 2, r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default GraficoFiltrosReportesForm; 