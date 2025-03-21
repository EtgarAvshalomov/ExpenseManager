import React from 'react';

const EmptyExpenseState = ({ navigate }) => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body text-center py-5">
        <i className="bi bi-receipt-cutoff text-muted" style={{fontSize: '3rem'}}></i>
        <h4 className="mt-3 text-muted">No expenses were found</h4>
        <p className="text-muted">Try adjusting your filter or add a new expense</p>
        <button 
          className="btn btn-primary mt-2"
          type="button"
          onClick={() => navigate('/Add')}
        >
          <i className="bi bi-plus-lg me-2"></i> Add Expense
        </button>
      </div>
    </div>
  );
};

export default EmptyExpenseState;
