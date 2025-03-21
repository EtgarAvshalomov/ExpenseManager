/**
 * Constants related to expenses in the application
 */
export const EXPENSE_STATUS = {
  APPROVED: 'Approved',
  PENDING: 'Pending'
};

export const EXPENSE_ACTIONS = {
  APPROVE: 'approve',
  EDIT: 'edit',
  DELETE: 'delete',
  VIEW: 'view'
};

export const EXPENSE_PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_CURRENT_PAGE: 1
};

export default {
  EXPENSE_STATUS,
  EXPENSE_ACTIONS,
  EXPENSE_PAGINATION
};
