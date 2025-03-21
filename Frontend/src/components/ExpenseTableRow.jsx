import React from 'react';

const ExpenseTableRow = ({ 
  expense,
  handleApprove,
  handleEdit,
  handleDelete
}) => {
  return (
    <React.Fragment>
      <tr>
        <td className="align-middle">{expense.title}</td>
        <td className="align-middle text-center">${expense.price}</td>
        <td className="align-middle text-center">${(expense.price * expense.quantity).toFixed(2)}</td>
        <td className="align-middle text-center">{expense.quantity}</td>
        <td className="align-middle">{expense.buyerFirstName}</td>
        <td className="align-middle text-center">
          {expense.allowed ? 
            <span className="badge bg-success px-3 py-2">Approved</span> : 
            <span className="badge bg-warning text-dark px-3 py-2">Pending</span>
          }
        </td>
        <td className="align-middle text-end">
          <div className="btn-group" role="group">
            {!expense.allowed && (
              <button 
                className="btn btn-sm btn-success" 
                type="button" 
                onClick={() => handleApprove(expense.id)}
                title="Approve"
              >
                <i className="bi bi-check-lg"></i>
              </button>
            )}
            
            {!expense.allowed && (
              <button 
                className="btn btn-sm btn-primary" 
                type="button" 
                onClick={() => handleEdit(expense.id, expense.buyerId)}
                title="Edit"
              >
                <i className="bi bi-pencil"></i>
              </button>
            )}
            
            <button 
              className="btn btn-sm btn-info text-white" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target={'#'+ expense.id} 
              aria-expanded="false" 
              aria-controls={expense.id}
              title="View Details"
            >
              <i className="bi bi-info-circle"></i>
            </button>
            
            {!expense.allowed && (
              <button 
                className="btn btn-sm btn-danger" 
                type="button" 
                onClick={() => handleDelete(expense.id, expense.buyerId)}
                title="Delete"
              >
                <i className="bi bi-trash"></i>
              </button>
            )}
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan="7" className="p-0 border-0">
          <div className="collapse" id={expense.id}>
            <div className="card card-body m-2 shadow-sm">
              <div className="row">
                <div className="col-md-8">
                  <h6 className="mb-2">Description:</h6>
                  <p className="mb-0">{expense.description ? expense.description : 'No Description'}</p>
                </div>
                <div className="col-md-4 text-md-end">
                  <h6 className="mb-2">Date & Time:</h6>
                  <p className="mb-0">
                    <span className="fw-medium">Date:</span> {expense.eventDateTime.split('T')[0]} <br/>
                    <span className="fw-medium">Time:</span> {expense.eventDateTime.split('T')[1].split('.')[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </React.Fragment>
  );
};

export default ExpenseTableRow;
