import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import productsService from '../services/productsService';
import salesService from '../services/salesService';
import { Product, Sale } from '../types';

const AdvancedReports = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setProducts(productsService.getAll());
    setSales(salesService.getAll());
  }, []);

  // Datos para gráficos
  const getSalesByDay = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    }).reverse();

    return last7Days.map(day => ({
      date: new Date(day).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }),
      ventas: sales.filter(sale => 
        new Date(sale.createdAt).toDateString() === day
      ).reduce((sum, sale) => sum + sale.totalAmount, 0),
    }));
  };

  const getTopProducts = () => {
    // Simular productos más vendidos (en una implementación real, esto vendría de las ventas)
    return products.slice(0, 5).map(product => ({
      name: product.name,
      ventas: Math.floor(Math.random() * 100) + 10, // Simulado
      stock: product.stock,
    }));
  };

  const getPaymentMethodsData = () => {
    const methods = sales.reduce((acc, sale) => {
      acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(methods).map(([method, count]) => ({
      name: method,
      value: count,
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const StatCard = ({ title, value, subtitle, icon, color }: {
    title: string;
    value: string | number;
    subtitle?: string;
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
        <Typography variant="h4" fontWeight={700} color="primary.main" mb={1}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color="primary.main" mb={3}>
        Reportes Avanzados
      </Typography>

      {/* Estadísticas principales */}
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

      {/* Gráficos */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Ventas por Día" />
          <Tab label="Productos Más Vendidos" />
          <Tab label="Métodos de Pago" />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ height: 400 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Evolución de Ventas (Últimos 7 días)
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getSalesByDay()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Ventas']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke={theme.palette.primary.main} 
                  strokeWidth={3}
                  dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ height: 400 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Productos Más Vendidos
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getTopProducts()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ventas" fill={theme.palette.secondary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ height: 400 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Distribución por Método de Pago
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getPaymentMethodsData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getPaymentMethodsData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AdvancedReports; 