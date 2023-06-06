import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import makeToast from '../Toaster'

function Signup(props) {
    const firstNameRef = React.createRef();
    const lastNameRef = React.createRef();
    const emailRef = React.createRef();
    const passwordRef = React.createRef();
    const navigate = useNavigate()
    
    const signupUser = (e) => {
        e.preventDefault()
        const firstName = firstNameRef.current.value;
        const lastName = lastNameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        
        // this.props.history.push('/login')
        
        axios.post('http://localhost:8888/user/signup', {
            firstName,
            lastName,
            email,
            password    
        })
            .then((response) => {
                console.log('ok',response.data.message);
                makeToast('success', response.data.message)
                navigate('/login')
            })
            .catch((err) => {
                console.log('not ok', err.response.data.message)
                makeToast('error', err.response.data.message);
            });
    }

    return (
        <div className='card'>
            {/* <div className='cardHeader'>{JSON.stringify(firstNameRef)}</div> */}
            <div className='cardBody'>
                <div className='inputGroup'>
                    <input 
                        type='text' 
                        name='firstName' 
                        id='firstName' 
                        placeholder='First Name' 
                        ref={firstNameRef}
                    />
                </div>
                <div className='inputGroup'>
                    <input 
                        type='text' 
                        name='lastName' 
                        id='lastName' 
                        placeholder='Last Name'
                        ref={lastNameRef} 
                    />
                </div>
                <div className='inputGroup'>
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
                <button onClick={signupUser} className='signup-button'>Sign up</button>
                <Link to='/login'>Log in</Link>
            </div>
        </div>
    )
}

export default Signup
