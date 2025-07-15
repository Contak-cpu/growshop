import React, { useState } from 'react';
import ListadoBaseForm from './ListadoBaseForm.jsx';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import productsService from '../services/productsService';
import FormEditarBase from './FormEditarBase.jsx';
import FormBorrarBase from './FormBorrarBase.jsx';

const ProductosRegistradosForm = () => {
  const [products, setProducts] = useState(productsService.getAll());
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleEditSave = (data) => {
    productsService.update(data);
    setProducts(productsService.getAll());
    setEditOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteConfirm = () => {
    productsService.remove(selectedProduct.id);
    setProducts(productsService.getAll());
    setDeleteOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <ListadoBaseForm
        title="Productos Registrados"
        icon={<Inventory2OutlinedIcon fontSize="inherit" />}
        items={products}
        emptyMessage="No hay productos registrados."
        cardColor="rgba(60, 80, 50, 0.85)"
        renderItem={product => (
          <Box key={product.id} component="li" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, p: 2, borderRadius: 2, background: 'transparent', color: '#fff' }}>
            <Box>
              <Typography fontWeight={600} color="#fff">{product.name}</Typography>
              <Typography variant="body2" color="#b0b8c1">Stock: {product.stock} | Precio: ${product.price}</Typography>
              <Typography variant="caption" color="#b0b8c1">{product.category}</Typography>
            </Box>
            <Box>
              <IconButton color="primary" onClick={() => handleEdit(product)}><EditIcon /></IconButton>
              <IconButton color="error" onClick={() => handleDelete(product)}><DeleteIcon /></IconButton>
            </Box>
          </Box>
        )}
      />
      <FormEditarBase
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleEditSave}
        initialData={selectedProduct || {}}
        fields={[
          { name: 'name', label: 'Nombre', required: true, autoFocus: true },
          { name: 'price', label: 'Precio', type: 'number', required: true },
          { name: 'description', label: 'Descripción' },
          { name: 'category', label: 'Categoría' },
          { name: 'stock', label: 'Stock', type: 'number', required: true },
        ]}
        title="Editar producto"
        accentColor="#43a047"
      />
      <FormBorrarBase
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDelete={handleDeleteConfirm}
        title="¿Eliminar producto?"
        description={selectedProduct ? `¿Seguro que deseas eliminar el producto "${selectedProduct.name}"? Esta acción no se puede deshacer.` : ''}
        accentColor="#43a047"
      />
    </>
  );
};

export default ProductosRegistradosForm; 