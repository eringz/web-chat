import React, { useEffect, useState } from 'react';
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
    const [searchId, setSearchId] = useState('');
    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchLastName, setSearchLastName ] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [isUser, setIsUser] = useState(false);

    useEffect(() => {
        console.log('sender email', localStorage.getItem('email'));
    }, [socket]);
    

    const searchUser = (e) => {
        e.preventDefault();

        const email = emailRef.current.value;

        if(email === localStorage.getItem('email'))
        {
            makeToast('error', 'This request is invalid. Please try another email');
            setIsUser(false);
        }
        else
        {
            axios.post('http://localhost:8888/user/search', {
            email,
            senderId
        })
            .then((response) => {
                setSearchId(response.data.id);
                setSearchFirstName(response.data.firstName);
                setSearchLastName(response.data.lastName);
                setSearchEmail(response.data.email);
                setIsUser(true);
            })
            .catch((err) => {
                if(err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.messsage   
                )
                {
                    makeToast('error', err.response.data.message);
                }
            })
        }

        
  }
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
                setIsUser={setIsUser} 
                searchId={searchId}
                searchFirstName={searchFirstName}
                searchLastName={searchLastName}
                searchEmail={searchEmail}   
                senderId={senderId} 
            />}
        </>
        
    )
}

export default SearchModal
