import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Snackbar, Alert, List, ListItem, ListItemText, IconButton, useTheme, useMediaQuery, Paper, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import productsService from '../services/productsService';
import { Product } from '../types';

const categories = [
  'Sustratos',
  'Fertilizantes',
  'Iluminación',
  'Accesorios',
  'Semillas',
  'Otro',
];

const ProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stock, setStock] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setProducts(productsService.getAll());
  }, []);

  const validate = (): boolean => {
    if (!name.trim()) {
      setError('El nombre es obligatorio.');
      return false;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('El precio debe ser un número positivo.');
      return false;
    }
    if (
      products.some(
        p =>
          p.name.trim().toLowerCase() === name.trim().toLowerCase() &&
          p.id !== editingId
      )
    ) {
      setError('Ya existe un producto con ese nombre.');
      return false;
    }
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0 || !Number.isInteger(Number(stock))) {
      setError('El stock debe ser un número entero positivo.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingId) {
      // Editar producto existente
      const updated: Product = {
        id: editingId,
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        category,
        stock: parseInt(stock, 10),
        createdAt: products.find(p => p.id === editingId)?.createdAt || new Date(),
      };
      productsService.update(updated);
      setProducts(productsService.getAll());
      setEditingId(null);
      setOpen(true);
    } else {
      // Nuevo producto
      const newProduct: Product = {
        id: Date.now().toString(),
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        category,
        stock: parseInt(stock, 10),
        createdAt: new Date(),
      };
      productsService.add(newProduct);
      setProducts(productsService.getAll());
      setOpen(true);
    }
    setName('');
    setPrice('');
    setDescription('');
    setCategory('');
    setStock('');
  };

  const handleDelete = (id: string) => {
    productsService.remove(id);
    setProducts(productsService.getAll());
    if (editingId === id) {
      setEditingId(null);
      setName('');
      setPrice('');
      setDescription('');
      setCategory('');
      setStock('');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description || '');
    setCategory(product.category || '');
    setStock(product.stock.toString());
  };

  return (
    <Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, background: 'white', p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
          {editingId ? 'Editar producto' : 'Registrar producto'}
        </Typography>
        <TextField
          label="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          fullWidth
          error={!!error && error.includes('nombre')}
          helperText={error && error.includes('nombre') ? error : ''}
        />
        <TextField
          label="Precio"
          value={price}
          onChange={e => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
          required
          fullWidth
          type="number"
          inputProps={{ min: 0, step: 0.01 }}
          error={!!error && error.includes('precio')}
          helperText={error && error.includes('precio') ? error : ''}
        />
        <TextField
          label="Descripción"
          value={description}
          onChange={e => setDescription(e.target.value)}
          multiline
          rows={2}
          fullWidth
        />
        <TextField
          label="Categoría"
          value={category}
          onChange={e => setCategory(e.target.value)}
          select
          fullWidth
        >
          {categories.map(cat => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Stock"
          value={stock}
          onChange={e => setStock(e.target.value.replace(/[^0-9]/g, ''))}
          required
          fullWidth
          type="number"
          inputProps={{ min: 0, step: 1 }}
          error={!!error && error.includes('stock')}
          helperText={error && error.includes('stock') ? error : ''}
        />
        {error && error.includes('existe') && (
          <Alert severity="error">{error}</Alert>
        )}
        <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
          {editingId ? 'Guardar cambios' : 'Guardar producto'}
        </Button>
        {editingId && (
          <Button variant="outlined" color="secondary" sx={{ mt: 1 }} onClick={() => {
            setEditingId(null);
            setName('');
            setPrice('');
            setDescription('');
            setCategory('');
            setStock('');
          }}>
            Cancelar edición
          </Button>
        )}
        <Snackbar open={open} autoHideDuration={2000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Producto guardado
          </Alert>
        </Snackbar>
      </Box>
      <Box mt={4}>
        <Typography variant="h6" fontWeight={600} mb={1} color="primary.main">Productos registrados</Typography>
        <Stack spacing={2}>
          {products.map(product => (
            <Paper key={product.id} elevation={2} sx={{ p: isMobile ? 1 : 2, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} color="primary.main">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.category ? `${product.category} | ` : ''}{product.description}
                  {` | Stock: ${product.stock}`}
                </Typography>
                <Typography variant="body1" fontWeight={600} color="secondary.main">${product.price}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(product)} size={isMobile ? 'small' : 'medium'}>
                  <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(product.id)} size={isMobile ? 'small' : 'medium'}>
                  <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
              </Box>
            </Paper>
          ))}
          {products.length === 0 && <Typography color="text.secondary" sx={{ p: 2 }}>No hay productos registrados.</Typography>}
        </Stack>
      </Box>
    </Box>
  );
};

export default ProductForm; 