import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import Loading from './Loading';
const Header = () => {
    const navigate = useNavigate();
    const { userDetails, setUserDetails } = useAuth();
    const [loading, setLoading] = useState(false); // Loading state

    const apiUrl = process.env.REACT_APP_API_URL;

    const handleLogout = async () => {
        const deleteExpenseURL = `${apiUrl}/Auth/Logout`;
        setLoading(true);
        try {
            await axios.post(deleteExpenseURL, null, {
                headers: {
                    Authorization: `Bearer ${userDetails?.accessToken}`
                }
            })
        } catch (error) {
                console.log("Error Logging Out: ", error);
        } finally {
            localStorage.removeItem('userDetails');
            setUserDetails(null);
            navigate('/Login');
            setLoading(false);
        }
    }
    if (loading) {
        return <Loading />
    }
    return (
        <div className='mb-5 mb-lg-0'>
            <header className="p-3 text-bg-dark fixed-top">
                <div className="container">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <ul className="nav col-12 col-lg-auto me-lg-auto justify-content-center">
                            <li><a href="/" className="nav-link px-2 text-white">Home</a></li>
                            <li><a href="/About" className="nav-link px-2 text-white">About</a></li>
                            <li><a href="/Invite" className="nav-link px-2 text-white">Invite</a></li>
                        </ul>
                        { // Search disabled for now
                        /* <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
                            <input type="search" className="form-control form-control-dark text-bg-dark" placeholder="Search..." aria-label="Search" />
                        </form> */
                        }
                        { userDetails?.accessToken ? (
                                <div>
                                    <button type="button" className="btn btn-warning me-3">{`${userDetails?.firstName} ${userDetails?.lastName}`}</button>
                                    <button type="button" className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
                                </div>
                            ) : (
                                <div>
                                    <a href="/Login"><button type="button" className="btn btn-outline-light me-3">Login</button></a>
                                    <a href="/Sign-Up"><button type="button" className="btn btn-warning">Sign-up</button></a>
                                </div>
                            )
                        }
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;