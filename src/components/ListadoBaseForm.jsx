import React from 'react';
import { Paper, Typography, Box, useTheme, Divider, Fade } from '@mui/material';

const ListadoBaseForm = ({
  title,
  icon,
  items,
  renderItem,
  emptyMessage = 'No hay datos para mostrar.',
  actionsHeader = null,
  cardColor = null, // Nuevo: color personalizado para la tarjeta
}) => {
  const theme = useTheme();
  // Color por defecto si no se pasa cardColor
  const defaultCardColor = 'rgba(50, 60, 40, 0.85)'; // verde oscuro translúcido
  const hoverCardColor = cardColor
    ? cardColor.replace('0.85', '1')
    : 'rgba(67, 160, 71, 0.18)';

  return (
    <Paper elevation={4} sx={{ p: 0, borderRadius: 5, background: theme.palette.background.paper, boxShadow: 6, mb: 5 }}>
      {/* Encabezado */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 4, py: 2.5,
        background: 'linear-gradient(90deg, #23272b 60%, #23272b 100%)',
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        boxShadow: '0 2px 8px 0 rgba(67,160,71,0.10)',
        borderBottom: `1.5px solid ${theme.palette.success.main}22`,
        minHeight: 64
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {icon && <Box sx={{ fontSize: 36, color: theme.palette.success.main }}>{icon}</Box>}
          <Typography variant="h5" fontWeight={900} color="success.main" sx={{ letterSpacing: '-1px' }}>{title}</Typography>
        </Box>
        <Box>{actionsHeader}</Box>
      </Box>
      {/* Listado */}
      <Box sx={{ p: { xs: 2, sm: 4 }, pt: 3 }}>
        {items.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6, fontSize: '1.1rem' }}>{emptyMessage}</Typography>
        ) : (
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((item, idx) => (
              <Fade in timeout={400} key={item.id || idx}>
                <Box
                  component="li"
                  sx={{
                    background: cardColor || defaultCardColor,
                    borderRadius: 3,
                    boxShadow: '0 2px 8px 0 rgba(67,160,71,0.08)',
                    border: `1.5px solid ${theme.palette.success.main}11`,
                    transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 16px 0 rgba(67,160,71,0.18)',
                      border: `1.5px solid ${theme.palette.success.main}55`,
                      background: hoverCardColor,
                    },
                    p: 2.5,
                    mb: idx !== items.length - 1 ? 1 : 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {renderItem(item)}
                </Box>
              </Fade>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ListadoBaseForm; 