import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import makeToast from '../Toaster';
import FormData from 'form-data';

function Signup() {

    const firstNameRef = React.createRef();
    const lastNameRef = React.createRef();
    const emailRef = React.createRef();
    const passwordRef = React.createRef();
    const [image, setImage] = useState()
    const navigate = useNavigate()

    /**
        * ADD EVENTLISTENER CALLED 'registerHandler' FROM A SIGN UP FORM.
        * PERFORM AN AXIOS PROMISE TO SAVE A USER INFORMATIONS.
        * DEVELOPER: RON SANTOS
    */
    const registerHandler = (e) => {
        e.preventDefault()
        const firstName = firstNameRef.current.value;
        const lastName = lastNameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        const form = new FormData();
        form.append('firstName', firstName);
        form.append('lastName', lastName);
        form.append('email', email);
        form.append('password', password);
        form.append('image', image);
        console.log('image', image);
        
        axios.post('http://localhost:8888/user/signup', form)
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
        <form encType="multipart/form-data" onSubmit={registerHandler} className='card'>
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
                <div className='inputGroup'>
                    <input 
                        type='file' 
                        name='image' 
                        id='image' 
                        onChange={(e) => {setImage(e.target.files[0])}}
                    />
                </div>
                <button type="submit" className='signup-button'>Sign up</button>
                <Link to='/login'>Log in</Link>
            </div>
        </form>
    )
}

export default Signup
