import React, {useContext, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {SocketContext} from '../App';
import makeToast from '../Toaster'

function Login() {
    const socket = useContext(SocketContext);
    const emailRef = React.createRef();
    const passwordRef = React.createRef();
    const navigate = useNavigate()

    /**
        * ADD EVENTLISTENER CALLED 'loginUser' MAKING EMAIL AND PASSWORD INPUT AS PARAMETERS FOR LOGIN
        * CLIENT EMIT TO SERVER WITH AN EVENT CALLED 'loginUser' PASSING EMAIL AND PASSWORD PARAMETERS.
        * DEVELOPER: RON SANTOS
    */
    const loginUser = () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        
        socket.emit('loginUser', {email: email, password: password});    
    }

    /**
        * CLIENT LISTEN TO SERVER WITH AN EVENT CALLED 'logUser' FETCH RESPONSE DATA FROM SERVER AND.
        * CLIENT EMITS TO SERVER WITH AN EVENT CALLED 'getPrivateChatrooms' REQUEST TO SERVER EXISTING PRIVATE CHATROOMS AVAILABLE PER USER.
        * DEVELOPER: RON SANTOS
    */
    useEffect(() =>{
        socket.on('logUser', (res) => {
            makeToast('success', res.message);
            localStorage.setItem('id', res.user._id);
            socket.emit('getPrivateChatrooms',res.user._id);
            navigate('/webchat');
        });
    }, [socket]);

    return (
        <div className='card'>
            <div className='cardBody'>
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
                        onKeyPress={(e) => { e.key === 'Enter' && loginUser()}}
                    />
                </div>
                <button onClick={loginUser} className='login-button'>Log in</button>
                <Link to='/signup'>Sign up</Link>
            </div>
        </div>
    )
}

export default Login
