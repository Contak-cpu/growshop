import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, MenuItem, Alert, Snackbar, Box } from '@mui/material';
import productsService from '../services/productsService';
import { Product } from '../types';
import ActionButtonForm from './ActionButtonForm.jsx';

const categories = [
  'Sustratos',
  'Fertilizantes',
  'Iluminación',
  'Accesorios',
  'Semillas',
  'Otro',
];

const ProductSectionForm = ({ onProductSaved }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setProducts(productsService.getAll());
  }, []);

  const validate = () => {
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

  const handleSubmit = () => {
    if (!validate()) return;
    if (editingId) {
      // Editar producto existente
      const updated = {
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
      const newProduct = {
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
    if (onProductSaved) onProductSaved();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
        {editingId ? 'Editar producto' : 'Registrar producto'}
      </Typography>
      <ActionButtonForm title={editingId ? 'Guardar cambios' : 'Registrar producto'} onSubmit={handleSubmit}>
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
        <Snackbar open={open} autoHideDuration={2000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Producto guardado
          </Alert>
        </Snackbar>
      </ActionButtonForm>
    </Box>
  );
};

export default ProductSectionForm; 