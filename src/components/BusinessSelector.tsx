import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  useTheme,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { businessConfigs, getCurrentConfig, changeBusinessType } from '../config/businessConfig';

const BusinessSelector = ({ onConfigChange }: { onConfigChange: () => void }) => {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(getCurrentConfig().type);
  const theme = useTheme();

  const handleChangeBusiness = (type: string) => {
    changeBusinessType(type);
    setSelectedType(type as any);
    onConfigChange();
    setOpen(false);
  };

  const BusinessCard = ({ type, config }: { type: string; config: any }) => (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s',
        border: selectedType === type ? `2px solid ${config.theme.primaryColor}` : '2px solid transparent',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={() => setSelectedType(type as any)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: config.theme.primaryColor,
              color: 'white',
              mr: 2,
            }}
          >
            {type === 'growshop' && <StorefrontIcon />}
            {type === 'restaurant' && <RestaurantIcon />}
            {type === 'retail' && <ShoppingBagIcon />}
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {config.name}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Configuración optimizada para {config.name.toLowerCase()}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {config.features.stockControl && <Chip label="Stock" size="small" color="primary" />}
          {config.features.customerManagement && <Chip label="Clientes" size="small" color="secondary" />}
          {config.features.reports && <Chip label="Reportes" size="small" color="success" />}
          {config.features.exportData && <Chip label="Exportar" size="small" color="info" />}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: config.theme.primaryColor,
            }}
          />
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: config.theme.secondaryColor,
            }}
          />
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: config.theme.accentColor,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setOpen(true)}
        startIcon={<StorefrontIcon />}
        sx={{ mb: 2 }}
      >
        Cambiar Tipo de Comercio
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>
            Seleccionar Tipo de Comercio
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Elige la configuración que mejor se adapte a tu negocio. Esto cambiará las categorías, colores y funcionalidades disponibles.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {Object.entries(businessConfigs).map(([type, config]) => (
              <BusinessCard key={type} type={type} config={config} />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => handleChangeBusiness(selectedType)}
            disabled={selectedType === getCurrentConfig().type}
          >
            Aplicar Configuración
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BusinessSelector; 