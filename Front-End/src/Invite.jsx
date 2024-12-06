import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import { Helmet } from 'react-helmet';

const Invite = () => {

    AuthGuard();

    const navigate = useNavigate();

    const [link, setLink] = useState('');
    const { userDetails, setUserDetails } = useAuth();
    const [loading, setLoading] = useState(false); // Loading state
    const [adultToggle, setAdultToggle] = useState(false);
    const [error, setError] = useState();

    const handleLinkGeneration = async () => {
        const linkGenerationURL = 'https://localhost:7217/api/Auth/Validate-Adult-Token';
        const generatedLink = `http://localhost:3000/Sign-Up/${userDetails?.familyId}/${adultToggle}`
        setError('');
        try {
            setLoading(true);
            await axios.get(linkGenerationURL, {
                headers: {
                    Authorization: `Bearer ${userDetails?.accessToken}`
                }
            });
            setLink(generatedLink);
            console.log("Link Generated");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Redirect to the login page if unauthorized and revoke tokens
                localStorage.removeItem('userDetails');
                setUserDetails(null);
                navigate('/Login');
              } else if (error.response && error.response.status === 403) {
                setError('You do not have access to this action');
            } else {
                setError(error.response.data);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleAdultToggle = () => {
        adultToggle ? setAdultToggle(false) : setAdultToggle(true);
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="container">
            <Helmet>
                <title>Invite</title>
            </Helmet>
            <h2 className="my-4">Invite Your Family!</h2>
            <form onSubmit={handleLinkGeneration}>
                <div className="form-check form-switch mt-5">
                    <label className="form-check-label me-2 mb-1" htmlFor="adult">{adultToggle ? 'Adult Invite Link' : 'Child Invite Link'}</label>
                    <input 
                        className="form-check-input" 
                        type="checkbox"
                        id="adult" 
                        checked={adultToggle} 
                        onChange={handleAdultToggle} 
                    />
                </div>
                
                <div className="mt-2">
                    <label htmlFor="link" className="form-label">Link</label>
                    <input
                        type="text"
                        className="form-control link"
                        id="link"
                        value={link}
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-4 mb-3 me-3">Generate Link</button>
            </form>
            <p style={{color: 'red'}}>{error}</p>
        </div>
    )
}

export default Invite;