import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, MenuItem, IconButton, Alert, Snackbar, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import salesService from '../services/salesService';
import productsService from '../services/productsService';
import { PaymentMethod, Sale, Product } from '../types';
import ActionButtonForm from './ActionButtonForm.jsx';

const paymentMethods = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'otro', label: 'Otro' },
];

const SaleSectionForm = ({ onSaleSaved }) => {
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setProducts(productsService.getAll());
  }, []);

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { productId: '', quantity: 1 }]);
  };

  const handleItemChange = (idx, field, value) => {
    setSelectedItems(items => items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleRemoveItem = idx => {
    setSelectedItems(items => items.filter((_, i) => i !== idx));
  };

  const getProductStock = productId => {
    const product = products.find(p => p.id === productId);
    return product ? product.stock : 0;
  };

  const getProductPrice = productId => {
    const product = products.find(p => p.id === productId);
    return product ? product.price : 0;
  };

  const totalAmount = selectedItems.reduce((acc, item) => {
    const price = getProductPrice(item.productId);
    return acc + price * (item.quantity || 0);
  }, 0);

  const validate = () => {
    if (selectedItems.length === 0 || selectedItems.some(item => !item.productId || !item.quantity)) {
      setError('Debes seleccionar al menos un producto y cantidad.');
      return false;
    }
    for (const item of selectedItems) {
      const stock = getProductStock(item.productId);
      if (item.quantity > stock) {
        setError('No hay suficiente stock para uno de los productos.');
        return false;
      }
      if (item.quantity <= 0) {
        setError('La cantidad debe ser mayor a 0.');
        return false;
      }
    }
    if (!description.trim()) {
      setError('La descripción es obligatoria.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // Actualizar stock de productos
    selectedItems.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        productsService.update({ ...product, stock: product.stock - item.quantity });
      }
    });
    setProducts(productsService.getAll());
    // Guardar venta
    const newSale = {
      id: editingId || Date.now().toString(),
      items: selectedItems.map(item => ({
        productId: item.productId,
        productName: products.find(p => p.id === item.productId)?.name || '',
        quantity: item.quantity,
        unitPrice: getProductPrice(item.productId),
        totalPrice: getProductPrice(item.productId) * item.quantity,
      })),
      totalAmount,
      paymentMethod,
      notes: description.trim(),
      createdAt: new Date(),
    };
    if (editingId) {
      salesService.update(newSale);
      setEditingId(null);
    } else {
      salesService.add(newSale);
    }
    setOpen(true);
    setDescription('');
    setPaymentMethod('efectivo');
    setSelectedItems([]);
    if (onSaleSaved) onSaleSaved();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
        {editingId ? 'Editar venta' : 'Registrar venta'}
      </Typography>
      <ActionButtonForm title={editingId ? 'Guardar cambios' : 'Registrar venta'} onSubmit={handleSubmit}>
        {selectedItems.map((item, idx) => (
          <Box key={idx} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              select
              label="Producto"
              value={item.productId}
              onChange={e => handleItemChange(idx, 'productId', e.target.value)}
              sx={{ minWidth: 120, flex: 2 }}
              required
            >
              {products.map(product => (
                <MenuItem key={product.id} value={product.id} disabled={product.stock === 0}>
                  {product.name} (Stock: {product.stock})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Cantidad"
              type="number"
              value={item.quantity}
              onChange={e => handleItemChange(idx, 'quantity', Math.max(1, Number(e.target.value)))}
              inputProps={{ min: 1, max: getProductStock(item.productId) }}
              sx={{ width: 90 }}
              required
            />
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
              ${getProductPrice(item.productId) * (item.quantity || 0)}
            </Typography>
            <IconButton onClick={() => handleRemoveItem(idx)} color="error" size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button variant="outlined" color="secondary" onClick={handleAddItem} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          Agregar producto
        </Button>
        <Typography variant="h6" color="primary.main" sx={{ mt: 2 }}>
          Total: ${totalAmount}
        </Typography>
        <TextField
          label="Descripción de la venta"
          value={description}
          onChange={e => setDescription(e.target.value)}
          multiline
          rows={2}
          fullWidth
          required
          error={!!error && error.includes('descripción')}
          helperText={error && error.includes('descripción') ? error : ''}
        />
        <TextField
          select
          label="Método de pago"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
          fullWidth
        >
          {paymentMethods.map(pm => (
            <MenuItem key={pm.value} value={pm.value}>{pm.label}</MenuItem>
          ))}
        </TextField>
        {error && !error.includes('descripción') && (
          <Alert severity="error">{error}</Alert>
        )}
        <Snackbar open={open} autoHideDuration={2000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Venta guardada
          </Alert>
        </Snackbar>
      </ActionButtonForm>
    </Box>
  );
};

export default SaleSectionForm; 