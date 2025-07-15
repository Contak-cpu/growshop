import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  useTheme, 
  useMediaQuery,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import productsService from '../services/productsService';
import salesService from '../services/salesService';
import { Product, Sale } from '../types';
import BusinessSelector from './BusinessSelector';
import { getCurrentConfig } from '../config/businessConfig';

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [config, setConfig] = useState(getCurrentConfig());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProducts(productsService.getAll());
    setSales(salesService.getAll());
    setLastRefresh(new Date());
  };

  const handleConfigChange = () => {
    setConfig(getCurrentConfig());
    // Aquí podrías recargar datos específicos según la nueva configuración
  };

  // Estadísticas del día
  const today = new Date().toDateString();
  const todaySales = sales.filter(sale => 
    new Date(sale.createdAt).toDateString() === today
  );
  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const todayCount = todaySales.length;

  // Productos con stock bajo
  const lowStockProducts = products.filter(p => p.stock < 10 && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  // Productos más vendidos (simulado por ahora)
  const topProducts = products.slice(0, 3);

  const StatCard = ({ title, value, subtitle, icon, color }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
  }) => (
    <Card sx={{ 
      height: '100%', 
      background: `linear-gradient(135deg, ${color}15, ${color}05)`,
      border: `1px solid ${color}30`,
      borderRadius: 3
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            background: color,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
          <IconButton size="small" onClick={loadData}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="h4" fontWeight={700} color="primary.main" mb={1}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="primary.main">
          Dashboard - {config.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Última actualización: {lastRefresh.toLocaleTimeString()}
          </Typography>
          <BusinessSelector onConfigChange={handleConfigChange} />
        </Box>
      </Box>

      {/* Estadísticas principales */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <StatCard
          title="Ventas Hoy"
          value={`$${todayTotal.toLocaleString()}`}
          subtitle={`${todayCount} transacciones`}
          icon={<ShoppingCartIcon />}
          color={theme.palette.primary.main}
        />
        <StatCard
          title="Productos"
          value={products.length}
          subtitle="en inventario"
          icon={<InventoryIcon />}
          color={theme.palette.secondary.main}
        />
        <StatCard
          title="Stock Bajo"
          value={lowStockProducts.length}
          subtitle="requieren atención"
          icon={<WarningIcon />}
          color="#FFA000"
        />
        <StatCard
          title="Sin Stock"
          value={outOfStockProducts.length}
          subtitle="productos agotados"
          icon={<TrendingUpIcon />}
          color="#D32F2F"
        />
      </Box>

      {/* Alertas y productos destacados */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={600} color="primary.main" mb={2}>
            Alertas de Stock
          </Typography>
          {lowStockProducts.length > 0 ? (
            <Box>
              {lowStockProducts.map(product => (
                <Box key={product.id} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 1.5,
                  mb: 1,
                  borderRadius: 2,
                  background: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  boxShadow: '0 2px 8px 0 rgba(67,160,71,0.08)',
                  border: `1.5px solid ${theme.palette.success.main}22`,
                }}>
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="inherit">
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Stock: {product.stock} unidades
                    </Typography>
                  </Box>
                  <Chip 
                    label="Stock Bajo" 
                    size="small" 
                    color="warning" 
                    variant="outlined"
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No hay productos con stock bajo
            </Typography>
          )}
        </Paper>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={600} color="primary.main" mb={2}>
            Productos Destacados
          </Typography>
          {topProducts.length > 0 ? (
            <Box>
              {topProducts.map(product => (
                <Box key={product.id} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 1.5,
                  mb: 1,
                  borderRadius: 2,
                  background: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  boxShadow: '0 2px 8px 0 rgba(67,160,71,0.08)',
                  border: `1.5px solid ${theme.palette.success.main}22`,
                }}>
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="inherit">
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ${product.price} - Stock: {product.stock}
                    </Typography>
                  </Box>
                  <Chip 
                    label="Disponible" 
                    size="small" 
                    color="success" 
                    variant="outlined"
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No hay productos registrados
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard; 