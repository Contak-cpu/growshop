import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import productsService from '../services/productsService';
import salesService from '../services/salesService';

const ReportesAvanzadosForm = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setProducts(productsService.getAll());
    setSales(salesService.getAll());
  }, []);

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <Card sx={{ height: '100%', borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ p: 1.5, borderRadius: 2, background: color, color: 'white', mr: 2 }}>{icon}</Box>
          <Typography variant="h6" fontWeight={600}>{title}</Typography>
        </Box>
        <Typography variant="h4" fontWeight={700} color="primary.main" mb={1}>{value}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
      </CardContent>
    </Card>
  );

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Reportes Avanzados
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <StatCard
          title="Total Ventas"
          value={`$${sales.reduce((sum, sale) => sum + sale.totalAmount, 0).toLocaleString()}`}
          subtitle="Historial completo"
          icon={<TrendingUpIcon />}
          color={theme.palette.primary.main}
        />
        <StatCard
          title="Promedio por Venta"
          value={`$${sales.length > 0 ? (sales.reduce((sum, sale) => sum + sale.totalAmount, 0) / sales.length).toFixed(0) : 0}`}
          subtitle="Ticket promedio"
          icon={<BarChartIcon />}
          color={theme.palette.secondary.main}
        />
        <StatCard
          title="Productos Activos"
          value={products.filter(p => p.stock > 0).length}
          subtitle="Con stock disponible"
          icon={<PieChartIcon />}
          color="#4CAF50"
        />
        <StatCard
          title="Transacciones"
          value={sales.length}
          subtitle="Ventas registradas"
          icon={<TrendingUpIcon />}
          color="#FF9800"
        />
      </Box>
    </Paper>
  );
};

export default ReportesAvanzadosForm; 