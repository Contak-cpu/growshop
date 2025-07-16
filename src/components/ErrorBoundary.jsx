import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes loguear el error a un servicio externo aquí si lo deseas
    console.error('ErrorBoundary atrapó un error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)',
        }}>
          <h1 style={{ color: '#43a047', fontWeight: 900, fontSize: '2.5rem' }}>¡Algo salió mal!</h1>
          <p style={{ color: '#388e3c', fontWeight: 600, fontSize: '1.2rem' }}>
            Ocurrió un error inesperado en la aplicación.<br />
            Por favor, recarga la página o contacta soporte si el problema persiste.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              marginTop: 24,
              background: '#43a047',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 32px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(67,160,71,0.15)'
            }}
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 