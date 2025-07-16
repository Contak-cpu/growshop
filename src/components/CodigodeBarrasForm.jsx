import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Slide } from '@mui/material';
import { useZxing } from 'react-zxing';

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

  // Referencia para el video
  const videoRef = React.useRef(null);
  
  // Hook de react-zxing configurado solo para EAN_13
  useZxing({
    ref: videoRef,
    onDecodeResult: (result) => {
      if (result && result.getText() !== lastResult) {
        setLastResult(result.getText());
        onDetected(result.getText());
      }
    },
    onDecodeError: () => {},
    onError: () => setError('No se pudo acceder a la cámara o hubo un error.'),
    hints: new Map([
      [
        2, // BarcodeFormat.EAN_13
        true
      ]
    ]),
    constraints: { facingMode },
  });

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
          <Box sx={{ width: '100%', maxWidth: 340, borderRadius: 3, overflow: 'hidden', boxShadow: 4, border: `3px solid ${accentColor}`, background: 'linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <video ref={videoRef} style={{ width: '100%', borderRadius: '12px', border: `2px dashed ${accentColor}`, background: '#f1f8e9' }} />
            <Typography variant="body2" align="center" sx={{ color: accentColor, fontWeight: 600, mt: 2 }}>
              Coloca el código de barras dentro del recuadro
            </Typography>
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