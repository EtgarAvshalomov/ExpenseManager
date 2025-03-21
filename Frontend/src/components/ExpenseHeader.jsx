import React from 'react';
import Logo from '../images/Expense Manager.png';

const ExpenseHeader = () => {
  return (
    <div className="row mb-4">
      <div className="col-12 text-center">
        <a href='/'>
          <img src={Logo} alt='Expense Manager Logo' className="img-fluid" style={{maxHeight: '160px'}}/>
        </a>
      </div>
    </div>
  );
};

export default ExpenseHeader;
