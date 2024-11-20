import { useAuth } from './AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Loading from './Loading';

const Login = () => {

    const { setUserDetails } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false); // Loading state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginURL = 'https://localhost:7217/api/Auth/Login';
        try {
            setLoading(true);
            const response = await axios.post(loginURL, {
                email: email,
                password: password
            });
            
            if(response.status === 200) {
                localStorage.setItem('userDetails', JSON.stringify(response.data));
                setUserDetails(response.data);
                navigate('/');
            }

        } catch (error) {
            setError('Email or password do not match');
            console.error("Error Logging In: ", error)
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />
    }

    return (
        <div className="container">
            <h2 className="my-4">Login</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <p className='mt-3' style={{color: 'red'}}>{error}</p>
        </div>
    );
}

export default Login;