import React, {useState} from "react";
import axios from 'axios';

import contactModalStyle from "../assets/stylesheets/contactModal.module.css";
import friendImg from '../assets/img/ron.jpg'
import { AiFillCloseCircle } from "react-icons/ai";
import makeToast from "../Toaster";
import io from 'socket.io-client'

const socket = io('http://localhost:8888');

function SearchUserModal({ setIsUser, searchId, searchFirstName, searchLastName, searchEmail, senderId }) {
  const receiverId = searchId;
  const submitHandler = () => {
    axios.post('http://localhost:8888/user/crequest', {
      receiverId,
      senderId
    })
      .then((response) => {
        makeToast('success', response.data.message);
        socket.emit('sendNotification', {receiverId: receiverId, senderId: senderId});
        setIsUser(false);
      })
      .catch((err) => {
        makeToast('error', err.response.data.message);
      })
  }
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