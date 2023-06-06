import React from 'react'
import { useNavigate } from 'react-router-dom';

function Index(props) {
    const navigate = useNavigate();

    React.useEffect(() => {
        const email = localStorage.getItem('email');
        if(!email)
        {
            navigate('/login');
        }
        else
        {
            navigate('/dashboard')
        }
    }, [])

    return (
        <div>Index</div>
    )
}

export default Index
