import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Typography, useTheme, useMediaQuery, Paper, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import salesService from '../services/salesService';
import { Sale } from '../types';

const SalesHistory = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setSales(salesService.getAll());
  }, []);

  const handleDelete = (id: string) => {
    salesService.remove(id);
    setSales(salesService.getAll());
  };

  const exportToCSV = () => {
    const headers = ['Descripción', 'Monto', 'Método de pago', 'Fecha/Hora'];
    const rowsData = sales.map(sale => [
      '"' + (sale.notes || '').replace(/"/g, '""') + '"',
      sale.totalAmount,
      sale.paymentMethod,
      new Date(sale.createdAt).toLocaleString()
    ]);
    const csvContent = [
      headers.join(','),
      ...rowsData.map(row => row.join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'historial_ventas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const columns: GridColDef[] = [
    { field: 'notes', headerName: 'Descripción', flex: 2, minWidth: 120 },
    { field: 'totalAmount', headerName: 'Monto', flex: 1, minWidth: 80, valueFormatter: ({ value }) => `$${value}` },
    { field: 'paymentMethod', headerName: 'Método de pago', flex: 1, minWidth: 90 },
    { 
      field: 'createdAt', 
      headerName: 'Fecha/Hora', 
      flex: 1, 
      minWidth: 120, 
      valueFormatter: ({ value }) => {
        try {
          const date = new Date(value);
          return date.toLocaleString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          });
        } catch {
          return 'Fecha inválida';
        }
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => handleDelete(params.id as string)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" fontWeight={700} color="primary.main">Historial de ventas</Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DownloadIcon />}
          onClick={exportToCSV}
          disabled={sales.length === 0}
        >
          Exportar CSV
        </Button>
      </Box>
      <Paper elevation={2} sx={{ borderRadius: 3, p: isMobile ? 1 : 2, background: 'white', boxShadow: 2 }}>
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <DataGrid
            rows={sales.map(s => ({ ...s, id: s.id }))}
            columns={columns}
            pagination
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              borderRadius: 3,
              fontSize: isMobile ? '0.9rem' : '1rem',
              '& .MuiDataGrid-columnHeaders': {
                background: theme.palette.primary.main,
                color: 'white',
                fontWeight: 700,
                fontSize: isMobile ? '1rem' : '1.1rem',
              },
              '& .MuiDataGrid-row': {
                background: '#F4F6F8',
                borderRadius: 2,
                mb: 1,
              },
              '& .MuiDataGrid-cell': {
                py: isMobile ? 1 : 2,
              },
              '& .MuiDataGrid-footerContainer': {
                background: 'transparent',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default SalesHistory; 