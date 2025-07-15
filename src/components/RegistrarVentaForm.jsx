import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, IconButton, Typography, Box, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import salesService from '../services/salesService';
import productsService from '../services/productsService';
import RegistroBaseForm from './RegistroBaseForm.jsx';
import CodigodeBarrasForm from './CodigodeBarrasForm.jsx';

const paymentMethods = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'otro', label: 'Otro' },
];

const LOCAL_STORAGE_KEY = 'growshop_transfer_accounts';

const RegistrarVentaForm = ({ onSaleSaved, editingSale }) => {
  const [description, setDescription] = useState(editingSale ? editingSale.notes : '');
  const [paymentMethod, setPaymentMethod] = useState(editingSale ? editingSale.paymentMethod : 'efectivo');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState(editingSale ? editingSale.items.map(item => ({ productId: item.productId, quantity: item.quantity })) : []);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [barcodeError, setBarcodeError] = useState('');
  // Cuentas para transferencias
  const [accounts, setAccounts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [selectedAccount, setSelectedAccount] = useState('');
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', bank: '', alias: '', cbu: '' });

  useEffect(() => {
    setProducts(productsService.getAll());
  }, []);

  useEffect(() => {
    if (editingSale) {
      setDescription(editingSale.notes);
      setPaymentMethod(editingSale.paymentMethod);
      setSelectedItems(editingSale.items.map(item => ({ productId: item.productId, quantity: item.quantity })));
      setSelectedAccount(editingSale.accountId || '');
    }
  }, [editingSale]);

  // Guardar cuentas en localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

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
    if (paymentMethod === 'transferencia' && !selectedAccount) {
      setError('Debes seleccionar una cuenta de destino para la transferencia.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
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
    const newSale = {
      id: editingSale ? editingSale.id : Date.now().toString(),
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
      createdAt: editingSale ? editingSale.createdAt : new Date(),
      accountId: paymentMethod === 'transferencia' ? selectedAccount : undefined,
    };
    if (editingSale) {
      salesService.update(newSale);
    } else {
      salesService.add(newSale);
    }
    setSuccess('Venta guardada');
    setDescription('');
    setPaymentMethod('efectivo');
    setSelectedItems([]);
    setSelectedAccount('');
    if (onSaleSaved) onSaleSaved();
    setTimeout(() => setSuccess(''), 2000);
  };

  // Escaneo de código de barras
  const handleBarcodeDetected = (code) => {
    setBarcodeError('');
    const product = products.find(p => p.barcode && p.barcode === code);
    if (product) {
      // Si ya está en la lista, suma cantidad
      const idx = selectedItems.findIndex(item => item.productId === product.id);
      if (idx !== -1) {
        setSelectedItems(items => items.map((item, i) => i === idx ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        setSelectedItems(items => [...items, { productId: product.id, quantity: 1 }]);
      }
    } else {
      setBarcodeError('Producto no encontrado para el código escaneado.');
    }
  };

  // Agregar nueva cuenta
  const handleAddAccount = () => {
    if (!newAccount.name.trim() || !newAccount.bank.trim() || (!newAccount.alias.trim() && !newAccount.cbu.trim())) return;
    const id = Date.now().toString();
    setAccounts(accs => [...accs, { ...newAccount, id }]);
    setSelectedAccount(id);
    setNewAccount({ name: '', bank: '', alias: '', cbu: '' });
    setAddAccountOpen(false);
  };

  return (
    <>
      <RegistroBaseForm
        title={editingSale ? 'Editar venta' : 'Registrar venta'}
        icon={<ShoppingCartCheckoutOutlinedIcon fontSize="inherit" />}
        onSubmit={handleSubmit}
        success={success}
        error={error}
        buttonText={editingSale ? 'Guardar cambios' : 'Registrar venta'}
      >
        <Button
          variant="outlined"
          color="primary"
          startIcon={<QrCodeScannerIcon />}
          onClick={() => setScannerOpen(true)}
          sx={{ mb: 2 }}
        >
          Escanear código de barras
        </Button>
        {barcodeError && (
          <Typography color="error" sx={{ mb: 2 }}>{barcodeError}</Typography>
        )}
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
        {/* Selector de cuenta para transferencia */}
        {paymentMethod === 'transferencia' && (
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              label="Cuenta de destino"
              value={selectedAccount}
              onChange={e => setSelectedAccount(e.target.value)}
              fullWidth
              required
              sx={{ mb: 1 }}
            >
              {accounts.map(acc => (
                <MenuItem key={acc.id} value={acc.id}>
                  {acc.name ? `${acc.name} - ` : ''}{acc.bank} {acc.alias ? `- Alias: ${acc.alias}` : ''} {acc.cbu ? `- CBU: ${acc.cbu}` : ''}
                </MenuItem>
              ))}
              <MenuItem value="" disabled>────────────</MenuItem>
              <MenuItem value="add_new">+ Agregar nueva cuenta</MenuItem>
            </TextField>
            {selectedAccount === 'add_new' && (
              <Button variant="outlined" color="primary" onClick={() => setAddAccountOpen(true)}>
                Agregar nueva cuenta
              </Button>
            )}
          </Box>
        )}
      </RegistroBaseForm>
      {/* Modal para agregar nueva cuenta */}
      <Dialog open={addAccountOpen} onClose={() => setAddAccountOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Agregar nueva cuenta</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre de la cuenta"
            value={newAccount.name}
            onChange={e => setNewAccount({ ...newAccount, name: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Banco"
            value={newAccount.bank}
            onChange={e => setNewAccount({ ...newAccount, bank: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Alias (opcional)"
            value={newAccount.alias}
            onChange={e => setNewAccount({ ...newAccount, alias: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="CBU (opcional)"
            value={newAccount.cbu}
            onChange={e => setNewAccount({ ...newAccount, cbu: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddAccountOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleAddAccount} variant="contained" color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
      <CodigodeBarrasForm
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onDetected={code => {
          handleBarcodeDetected(code);
          setScannerOpen(false);
        }}
        title="Escanear código de barras"
        accentColor="#1976d2"
      />
    </>
  );
};

export default RegistrarVentaForm; 