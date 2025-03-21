import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

export const ExpenseService = {

  getAllExpenses: async (token) => {
    const url = `${apiUrl}/Expenses/Family`;
    return await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  getFilteredExpenses: async (token, dateStart, dateEnd) => {
    const url = `${apiUrl}/Expenses/Family?dateTimeStart=${dateStart}&dateTimeEnd=${dateEnd}`;
    return await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  deleteExpense: async (token, expenseId) => {
    const url = `${apiUrl}/Expenses/Delete/${expenseId}`;
    return await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  approveExpense: async (token, expenseId) => {
    const url = `${apiUrl}/Expenses/Authorize/${expenseId}`;
    return await axios.put(url, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

export default ExpenseService;
