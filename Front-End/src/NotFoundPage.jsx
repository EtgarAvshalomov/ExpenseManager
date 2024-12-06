import { Helmet } from 'react-helmet';

const NotFoundPage = () => {
    return (
        <div className="mt-5">
            <Helmet>
                <title>Not Found</title>
            </Helmet>
            <p className="centered" style={{fontSize: '22px'}}>Error 404<br/></p>
            <p className="centered" style={{fontSize: '20px'}}>Page Not Found</p>
        </div>
    );
}

export default  NotFoundPage;