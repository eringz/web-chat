import React, {useState, useEffect, useContext, useRef} from "react";
import {SocketContext} from '../App';
import {UserContext} from './WebChat';
import contactModalStyle from '../assets/stylesheets/searchUserModal.module.css';
import { AiFillCloseCircle } from "react-icons/ai";
import makeToast from "../Toaster";


function SearchUserModal({searchUser, setIsUser, pending}) {
  const user = useContext(UserContext);
  const socket = useContext(SocketContext);

  let display;

  /* 
    * ADD EVENTLISTENER CALLED 'contactRequestHandler' TO PERFORM A REQUEST TO SERVER.
    * CLIENT EMIT TO SERVER WITH AN EVENT CALLED 'sendContactRequest' AND PASSING RECEIVER ID AND SENDER ID WITH AN ACTION AS PARAMETERS
    * DEVELOPER: RON SANTOS
  */
  const contactRequestHandler = () => {
    console.log('fsfsdf');
    socket.emit('sendContactRequest', {receiverId: searchUser.id, senderId: user.id, action: 'sent you a friend request'});
    makeToast('info', `You make a contact request with ${searchUser.firstName}. Please wait for confirmation.`);
    setIsUser(false);
  }

  /* 
    * ADD EVENT LISTENER CALLED 'cancelContactRequestHandler' TO MAKE A CANCEL OF CONTACT REQUEST TO USER
    * CLIENT EMIT TO SERVER WITH AN EVENT CALLED 'cancelContactRequest' TO REQUEST A CANCEL OF CONTACT REQUEST TO SERVER.
    * DEVELOPER: RON SANTOS
  */
  const cancelContactRequestHandler = () => {
    socket.emit('cancelContactRequest', {receiverId: searchUser.id, senderId: user.id, action: 'cancel a contact request'});
    makeToast('info', `You cancel a contact request with ${searchUser.firstName}.`);
    setIsUser(false);
  }


  /* 
    * CREATING CONDITIONS FOR A SEARCH USER TO DETERMINE THE BUTTON TO RENDER
    * DEVELOPER: RON SANTOS
  */
  if(searchUser.id !== '')
  {
    console.log('length', searchUser.contactRequests.length);

    for(let i = 0; i < searchUser.contactRequests.length; i++)
    {
      if(searchUser.contactRequests[i] === user.id)
      {
        display = <button onClick={cancelContactRequestHandler} className={contactModalStyle.cancel}>CANCEL</button> 
      }
      else
      {
        display = <button onClick={contactRequestHandler} className={contactModalStyle.add}>ADD</button> 
      }
    }
  }
  
  if(searchUser.contactRequests.length === 0 )
  {
      display = <button onClick={contactRequestHandler} className={contactModalStyle.add}>ADD</button> 
  }

  return (
    <div className={ contactModalStyle.modalBackground}>
      <div className={contactModalStyle.modalContainer}>
        <div className="body">
          <img className={contactModalStyle.img} src={`data:image/*;base64, ${btoa(String.fromCharCode(...new Uint8Array(searchUser.image.data)))}`} alt='friend' /> 
          <p className={contactModalStyle.name}>{searchUser.firstName} {searchUser.lastName}</p>
          <p className={contactModalStyle.email}>{searchUser.email}</p>

          {/* display = <button onClick={contactRequestHandler} className={contactModalStyle.add}>ADD</button>  */}
          {display}
        </div>
      </div>
    </div>
  );
}

export default SearchUserModal;