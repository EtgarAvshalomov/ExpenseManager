import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loading from './Loading';

const SignUp = () => {

    const { setUserDetails } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Loading state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { familyId, isAdult } = useParams();
    const [adultToggle] = useState(isAdult ? isAdult === 'true' : true);

    const handleSignUp = async (e) => {
        e.preventDefault();
        const registerURL = 'https://localhost:7217/api/Auth/Register';
        const registerFamilyURL = `https://localhost:7217/api/Auth/Register?familyId=${familyId}`;
        const loginURL = 'https://localhost:7217/api/Auth/Login';
        try {
            setLoading(true);
            const response = await axios.post(familyId ? registerFamilyURL : registerURL, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                adult: adultToggle
            });
            
            if(response.status === 201) {
                try {
                    const response = await axios.post(loginURL, {
                        email: email,
                        password: password
                    });
                    
                    if(response.status === 200) {
                        localStorage.setItem('userDetails', JSON.stringify(response.data));
                        setUserDetails(response.data);
                        console.log("User Details: ", response.data);
                        navigate('/');
                    }
                } catch (error) {
                    console.error("Error Logging In At Sign-Up: ", error)
                }
            }
        } catch (error) {
            setError(error.response.data.errors)
            console.error("Error Signing Up: ", error)
        } finally {
            setLoading(false);
        }
    }

    const nameRegex = /^[a-zA-Z\s]+$/;

    const handleFirstName = (e) => {
        const value = e.target.value;
        if (nameRegex.test(value) || value === '') {
            setFirstName(value);
            setError('');
        } else {
            setError('First name can only contain letters and spaces.');
        }
    };

    const handleLastName = (e) => {
        const value = e.target.value;
        if (nameRegex.test(value) || value === '') {
            setLastName(value);
            setError('');
        } else {
            setError('Last name can only contain letters and spaces.');
        }
    };

    if (loading) {
        return <Loading />
    }

    return (
        <div className="container">
            <h2 className="my-4">Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <div className="mb-3">
                    <label htmlFor="first-name" className="form-label">First name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="first-name"
                        value={firstName}
                        onChange={handleFirstName}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="last-name" className="form-label">Last name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="last-name"
                        value={lastName}
                        onChange={handleLastName}
                        required
                    />
                </div>
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
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
            {error.length > 0 && (
                <div className="mt-3" style={{ color: 'red' }}>
                    {error.map((error) => (
                        <p>{error}</p> // Display each error message
                    ))}
                </div>
            )}
        </div>
    );
}

export default SignUp;