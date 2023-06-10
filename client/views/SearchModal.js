import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BsSearch } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import SearchUserModal from './SearchUserModal';
import makeToast from '../Toaster'


const DIV_STYLES = {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 20px',
    width: '30vw',
    height: '12vh',
    position: 'absolute',
    top: '8%',
    left: '35%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    borderRadius: '5px',
    zIndex: 1000
}

const TITLE_STYLES = {
    display: 'flex',
    justifyContent: 'flexEnd',
    borderBottom: '1px solid #D5D5D5'
}

const BUTTON_STYLES = {
    backgroundColor: 'transparent',
    padding: '5px 5px',
    margin: '0 435px',
    width:'2vw',
    height: '2vw',
}

const SEARCH_STYLES = {
    backgroundColor: 'transparent',
    width:'4vw',
    height: '2.7vw',
    position: 'relative',
    top: '-45%',
    left: '85%',
}

function SearchModal({socket, setOpenModal , senderId}){
    const emailRef = React.createRef();
    const [isUser, setIsUser] = useState(false);
    const [user, setUser] = useState({});
    let shouldLog = useRef(true);

    const searchUser = () => {
        const email = emailRef.current.value;
        if(shouldLog)
        {
            shouldLog = false;
            (email !== localStorage.getItem('email')) ? (socket.emit('searchUser', {email: email, senderId: senderId})) : makeToast('error', 'You can not add your own self'); 
        }
        // socket.emit('searchContactRequest', {receiverId: user._id, senderId: senderId});
    }
    
    useEffect(() => {
        socket.on('searchedUser', (res) => {
            if(res.user !== null)
            {
                makeToast('success', `You searched ${res.user.firstName}`);
                setUser(res.user);
                setIsUser(true)

            }
            else
            {
                makeToast('error', `Email is invalid`);
                setIsUser(false);
            } 
        });
    }, [socket]);

    return (
        <>
            <div style={DIV_STYLES}>
                <div style={TITLE_STYLES}>
                    <button style={BUTTON_STYLES}
                    onClick={() => {
                    setOpenModal(false);
                    }}
                    >
                        <AiFillCloseCircle />
                    </button>
                </div>
                <div>
                    <input  type='email' placeholder="Email address" ref={emailRef}/>
                    <button onClick={searchUser} style={SEARCH_STYLES} ><BsSearch size="30" /></button>
                </div>
            </div>
            {isUser && <SearchUserModal 
                socket={socket}
                user={user}
                senderId={senderId}
                setIsUser={setIsUser} 
            />}
        </>
    )
}

export default SearchModal
