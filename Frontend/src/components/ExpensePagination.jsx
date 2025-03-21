import React from 'react';

const ExpensePagination = ({ 
  currentPage, 
  handlePrevPage, 
  handleNextPage,
  expenses,
  numOfExpenses
}) => {
  return (
    <div className="card-footer bg-white border-top-0 pb-3">
      <nav aria-label="Expense pagination">
        <ul className="pagination justify-content-center mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePrevPage()} aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          <li className="page-item active">
            <span className="page-link">{currentPage}</span>
          </li>
          <li className={`page-item ${currentPage >= expenses.length / numOfExpenses ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handleNextPage()} aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ExpensePagination;
