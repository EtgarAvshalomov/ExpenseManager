import { Helmet } from 'react-helmet';

const About = () => {
    return (
        <div className="container mt-5">
            <Helmet>
                <title>About</title>
            </Helmet>
            <div className="mb-5 text-center">
                <h2>What We Are About</h2>
                <p className="mt-4">
                    Our app is designed to help families manage their expenses together in a simple and transparent way. <br/>
                    By providing a platform where family members can easily add and track expenses, we aim to foster better 
                    financial awareness and communication within families.
                </p>
            </div>
            <div className="mb-5" style={{width: '55%', marginLeft: '22.3%'}}>
                <h2 className="text-center">Key Features:</h2>
                <ul className="mt-4">
                    <li><strong>Easy Expense Tracking:</strong> Users can add their expenses quickly and effortlessly.</li>
                    <li><strong>Approval System:</strong> Adults in the family can approve expenses, promoting accountability.</li>
                    <li><strong>Transparency:</strong> All family members can view expenses, ensuring everyone is on the same page.</li>
                    <li><strong>Budget Management:</strong> Families can set budgets to keep their spending in check.</li>
                </ul>
            </div>
            <div className="text-center mb-5">
                <h2>Join Us!</h2>
                <p>
                    We invite you to join our community and take control of your family's spending. <br/>
                    Together, we can make smarter 
                    financial decisions and achieve our goals!
                </p>
                <a href="/Sign-Up" className="btn btn-primary mt-2">Get Started</a>
            </div>
        </div>
    )
}

export default About;