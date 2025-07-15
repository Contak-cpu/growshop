import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Slide } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FormEditarBase = ({
  open,
  onClose,
  onSave,
  initialData = {},
  fields = [],
  title = 'Editar',
  accentColor = '#43a047',
}) => {
  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initialData);
    setErrors({});
  }, [initialData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach(f => {
      if (f.required && !form[f.name]) newErrors[f.name] = 'Requerido';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ color: accentColor, fontWeight: 800 }}>{title}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {fields.map(f => (
            <TextField
              key={f.name}
              name={f.name}
              label={f.label}
              type={f.type || 'text'}
              value={form[f.name] || ''}
              onChange={handleChange}
              required={f.required}
              error={!!errors[f.name]}
              helperText={errors[f.name]}
              fullWidth
              autoFocus={f.autoFocus}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" sx={{ background: accentColor, fontWeight: 700 }}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormEditarBase; 