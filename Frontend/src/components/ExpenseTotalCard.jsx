import React from 'react';

const ExpenseTotalCard = ({ totalExpenses }) => {
  return (
    <div className="row mb-4">
      <div className="col-md-6 mx-auto">
        <div className="card shadow-sm border-0">
          <div className="card-body text-center">
            <h2 className="mb-0">Total Spent: <span className="text-primary">${totalExpenses.toFixed(2)}</span></h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTotalCard;
