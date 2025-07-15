import React, { useState } from 'react';
import ListadoBaseForm from './ListadoBaseForm.jsx';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import salesService from '../services/salesService';
import FormEditarBase from './FormEditarBase.jsx';
import FormBorrarBase from './FormBorrarBase.jsx';

const VentasRegistradasForm = () => {
  const [sales, setSales] = useState(salesService.getAll());
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const handleEdit = (sale) => {
    setSelectedSale(sale);
    setEditOpen(true);
  };

  const handleDelete = (sale) => {
    setSelectedSale(sale);
    setDeleteOpen(true);
  };

  const handleEditSave = (data) => {
    salesService.update(data);
    setSales(salesService.getAll());
    setEditOpen(false);
    setSelectedSale(null);
  };

  const handleDeleteConfirm = () => {
    salesService.remove(selectedSale.id);
    setSales(salesService.getAll());
    setDeleteOpen(false);
    setSelectedSale(null);
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

  return (
    <>
      <ListadoBaseForm
        title="Ventas registradas"
        icon={<ShoppingCartCheckoutOutlinedIcon fontSize="inherit" />}
        items={sales}
        emptyMessage="No hay ventas registradas."
        actionsHeader={
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={exportToCSV}
            disabled={sales.length === 0}
          >
            Exportar CSV
          </Button>
        }
        cardColor="rgba(40, 60, 80, 0.85)"
        renderItem={sale => (
          <Box key={sale.id} component="li" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, p: 2, borderRadius: 2, background: 'transparent', color: '#fff' }}>
            <Box>
              <Typography fontWeight={600} color="#fff">{sale.notes}</Typography>
              <Typography variant="body2" color="#b0b8c1">Monto: ${sale.totalAmount} | Método: {sale.paymentMethod}</Typography>
              <Typography variant="caption" color="#b0b8c1">{new Date(sale.createdAt).toLocaleString('es-AR')}</Typography>
            </Box>
            <Box>
              <IconButton color="primary" onClick={() => handleEdit(sale)}><EditIcon /></IconButton>
              <IconButton color="error" onClick={() => handleDelete(sale)}><DeleteIcon /></IconButton>
            </Box>
          </Box>
        )}
      />
      <FormEditarBase
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleEditSave}
        initialData={selectedSale || {}}
        fields={[
          { name: 'notes', label: 'Descripción', required: true, autoFocus: true },
          { name: 'totalAmount', label: 'Monto', type: 'number', required: true },
          { name: 'paymentMethod', label: 'Método de pago' },
        ]}
        title="Editar venta"
        accentColor="#1976d2"
      />
      <FormBorrarBase
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDelete={handleDeleteConfirm}
        title="¿Eliminar venta?"
        description={selectedSale ? `¿Seguro que deseas eliminar la venta "${selectedSale.notes}"? Esta acción no se puede deshacer.` : ''}
        accentColor="#1976d2"
      />
    </>
  );
};

export default VentasRegistradasForm; 