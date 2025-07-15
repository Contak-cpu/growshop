import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Snackbar, Alert, InputAdornment, List, ListItem, ListItemText, IconButton, useTheme, useMediaQuery, Paper, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import salesService from '../services/salesService';
import productsService from '../services/productsService';
import { PaymentMethod, Sale, Product } from '../types';

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'otro', label: 'Otro' },
];

const SaleForm = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [sales, setSales] = useState<Sale[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ productId: string; quantity: number }[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setSales(salesService.getAll());
    setProducts(productsService.getAll());
  }, []);

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { productId: '', quantity: 1 }]);
  };

  const handleItemChange = (idx: number, field: 'productId' | 'quantity', value: string | number) => {
    setSelectedItems(items => items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleRemoveItem = (idx: number) => {
    setSelectedItems(items => items.filter((_, i) => i !== idx));
  };

  const getProductStock = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.stock : 0;
  };

  const getProductPrice = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.price : 0;
  };

  const totalAmount = selectedItems.reduce((acc, item) => {
    const price = getProductPrice(item.productId);
    return acc + price * (item.quantity || 0);
  }, 0);

  const validate = (): boolean => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    const newSale: Sale = {
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
      createdAt: editingId ? sales.find(s => s.id === editingId)?.createdAt || new Date() : new Date(),
    };
    if (editingId) {
      salesService.update(newSale);
      setEditingId(null);
    } else {
      salesService.add(newSale);
    }
    setSales(salesService.getAll());
    setOpen(true);
    setDescription('');
    setAmount('');
    setPaymentMethod('efectivo');
    setSelectedItems([]);
  };

  const handleDelete = (id: string) => {
    salesService.remove(id);
    setSales(salesService.getAll());
    if (editingId === id) {
      setEditingId(null);
      setDescription('');
      setAmount('');
      setPaymentMethod('efectivo');
    }
  };

  const handleEdit = (sale: Sale) => {
    setEditingId(sale.id);
    setDescription(sale.notes || '');
    setAmount(sale.totalAmount.toString());
    setPaymentMethod(sale.paymentMethod);
  };

  return (
    <Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, background: 'white', p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
          {editingId ? 'Editar venta' : 'Registrar venta'}
        </Typography>
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
          label="Monto"
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
          required
          fullWidth
          type="number"
          inputProps={{ min: 0, step: 0.01 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          error={!!error && error.includes('monto')}
          helperText={error && error.includes('monto') ? error : ''}
        />
        <TextField
          label="Método de pago"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
          select
          fullWidth
          required
        >
          {paymentMethods.map(pm => (
            <MenuItem key={pm.value} value={pm.value}>{pm.label}</MenuItem>
          ))}
        </TextField>
        {error && !error.includes('descripción') && !error.includes('monto') && error && (
          <Alert severity="error">{error}</Alert>
        )}
        <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
          {editingId ? 'Guardar cambios' : 'Guardar venta'}
        </Button>
        {editingId && (
          <Button variant="outlined" color="secondary" sx={{ mt: 1 }} onClick={() => {
            setEditingId(null);
            setDescription('');
            setAmount('');
            setPaymentMethod('efectivo');
          }}>
            Cancelar edición
          </Button>
        )}
        <Snackbar open={open} autoHideDuration={2000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Venta guardada
          </Alert>
        </Snackbar>
      </Box>
      <Box mt={4}>
        <Typography variant="h6" fontWeight={600} mb={1} color="primary.main">Ventas registradas</Typography>
        <Stack spacing={2}>
          {sales.map(sale => (
            <Paper key={sale.id} elevation={2} sx={{ p: isMobile ? 1 : 2, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} color="primary.main">${sale.totalAmount} <span style={{ color: '#223A5E' }}>- {sale.paymentMethod}</span></Typography>
                <Typography variant="body2" color="text.secondary">{sale.notes}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(sale)} size={isMobile ? 'small' : 'medium'}>
                  <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(sale.id)} size={isMobile ? 'small' : 'medium'}>
                  <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
              </Box>
            </Paper>
          ))}
          {sales.length === 0 && <Typography color="text.secondary" sx={{ p: 2 }}>No hay ventas registradas.</Typography>}
        </Stack>
      </Box>
    </Box>
  );
};

export default SaleForm; 