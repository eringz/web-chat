import  React, { useEffect, useContext, useReducer,  useRef} from 'react'
import style from '../assets/stylesheets/dashboard.module.css';
import { FaFacebookMessenger,  } from "react-icons/fa";
import { BsPeopleFill, BsFillBellFill } from "react-icons/bs";
import pic from '../assets/img/ron.jpg';
import { useNavigate } from "react-router-dom";
import ChatHistory from './ChatHistory';
import Contact from './Contact';
import Notification from './Notification';
import {SocketContext} from '../App';



export const UserContext = React.createContext();

const initialState = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'USER' : 
            return {
                id: action.id,
                firstName: action.firstName,
                lastName: action.lastName,
                email: action.email
            }
        default:
            return state;
    }
}

function WebChat(){

    const socket = useContext(SocketContext);
    
    let shouldLog = useRef(true);
    const [count, setCount] = React.useState(1);
    const navigate = useNavigate();
    const id = localStorage.getItem('id');

    useEffect(()=> {
        socket.emit('searchUser', id);
    }, [socket]);
    
    
    const [user, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        socket.on('user', (res) => {
            // console.log(res.user._id);
            dispatch({ 
                type: "USER", 
                id: res.user._id,
                firstName: res.user.firstName, 
                lastName: res.user.lastName,
                email:  res.user.email
            });
        });
    }, [socket]);
    
    console.log(`React User: ${user.id}`);

    const logoutUser = () => {
            localStorage.clear();
            socket.emit('logoutUser', id);
            navigate('/');
    }
    
    //Handling click event handlers
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
                </UserContext.Provider>
                <div className={style.chat}>
                    <div className={style.chatHeader}></div>
                    <div className={style.chatBody}><i class="fas fa-band-aid"></i></div>
                </div>
                <div className={style.account}>
                    <div className={style.accountHead}>
                        <img id={style.profilePic} src={pic} alt='profile' />
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
