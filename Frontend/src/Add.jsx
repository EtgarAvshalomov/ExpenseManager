import { useState } from "react";
import AuthGuard from "./AuthGuard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loading from './Loading';
import { Helmet } from 'react-helmet';

const Add = () => {

    AuthGuard();

    const navigate = useNavigate();
    const { userDetails, setUserDetails } = useAuth();
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const descriptionCharLimit = 290;
    const titleCharLimit = 100;

    const apiUrl = process.env.REACT_APP_API_URL;

    const handleAdd = async (e) => {
        e.preventDefault();
        const addExpenseURL = `${apiUrl}/Expenses/Add`;
        try {
            setLoading(true);
            await axios.post(addExpenseURL,
            {
                title: title,
                price: price,
                quantity: quantity,
                description: description
            },
            {
                headers: {
                    Authorization: `Bearer ${userDetails?.accessToken}`
                }
            });
            navigate('/')
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Redirect to the login page if unauthorized and revoke tokens
                localStorage.removeItem('userDetails');
                setUserDetails(null);
                navigate('/Login');
              } else {
                console.log('Error Adding Expense: ', error);
            }
        } finally {
            setLoading(false);
        }
    }

    const handlePriceChange = (e) => {
        const newPrice = e.target.value;
    
        // Regex to allow numbers and decimals
        if (/^\d*\.?\d*$/.test(newPrice)) {
          setPrice(newPrice);
        }
    };

    const handleQuantityChange = (e) => {
        const newQuantity = e.target.value;
    
        // Regex to allow only positive integers up to 10,000
        if (newQuantity === '' || (/^(10{0,4}|[1-9]\d{0,3})$/.test(newQuantity))) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return <Loading />
    }

    return (
        <div className="container">
            <Helmet>
                <title>Add</title>
            </Helmet>
            <h2 className="my-4">Add New Expense</h2>
            <form onSubmit={handleAdd}>
                <div className="mb-3 position-relative">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        maxLength={titleCharLimit}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <div
                        className="position-absolute"
                        style={{ bottom: '-20px', right: '10px', fontSize: '12px', color: 'gray' }}
                    >
                        {title.length} / {titleCharLimit} characters
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price {'(Per Unit)'} ($)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="price"
                        value={price}
                        onChange={(e) => handlePriceChange(e)}
                        required
                    />
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input
                        type="text"
                        className="form-control"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(e)}
                        required
                    />
                    <div
                        className="position-absolute"
                        style={{ bottom: '10px', right: '10px', fontSize: '12px', color: 'gray' }}
                    >
                        10,000 max
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <div className="position-relative w-md-60">
                        <textarea
                            type="text"
                            className="form-control"
                            id="description"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                            style={{ height: '135px' }}
                            maxLength={descriptionCharLimit}
                        />
                        <div
                            className="position-absolute"
                            style={{ bottom: '-20px', right: '10px', fontSize: '12px', color: 'gray' }}
                        >
                            {description.length} / {descriptionCharLimit} characters
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Add</button>
            </form>
        </div>
    )
}

export default Add;