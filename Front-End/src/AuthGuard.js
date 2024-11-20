import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";

const AuthGuard = () => {

    const navigate = useNavigate();
    const { userDetails, setUserDetails } = useAuth();

    useEffect(() => {
        const validateTokenURL = 'https://localhost:7217/api/Auth/Validate-Token';
        const refreshTokenURL = 'https://localhost:7217/api/Auth/Refresh-Token';
        const validateToken = async () => {
            console.log('AuthGuard Log: ', userDetails);
            try {
                await axios.get(validateTokenURL, {
                    headers: {
                        Authorization: `Bearer ${userDetails?.accessToken}`
                    }
                });
            } catch (validationError) {
                if (validationError.response && validationError.response.status === 401) {
                    try {
                        const response = await axios.post(refreshTokenURL, { refreshToken: userDetails?.refreshToken})
                        localStorage.setItem('userDetails', JSON.stringify(response.data));
                        setUserDetails(response.data);
                    } catch (refreshError) {
                        // Redirect to the login page if unauthorized and revoke tokens
                        if (refreshError.response.status === 401) {
                            localStorage.removeItem('userDetails');
                            setUserDetails(null);
                            navigate('/Login');
                            console.log('Refreshing Token Failed: Logging Out');
                        } else {
                            console.log('Error Attempting To Refresh Token: ', refreshError);
                        }
                    }
                } else {
                    console.log('Error Validating Token: ', validationError);
                }
            }
        }

        validateToken();
    }, [navigate]);

    return null;
};

export default AuthGuard;