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
    position: 'fixed',    // Fixes it in place even if the user scrolls
    top: '80px',          // Distance from the top of the viewport
    left: '10px',         // Distance from the left of the viewport
    backgroundColor: '#ffdddd',  // Light red background for error look
    color: '#a94442',            // Darker red text color
    padding: '10px 15px',
    borderRadius: '5px',
    border: '1px solid #a94442', // Red border
    display: 'flex',
    alignItems: 'center',
    zIndex: 1000,         // Ensures it appears above other elements
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