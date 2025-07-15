import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductSectionForm from './ProductSectionForm.jsx';
import productsService from '../services/productsService';

const ProductosForms = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    setProducts(productsService.getAll());
  }, []);

  const refreshProducts = () => {
    setProducts(productsService.getAll());
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = (id) => {
    productsService.remove(id);
    refreshProducts();
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} color="primary.main" mb={3}>
        Gestión de Productos
      </Typography>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Registrar Producto
        </Typography>
        <ProductSectionForm
          key={editingProduct ? editingProduct.id : 'new'}
          onProductSaved={refreshProducts}
          editingProduct={editingProduct}
        />
      </Paper>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Productos Registrados
        </Typography>
        {products.length === 0 ? (
          <Typography color="text.secondary">No hay productos registrados.</Typography>
        ) : (
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {products.map(product => (
              <Box key={product.id} component="li" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, p: 2, borderRadius: 2, background: '#F4F6F8' }}>
                <Box>
                  <Typography fontWeight={600}>{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Stock: {product.stock} | Precio: ${product.price}</Typography>
                  <Typography variant="caption" color="text.secondary">{product.category}</Typography>
                </Box>
                <Box>
                  <IconButton color="primary" onClick={() => handleEdit(product)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(product.id)}><DeleteIcon /></IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ProductosForms; 