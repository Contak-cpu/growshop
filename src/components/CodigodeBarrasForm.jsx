import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Slide } from '@mui/material';
import { QrReader } from 'react-qr-reader';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Utilidad para detectar si es móvil
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

const CodigodeBarrasForm = ({
  open,
  onClose,
  onDetected,
  title = 'Escanear código de barras',
  accentColor = '#43a047',
}) => {
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState(null);

  // Elegir cámara según dispositivo
  const facingMode = isMobile() ? 'environment' : 'user';

  const handleScan = (result) => {
    if (result && result !== lastResult) {
      setLastResult(result);
      onDetected(result);
    }
  };

  const handleError = (err) => {
    setError('No se pudo acceder a la cámara o hubo un error.');
  };

  const handleClose = () => {
    setLastResult(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ color: accentColor, fontWeight: 800 }}>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 1 }}>
          <Box sx={{ width: '100%', maxWidth: 320, borderRadius: 2, overflow: 'hidden', boxShadow: 2, border: `2px solid ${accentColor}` }}>
            <QrReader
              onScan={handleScan}
              onError={handleError}
              style={{ width: '100%' }}
              facingMode={facingMode}
              showViewFinder={true}
            />
          </Box>
          {lastResult && (
            <Typography color="success.main" fontWeight={700} sx={{ mt: 1 }}>
              Código detectado: {lastResult}
            </Typography>
          )}
          {error && (
            <Typography color="error.main" fontWeight={700} sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CodigodeBarrasForm; 