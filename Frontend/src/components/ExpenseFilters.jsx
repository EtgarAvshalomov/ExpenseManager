import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExpenseFilters = ({ 
  filterDateStart, 
  setFilterDateStart, 
  filterDateEnd, 
  setFilterDateEnd, 
  GetFilteredExpenses,
  numOfExpenses,
  currentPage,
  totalExpenses,
  currentExpenses
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="row mb-4">
      <div className="col-md-10 mx-auto">
        <div className="card shadow-sm border-0">
          <div className="card-body p-3">
            <div className="row g-3 align-items-center">
              <div className="col-md-3">
                <p className="fs-5 mb-0">
                  <i className="bi bi-receipt me-2"></i>
                  <span className="fw-light">Expenses:</span> <strong>{numOfExpenses * (currentPage-1) + currentExpenses} / {totalExpenses}</strong>
                </p>
              </div>
              <div className="col-md-3">
                <div className="form-floating">
                  <input 
                    type="date" 
                    id="dateStart" 
                    name="dateStart"
                    value={filterDateStart || ''}
                    onChange={(e) => setFilterDateStart(e.target.value)}
                    className="form-control" 
                  />
                  <label htmlFor="dateStart">Start Date</label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-floating">
                  <input 
                    type="date" 
                    id="dateEnd" 
                    name="dateEnd" 
                    value={filterDateEnd || ''}
                    onChange={(e) => setFilterDateEnd(e.target.value)}
                    className="form-control" 
                  />
                  <label htmlFor="dateEnd">End Date</label>
                </div>
              </div>
              <div className="col-md-3 d-flex gap-2">
                <button 
                  className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center"
                  type="button"
                  onClick={() => GetFilteredExpenses()}
                >
                  <i className="bi bi-funnel me-2"></i> Filter
                </button>
                <button 
                  className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center"
                  type="button"
                  onClick={() => navigate('/Add')}
                >
                  <i className="bi bi-plus-lg me-2"></i> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilters;
