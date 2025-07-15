import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, InputAdornment, IconButton } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import productsService from '../services/productsService';
import RegistroBaseForm from './RegistroBaseForm.jsx';
import CodigodeBarrasForm from './CodigodeBarrasForm.jsx';

const categories = [
  'Sustratos',
  'Fertilizantes',
  'Iluminación',
  'Accesorios',
  'Semillas',
  'Otro',
];

const RegistrarProductoForm = ({ onProductSaved, editingProduct }) => {
  const [name, setName] = useState(editingProduct ? editingProduct.name : '');
  const [price, setPrice] = useState(editingProduct ? editingProduct.price.toString() : '');
  const [description, setDescription] = useState(editingProduct ? editingProduct.description : '');
  const [category, setCategory] = useState(editingProduct ? editingProduct.category : '');
  const [stock, setStock] = useState(editingProduct ? editingProduct.stock.toString() : '');
  const [barcode, setBarcode] = useState(editingProduct ? editingProduct.barcode || '' : '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [products, setProducts] = useState([]);
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    setProducts(productsService.getAll());
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(editingProduct.price.toString());
      setDescription(editingProduct.description);
      setCategory(editingProduct.category);
      setStock(editingProduct.stock.toString());
      setBarcode(editingProduct.barcode || '');
    }
  }, [editingProduct]);

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
          (!editingProduct || p.id !== editingProduct.id)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingProduct) {
      // Editar producto existente
      const updated = {
        ...editingProduct,
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        category,
        stock: parseInt(stock, 10),
        barcode: barcode.trim(),
      };
      productsService.update(updated);
      setSuccess('Producto guardado');
    } else {
      // Nuevo producto
      const newProduct = {
        id: Date.now().toString(),
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        category,
        stock: parseInt(stock, 10),
        barcode: barcode.trim(),
        createdAt: new Date(),
      };
      productsService.add(newProduct);
      setSuccess('Producto guardado');
    }
    setProducts(productsService.getAll());
    setName('');
    setPrice('');
    setDescription('');
    setCategory('');
    setStock('');
    setBarcode('');
    if (onProductSaved) onProductSaved();
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <>
      <RegistroBaseForm
        title={editingProduct ? 'Editar producto' : 'Registrar producto'}
        icon={<Inventory2OutlinedIcon fontSize="inherit" />}
        onSubmit={handleSubmit}
        success={success}
        error={error}
        buttonText={editingProduct ? 'Guardar cambios' : 'Guardar producto'}
      >
        <TextField
          label="Código de barras"
          value={barcode}
          onChange={e => setBarcode(e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setScannerOpen(true)} edge="end" color="primary">
                  <QrCodeScannerIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
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
      </RegistroBaseForm>
      <CodigodeBarrasForm
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onDetected={code => {
          setBarcode(code);
          setScannerOpen(false);
        }}
        title="Escanear código de barras"
        accentColor="#43a047"
      />
    </>
  );
};

export default RegistrarProductoForm; 