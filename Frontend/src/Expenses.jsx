import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from './AuthContext';
import AuthGuard from "./AuthGuard";
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import ErrorMessage from "./ErrorMessage";
import { Helmet } from 'react-helmet';

// Components
import ExpenseHeader from './components/ExpenseHeader';
import ExpenseTotalCard from './components/ExpenseTotalCard';
import ExpenseFilters from './components/ExpenseFilters';
import ExpenseTable from './components/ExpenseTable';

// Service
import ExpenseService from './services/ExpenseService';

const Expenses = () => {

    const [expenses, setExpenses] = useState([]);
    const { userDetails, setUserDetails } = useAuth();
    const [ filterDateStart, setFilterDateStart ] = useState(null);
    const [ filterDateEnd, setFilterDateEnd ] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); 
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [numOfExpenses] = useState(10);
    const paginatedExpenses = expenses.slice().reverse().slice((currentPage - 1) * numOfExpenses, currentPage * numOfExpenses);

    AuthGuard();

    const GetExpenses = useCallback(async () => {
        try {
            const response = await ExpenseService.getAllExpenses(userDetails?.accessToken);
            setExpenses(response.data);
        } catch (error) {
            console.error('Error Fetching Expenses: ', error);
        } finally {
            setLoading(false);
        }
    }, [userDetails]);

    const GetFilteredExpenses = useCallback(async () => {
        try {
            const response = await ExpenseService.getFilteredExpenses(
                userDetails?.accessToken, 
                filterDateStart, 
                filterDateEnd
            );
            setExpenses(response.data);
        } catch (error) {
            console.error('Error Fetching Expenses: ', error);
        } finally {
            setLoading(false);
        }
    }, [filterDateStart, filterDateEnd, userDetails]);

    const handleDelete = async (expenseId, expenseBuyerId) => {
        if (expenseBuyerId === userDetails?.userId) {
            setLoading(true);
            try {
                await ExpenseService.deleteExpense(userDetails?.accessToken, expenseId);
                GetExpenses();
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Redirect to the login page if unauthorized and revoke tokens
                    localStorage.removeItem('userDetails');
                    setUserDetails(null);
                    navigate('/Login');
                } else {
                    console.log("Error Deleting Expense: ", error);
                }
            } finally {
                setLoading(false);
            }
        } else {
            setError('You cannot delete other users expenses');
        }
    }

    const handleEdit = (expenseId, expenseBuyerId) => {
        if (expenseBuyerId === userDetails?.userId) {
            navigate(`/Edit/${expenseId}`)
        } else {
            setError('You cannot edit other users expenses');
        }
    }

    const handleApprove = async (expenseId) => {
        setLoading(true);
        try {
            const response = await ExpenseService.approveExpense(userDetails?.accessToken, expenseId);
            if (response.status === 200) {
                GetExpenses(); // Update the page
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Redirect to the login page if unauthorized and revoke tokens
                localStorage.removeItem('userDetails');
                setUserDetails(null);
                navigate('/Login');
            } else if (error.response && error.response.status === 403) {
                setError('You do not have access to this action');
                error.response.data = 'You do not have access to this action';
                console.log("Error Approving Expense: ", error);
            } else {
                setError('An unknown error has occurred');
                console.log("Error Approving Expense: ", error);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleNextPage = () => {
        if(currentPage <= expenses.length / numOfExpenses){
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if(currentPage > 1){
            setCurrentPage(currentPage - 1)
        }
    }

    useEffect(() => {
        const calculatedTotal = expenses
            .filter(expense => expense.allowed)
            .reduce((sum, expense) => sum + expense.price * expense.quantity, 0);
    
        setTotalExpenses(calculatedTotal);
    }, [expenses]);

    useEffect(() => {
        GetExpenses();
    }, [userDetails, GetExpenses]);

    if (loading) {
        return <Loading />
    }

    return (
        <div className="container-fluid py-4">
            <Helmet>
                <title>Expense Manager</title>
            </Helmet>

            <ErrorMessage message={error} onClose={() => setError('')}/>
            
            <ExpenseHeader />

            <ExpenseTotalCard totalExpenses={totalExpenses} />

            <ExpenseFilters 
                filterDateStart={filterDateStart}
                setFilterDateStart={setFilterDateStart}
                filterDateEnd={filterDateEnd}
                setFilterDateEnd={setFilterDateEnd}
                GetFilteredExpenses={GetFilteredExpenses}
                numOfExpenses={numOfExpenses}
                currentPage={currentPage}
                totalExpenses={expenses.length}
                currentExpenses={paginatedExpenses.length}
            />

            <ExpenseTable 
                expenses={expenses}
                paginatedExpenses={paginatedExpenses}
                handleApprove={handleApprove}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                currentPage={currentPage}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                numOfExpenses={numOfExpenses}
                navigate={navigate}
            />
        </div>
    );
}

export default Expenses;