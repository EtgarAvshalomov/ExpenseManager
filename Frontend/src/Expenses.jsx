import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from './AuthContext';
import AuthGuard from "./AuthGuard";
import { useNavigate } from 'react-router-dom';
import Logo from './images/Expense Manager.png'
import Loading from './Loading';
import ErrorMessage from "./ErrorMessage";
import { Helmet } from 'react-helmet';

const Expenses = () => {

    const [expenses, setExpenses] = useState([]);
    const { userDetails, setUserDetails } = useAuth();
    const [ filterDateStart, setFilterDateStart ] = useState(null);
    const [ filterDateEnd, setFilterDateEnd ] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Loading state
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [numOfExpenses] = useState(10);
    const paginatedExpenses = expenses.slice().reverse().slice((currentPage - 1) * numOfExpenses, currentPage * numOfExpenses);

    AuthGuard();

    const apiUrl = process.env.REACT_APP_API_URL;

    const getExpensesURL = `${apiUrl}/Expenses/Family`;
    const GetExpenses = async () => {
        try{
            const response = await axios.get(getExpensesURL, {
                headers: {
                    Authorization: `Bearer ${userDetails?.accessToken}`
                }
            });
            setExpenses(response.data);
        } catch (error) {
            console.error('Error Fetching Expenses: ', error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredExpensesURL = `${apiUrl}/Expenses/Family?dateTimeStart=${filterDateStart}&dateTimeEnd=${filterDateEnd}`;
    const GetFilteredExpenses = async () => {
        try{
            const response = await axios.get(getFilteredExpensesURL, {
                headers: {
                    Authorization: `Bearer ${userDetails?.accessToken}`
                }
            });
            setExpenses(response.data);
        } catch (error) {
            console.error('Error Fetching Expenses: ', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (expenseId, expenseBuyerId) => {
        if (expenseBuyerId === userDetails?.userId){
            const deleteExpenseURL = `${apiUrl}/Expenses/Delete/${expenseId}`;
            setLoading(true);
            try {
                await axios.delete(deleteExpenseURL, {
                    headers: {
                        Authorization: `Bearer ${userDetails?.accessToken}`
                    }
                })
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
        if (expenseBuyerId === userDetails?.userId)
        {
            navigate(`/Edit/${expenseId}`)
        } else {
            setError('You cannot edit other users expenses');
        }
    }

    const handleApprove = async (expenseId) => {
        const approveExpenseURL = `${apiUrl}/Expenses/Authorize/${expenseId}`;
        setLoading(true);
        try {
            const response = await axios.put(approveExpenseURL, null, {
                headers: {
                    Authorization: `Bearer ${userDetails?.accessToken}`
                }
            })
            if (response.status === 200){
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
    }, [userDetails]);

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <Helmet>
                <title>Expense Manager</title>
            </Helmet>

            {/* Logo */}

            <ErrorMessage message={error} onClose={() => setError('')}/>
            
            <div className='d-flex align-items-center justify-content-center mb-4 mt-3'>
                <a href='/'>
                    <img src={Logo} alt='Expense Manager Logo'/>
                </a>
            </div>

            {/* Quick actions menu */}

            <div>
                <p className="centered mb-4" style={{fontSize: '24px'}}>Total Spent: ${totalExpenses.toFixed(2)}</p>
                <div className="text-end pb-2" style={{paddingRight: '12.7%'}}>
                    <label htmlFor="dateStart" className="form-label" style={{ marginRight: '15px' }}>Start Date:</label>
                    <input 
                        type="date" 
                        id="dateStart" 
                        name="dateStart" 
                        value={null} 
                        onChange={(e) => setFilterDateStart(e.target.value)}
                        className="form-control" 
                        style={{ maxWidth: '10%', display: 'inline-block', marginRight: '15px' }}
                    />
                    <label htmlFor="dateEnd" className="form-label" style={{ marginRight: '15px' }}>End Date:</label>
                    <input 
                        type="date" 
                        id="dateEnd" 
                        name="dateEnd" 
                        value={null} 
                        onChange={(e) => setFilterDateEnd(e.target.value)}
                        className="form-control" 
                        style={{ maxWidth: '10%', display: 'inline-block', marginRight: '15px' }}
                    />
                    <button 
                        className="btn btn-primary btn-lg" 
                        type="button"
                        onClick={() => GetFilteredExpenses()}
                        style={{ fontSize: '18px', marginRight: '15px'}}
                    >
                        Filter
                    </button>
                    <button 
                        className="btn btn-primary btn-lg" 
                        type="button"
                        onClick={() => navigate('/Add')}
                        style={{ fontSize: '18px'}}
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Expenses */}

            {
                expenses?.length > 0
                    ? (
                        <>
                            <table className="table table-striped table-bordered table-hover mx-auto w-75">
                                <thead className="thead-dark">
                                    <tr className="text-center">
                                        <th className="col-3" scope="col">Title</th>
                                        <th className="col-11" scope="col">Cost Per Unit</th>
                                        <th className="col-11" scope="col">Total Cost</th>
                                        <th className="col-6-25" scope="col">Quantity</th>
                                        <th className="col-11" scope="col">Buyer</th>
                                        <th className="col-11" scope="col">Status</th>
                                        <th className="col-3" scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedExpenses.map((expense) => {
                                        return (
                                            <>
                                                <tr className="text-center">
                                                    <td>{expense.title}</td>
                                                    <td>${expense.price}</td>
                                                    <td>${(expense.price * expense.quantity).toFixed(2)}</td>
                                                    <td>{expense.quantity}</td>
                                                    <td>{expense.buyerFirstName}</td>
                                                    <td>{expense.allowed ? "Approved" : "Unapproved"}</td>
                                                    <td>
                                                        { expense.allowed ? (
                                                            <></>
                                                            ) : (
                                                                <button className="btn btn-success btn-sm width-20 me-2" type="button" onClick={() => handleApprove(expense.id)}>Approve</button>
                                                            )
                                                        }
                                                        {expense.allowed ? (
                                                            <>
                                                            <button className="btn btn-primary btn-sm" style={{width: '322px'}} type="button" data-bs-toggle="collapse" data-bs-target={'#'+ expense.id} aria-expanded="false" aria-controls={expense.id}>
                                                                Details
                                                                <i className = "bi bi-chevron-down ms-2"></i>
                                                            </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                            <button className="btn btn-primary btn-sm me-2" style={{width: '57px' }} type="button" onClick={() => handleEdit(expense.id, expense.buyerId)}>
                                                                Edit
                                                            </button>
                                                            <button className="btn btn-primary btn-sm me-2" type="button" data-bs-toggle="collapse" data-bs-target={'#'+ expense.id} aria-expanded="false" aria-controls={expense.id}>
                                                                Details
                                                                <i className = "bi bi-chevron-down ms-2"></i>
                                                            </button>
                                                            </>
                                                        )}
                                                        {expense.allowed ? (
                                                            <></>
                                                        ) : (
                                                            <button className="btn btn-danger btn-sm" type="button" onClick={() => handleDelete(expense.id, expense.buyerId)}>
                                                                Delete
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="6">
                                                        <div className="collapse" id={expense.id}>
                                                            <div 
                                                            className="card card-body description-box d-flex justify-content-center align-items-center" 
                                                            style={{
                                                                display: 'inline-block', 
                                                                whiteSpace: 'normal', 
                                                                wordBreak: 'break-word', 
                                                                height: '83px', 
                                                                width: '100%'}}
                                                            >
                                                                {expense.description ? `${expense.description}` : 'No Description'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="collapse" id={expense.id}>
                                                            <p className="card card-body centered">{'Date: '+expense.eventDateTime.split('T')[0]} <br/> {'Time: '+expense.eventDateTime.split('T')[1].split('.')[0]}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </>
                                        )
                                    })}
                                </tbody>
                            </table>

                            { 
                                currentPage === 1 ? (
                                    
                                    currentPage < expenses.length / numOfExpenses ? (
                                        <div className="text-center mt-3 mb-3" style={{marginLeft: "42px"}}>
                                            <span className="m-2" style={{fontWeight: "bold"}}>{currentPage}</span>
                                            <button className="btn border bg-light" type="button" onClick={() => handleNextPage()}>{">"}</button>
                                        </div>
                                    ) : (
                                        <div className="text-center mt-3 mb-3" style={{marginLeft: "5px"}}>
                                            <span className="m-2" style={{fontWeight: "bold"}}>{currentPage}</span>
                                        </div>
                                    )

                                ) : currentPage < expenses.length / numOfExpenses ? (
                                    <div className="text-center mt-3 mb-3" style={{marginLeft: "5px"}}>
                                        
                                        <button className="btn border bg-light" type="button" onClick={() => handlePrevPage()}>{"<"}</button>
                                        <span className="m-2" style={{fontWeight: "bold"}}>{currentPage}</span>
                                        <button className="btn border bg-light" type="button" onClick={() => handleNextPage()}>{">"}</button>
                                    </div>
                                ) : (
                                    <div className="text-center mt-3 mb-3" style={{marginRight: "30px"}}>
                                        <button className="btn border bg-light" type="button" onClick={() => handlePrevPage()}>{"<"}</button>
                                        <span className="m-2" style={{fontWeight: "bold"}}>{currentPage}</span>
                                    </div>
                                )
                            }
                            
                        </>
                    ) : (
                        <div className="centered">
                            <p style={{fontSize: '18px', marginTop: '30px'}}>No expenses were found</p>
                        </div>
                    )
            }
        </>
    );
}

export default Expenses;