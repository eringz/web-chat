import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import makeToast from '../Toaster'


function Login() {
    const emailRef = React.createRef();
    const passwordRef = React.createRef();
    const navigate = useNavigate()

    const loginUser = (e) => {
        e.preventDefault()
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        axios.post('http://localhost:8888/user/login', {
            email,
            password    
        })
            .then((response) => {
                makeToast('success', response.data.message)
                localStorage.setItem('CC_token', response.data.token);
                localStorage.setItem('id', response.data.id);
                localStorage.setItem('firstName', response.data.firstName);
                localStorage.setItem('lastN ame', response.data.lastName);
                localStorage.setItem('email', response.data.email);
                navigate('/webchat');
            })
            .catch((err) => {
                if(err && 
                    err.response && 
                    err.response.data && 
                    err.response.data.message
                )
                    makeToast('error', err.response.data.message);
            });
    }
    
    return (
        <div className='card'>
            {/* <div className='cardHeader'>Login</div> */}
            <div className='cardBody'>
                <div className='inputGroup'>
                    {/* <label htmlFor='email'>Email</label> */}
                    <input 
                        type='email' 
                        name='email' 
                        id='email' 
                        placeholder='Email Address' 
                        ref={emailRef}
                    />
                </div>
                <div className='inputGroup'>
                    <input 
                        type='password' 
                        name='password' 
                        id='password' 
                        placeholder='Password' 
                        ref={passwordRef}
                    />
                </div>
                <button onClick={loginUser} className='login-button'>Log in</button>
                <Link to='/signup'>Sign up</Link>
            </div>
        </div>
    )
}

export default Login
