import React from 'react';
import ExpenseTableRow from './ExpenseTableRow';
import ExpensePagination from './ExpensePagination';
import EmptyExpenseState from './EmptyExpenseState';

const ExpenseTable = ({ 
  expenses, 
  paginatedExpenses,
  handleApprove, 
  handleEdit, 
  handleDelete,
  currentPage,
  handlePrevPage,
  handleNextPage,
  numOfExpenses,
  navigate
}) => {
  if (expenses?.length === 0) {
    return <EmptyExpenseState navigate={navigate} />;
  }

  return (
    <div className="row">
      <div className="col-md-10 mx-auto">
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3">Title</th>
                    <th className="py-3 text-center">Cost Per Unit</th>
                    <th className="py-3 text-center">Total Cost</th>
                    <th className="py-3 text-center">Quantity</th>
                    <th className="py-3">Buyer</th>
                    <th className="py-3 text-center">Status</th>
                    <th className="py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedExpenses.map((expense) => (
                    <ExpenseTableRow 
                      key={expense.id}
                      expense={expense}
                      handleApprove={handleApprove}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <ExpensePagination 
            currentPage={currentPage}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            expenses={expenses}
            numOfExpenses={numOfExpenses}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseTable;
