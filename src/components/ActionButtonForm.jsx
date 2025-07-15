import React from 'react';

/**
 * Componente base reutilizable para formularios de acción.
 * Props:
 * - title: string (texto del botón)
 * - onSubmit: función a ejecutar al enviar el form
 * - children: campos del formulario
 * - style: estilos adicionales opcionales
 */
const ActionButtonForm = ({ title, onSubmit, children, style = {} }) => {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit && onSubmit(e);
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        background: '#fff',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        maxWidth: 400,
        margin: '0 auto',
        ...style,
      }}
    >
      {children}
      <button
        type="submit"
        style={{
          background: '#1a1a1a',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '0.75rem 1.5rem',
          fontWeight: 600,
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {title}
      </button>
    </form>
  );
};

export default ActionButtonForm; 