import React from 'react';

const ErrorMessage = ({ message, onClose }) => {

  if (!message) return null;

  return (
    <div style={styles.container}>
      <span>{message}</span>
      <button onClick={onClose} style={styles.closeButton}>✖</button>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: '80px',
    left: '10px',
    backgroundColor: '#ffdddd',
    color: '#a94442',
    padding: '10px 15px',
    borderRadius: '5px',
    border: '1px solid #a94442',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1000,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#a94442',
    fontSize: '16px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
};

export default ErrorMessage;