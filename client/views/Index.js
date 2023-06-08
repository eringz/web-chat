import React from 'react'
import { useNavigate } from 'react-router-dom';

function Index({socket}) {
    const navigate = useNavigate();

    React.useEffect(() => {
        const email = localStorage.getItem('email');
        if(!email)
        {
            navigate('/login');
        }
        else
        {
            navigate('/webchat');
        }
    }, [])

    return (
        <div>Index</div>
    )
}

export default Index
