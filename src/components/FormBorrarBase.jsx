import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Slide } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FormBorrarBase = ({
  open,
  onClose,
  onDelete,
  title = '¿Eliminar registro?',
  description = '¿Estás seguro que deseas eliminar este registro? Esta acción no se puede deshacer.',
  accentColor = '#d32f2f',
}) => {
  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ color: accentColor, fontWeight: 800 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 1, mb: 2 }}>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={onDelete} variant="contained" sx={{ background: accentColor, fontWeight: 700 }}>
          Borrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormBorrarBase; 