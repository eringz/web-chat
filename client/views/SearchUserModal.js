import React, {useState, useEffect} from "react";
import axios from 'axios';
import contactModalStyle from "../assets/stylesheets/contactModal.module.css";
import friendImg from '../assets/img/ron.jpg'
import { AiFillCloseCircle } from "react-icons/ai";
import makeToast from "../Toaster";


function SearchUserModal({socket, setIsUser, searchId, searchFirstName, searchLastName, searchEmail, senderId }) {
  const receiverId = searchId;

  const [contactRequestId, setContactRequestId] = useState('');

  const submitHandler = () => {
    socket.emit('sendContactRequest', {receiverId: receiverId, senderId: senderId, action: 'sent you a friend request'})
  }

  useEffect(() =>{
    socket.on('message', (res) => {
      console.log(res);
      makeToast('info', res.message);
      setContactRequestId(res.contacRequestId);
    });

    socket.emit('addNotification', {contactRequest: contactRequestId ,action: 'sent you a friend request'})
  }, [socket])
  

  
  return (
    <div className={ contactModalStyle.modalBackground}>
      <div className={contactModalStyle.modalContainer}>
        <div className={contactModalStyle.titleCloseBtn}>
          <button className={contactModalStyle.button}
            onClick={() => {
              setIsUser(false);
            }}
          >
            <AiFillCloseCircle />
          </button>
        </div>
        <div className="body">
          <img className={contactModalStyle.img} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi3N0LBOCIWRLl7xqB5djlO0oL0PImfxJ1UiodMpb1cg&s' alt='friend' /> 
          <p className={contactModalStyle.name}>{searchFirstName} {searchLastName}</p>
          <p className={contactModalStyle.email}>{searchEmail}</p>
          <button onClick={submitHandler} className={contactModalStyle.add}>Add</button> 
        </div>
      </div>
    </div>
  );
}

export default SearchUserModal;