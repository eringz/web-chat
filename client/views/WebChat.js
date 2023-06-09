import  React, {useState, useEffect, useRef} from 'react'
import style from '../assets/stylesheets/dashboard.module.css';
import { FaFacebookMessenger,  } from "react-icons/fa";
import { BsPeopleFill, BsFillBellFill } from "react-icons/bs";
import pic from '../assets/img/ron.jpg';
import { useNavigate } from "react-router-dom";
import ChatHistory from './ChatHistory';
import Contact from './Contact';
import Notification from './Notification';

function WebChat({socket}){
    
    let shouldLog = useRef(true);
    // const [isLogin, setIsLogin] = useState(true);

    const [count, setCount] = React.useState(1);
    const navigate = useNavigate();
    const id = localStorage.getItem('id');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const email = localStorage.getItem('email');
    
    useEffect(() => {
        console.log('webchat page',id);
        socket.emit('loginUser', id);
    }, [socket]);
    

    const logoutUser = () => {
            localStorage.clear();
            socket.emit('logoutUser', id);
            navigate('/');
    }
    
    // if(!isLogin)
    // {
    //     // socket.emit('logout_user', email);
    // }

    //Handling click event handlers
    let display;
    if(count === 2){
        display = <Contact socket={socket} senderId={id} />;
    }
    else if(count === 3 )
    {
        display = <Notification socket={socket} id={id} />;
    }
    else
    {
        display = <ChatHistory socket={socket} />; 
    }

    return (
        <>
            <div className={style.container}>
                <div className={style.nav1}>
                    <button onClick={() => {setCount(1)} }  className={style.navButton}><FaFacebookMessenger  size="40" /></button>
                    <button onClick={() => {setCount(2)} } className={style.navButton}><BsPeopleFill size="40" /></button>
                    <button onClick={() => {setCount(3)} } className={style.navButton}><BsFillBellFill size="40" /></button>
                </div>
                <div className={style.nav2}>
                    {display}
                </div>
                <div className={style.chat}>
                    <div className={style.chatHeader}></div>
                    <div className={style.chatBody}><i class="fas fa-band-aid"></i></div>
                </div>
                <div className={style.account}>
                    <div className={style.accountHead}>
                        <img id={style.profilePic} src={pic} alt='profile'></img>
                        <span className={style.logout} onClick={logoutUser}>Log out</span>
                    </div>
                    <p>Name: {firstName} {lastName}</p>
                    <p>Email: {email}</p>
                </div>
            </div>
        </> 
    )

}

export default WebChat;
