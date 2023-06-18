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
    * CREATE submitHandler FUNCTION TO MAKE A CLIENT EMIT CALLED sendContactRequest.
  */
  const contactRequestHandler = () => {
    socket.emit('sendContactRequest', {receiverId: searchUser.id, senderId: user.id, action: 'sent you a friend request'});
    makeToast('info', `You make a contact request with ${searchUser.firstName}. Please wait for confirmation.`);
    setIsUser(false);
  }

  const cancelContactRequestHandler = () => {
    socket.emit('cancelContactRequest', {receiverId: searchUser.id, senderId: user.id, action: 'sent you a friend request'});
    makeToast('info', `You cancel a contact request with ${searchUser.firstName}.`);
    setIsUser(false);
    
  }

  /*
    * INVOKE USEFFECT HOOK TO PERFORM A CLIENT LISTEN CALLED contactRequestMessage.
    * HANDLE MAKETOAST TO MAKE AN ALERT MESSAGE TO A USER THAT SENDS A CONTACT REQUEST.
  */
  useEffect(() =>{

  }, []);

  const [isPending, setIsPending] = useState(false)
  
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
      console.log('fsdfsdffsd');
      display = <button onClick={contactRequestHandler} className={contactModalStyle.add}>ADD</button> 
  }

  return (
    <div className={ contactModalStyle.modalBackground}>
      <div className={contactModalStyle.modalContainer}>
        <div className="body">
          <img className={contactModalStyle.img} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi3N0LBOCIWRLl7xqB5djlO0oL0PImfxJ1UiodMpb1cg&s' alt='friend' /> 
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