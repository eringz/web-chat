import  React, { useEffect, useContext, useReducer, useState} from 'react'
import style from '../assets/stylesheets/webchat.module.css';
import { FaFacebookMessenger,  } from "react-icons/fa";
import { BsPeopleFill, BsFillBellFill } from "react-icons/bs";
import pic from '../assets/img/ron.jpg';
import { useNavigate } from "react-router-dom";
import ChatHistory from './ChatHistory';
import Contact from './Contact';
import Chat from './Chat';
import Notification from './Notification';
import {SocketContext} from '../App';


export const UserContext = React.createContext();

const initialState = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    image: {},
    constactRequests: []
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'USER' : 
            return {
                id: action.id,
                firstName: action.firstName,
                lastName: action.lastName,
                email: action.email,
                image: action.image,
                contactRequests: action.contactRequests
            }
        default:
            return state;
    }
}

    
function WebChat(){
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const id = localStorage.getItem('id');

    /**
        * CLIENT EMIT TO SERVER EVENT CALLED 'searchUser' TO GET USER'S INFORMATIONS.
        * DEVELOPER: RON SANTOS
    */
    useEffect((res) => {
        socket.emit('searchUser', id);
    }, [socket])

    /**
        * CLIENT LISTENS TO SERVER EVENT CALLED 'user' FETCHING DATA FROM SERVER FOR USER INFORMATIONS.
        * DEVELOPER: RON SANTOS
    */
    const [user, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        socket.on('user', (res)=> {
            console.log('image user', res);
            dispatch({
                type:"USER",
                id: res.user._id,
                firstName: res.user.firstName,
                lastName: res.user.lastName,
                email: res.user.email,
                image: res.user.img.data 
            })
        });
    }, [socket]);

    /**
        * ADD EVENTLISTENERS CALLED 'logoutUser' TO CLEAR USER SESSIONS AND TO PERFORM LOGOUT OF A USER
        * CLIENT EMITS TO SERVER EVENT CALLED 'logoutUser' FOR A LOGOUT INFORMATION.
        * DEVELOPER: RON SANTOS
    */
    const logoutUser = () => {
            localStorage.clear();
            socket.emit('logoutUser', id);
            navigate('/');
    }
    
    /**
        * CREATE DISPLAY CONDITIONS FOR COUNT FROM NAV1 TO DISPLAY IN NAV2
        * DEVELOPER: RON SANTOS
    */
    const [count, setCount] = React.useState(1);
    let display;
    if(count === 2){
        display = <Contact />;
    }
    else if(count === 3 )
    {
        display = <Notification />;
    }
    else
    {
        display = <ChatHistory />; 
    }

    return (
        <>
            <div className={style.container}>
                <div className={style.nav1}>
                    <button onClick={() => {setCount(1)} }  className={style.navButton}><FaFacebookMessenger  size="40" /></button>
                    <button onClick={() => {setCount(2)} } className={style.navButton}><BsPeopleFill size="40" /></button>
                    <button onClick={() => {setCount(3)} } className={style.navButton}><BsFillBellFill size="40" /></button>
                </div>
                <UserContext.Provider value={user}>
                    <div className={style.nav2}>
                        {display}
                    </div>
                    <Chat />
                </UserContext.Provider>

                <div className={style.account}>
                    <div className={style.accountHead}>
                        <img id={style.profilePic} 
                            src={`data:image/*;base64, ${btoa(String.fromCharCode(...new Uint8Array(user.image.data)))}`} 
                            alt='profile' 
                        />
                        <span className={style.logout} onClick={logoutUser}>Log out</span>
                    </div>
                    <p>id: {user.id}</p>
                    <p>Name: {user.firstName} {user.lastName}</p>
                    <p>Email: {user.email}</p>
                </div>
            </div>
        </> 
    )

}

export default WebChat;
