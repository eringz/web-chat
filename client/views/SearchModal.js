import React, { useEffect, useState, useReducer, useRef, useContext } from 'react';
import { BsSearch } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import SearchUserModal from './SearchUserModal';
import makeToast from '../Toaster';
import {UserContext} from './WebChat';
import {SocketContext} from '../App';
import searchModalstyle from '../assets/stylesheets/searchModal.module.css';

const initialState = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
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
                contactRequests: action.contactRequests
            }
        default:
            return state;
    }
}

function SearchModal({setOpenModal}){

    const user = useContext(UserContext);
    const socket = useContext(SocketContext);
    const emailRef = React.createRef();
    const [isUser, setIsUser] = useState(false);

    /**
        * ADD EVENTLISTENER CALLED 'searchUserHandle' AND HANDLE CONDITION PER EMAIL INPUT.
        * CLIENT EMIT TO SERVER WITH AN EVENT CALLED 'searchUserByEmail' SEARCHING AN EXISTING USER BY PASSING EMAIL AS PARAMETER.
        * DEVELOPER: RON SANTOS
    */
    const searchUserHandle = () => {
        const email = emailRef.current.value;
        if(email === user.email) 
        {
            makeToast('error', 'The email you search is your own email');
        }
        else if(!email)
        {
            makeToast('error', 'Please Type an Email');
            setIsUser(false);
        }
        else
        {
            socket.emit('searchUserByEmail', {email: email, senderId: user.id});
            
        }  
    }
    
    /**
        * CLIENT LISTEN TO SERVER WITH AN EVENT CALLED 'searcedhUserByEmail' WITH A RESPONSE OF SEARCHED USER FROM SERVER.
        * DEVELOPER: RON SANTOS
    */
    const [searchUser, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        socket.on('searcedhUserByEmail', (res) => {
            if(!res.user)
            {
                makeToast('error', 'No user found');
                setIsUser(false);
            }
            else
            {
                setIsUser(true);
                dispatch({ 
                    type: "USER", 
                    id: res.user._id,
                    firstName: res.user.firstName, 
                    lastName: res.user.lastName,
                    email:  res.user.email,
                    contactRequests: res.user.contactRequests
                });
                
            }
        });
    }, [socket]);

    return (
        <>
            <div className={searchModalstyle.container}>
                <div className={searchModalstyle.title}>
                    <button className={searchModalstyle.titleButton}
                    onClick={() => {
                    setOpenModal(false);
                    }}
                    >
                        <AiFillCloseCircle />
                    </button>
                </div>
                <div>
                    <input  type='email' placeholder="Email address" ref={emailRef}/>
                    <button onClick={searchUserHandle} className={searchModalstyle.search} ><BsSearch size="30" /></button>
                </div>
            </div>
            {isUser && <SearchUserModal 
                setIsUser={setIsUser} 
                searchUser={searchUser}
            />}
        </>
    )
}

export default SearchModal
