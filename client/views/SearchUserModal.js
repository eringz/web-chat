import React, {useState, useEffect, useContext, useRef} from "react";
import {SocketContext} from '../App';
import {UserContext} from './WebChat';
import contactModalStyle from '../assets/stylesheets/searchUserModal.module.css';
import { AiFillCloseCircle } from "react-icons/ai";
import makeToast from "../Toaster";


function SearchUserModal({searchUser, setIsUser}) {
  const user = useContext(UserContext);
  const socket = useContext(SocketContext);

  // let array = [];
  // console.log(array.length);
  const [pending, setPending] = useState(false);


  // if(searchUser.contactRequests)
  // {
  //   console.log('falsedfsdf')
  //   contactRequest = false
  // }
  // else
  // {
  //   console.log('teureoirue')
  // }

  let display;
  
  

  /* 
    * CREATE submitHandler FUNCTION TO MAKE A CLIENT EMIT CALLED sendContactRequest.
  */
  const contactRequestHandler = () => {
    socket.emit('sendContactRequest', {receiverId: searchUser.id, senderId: user.id, action: 'sent you a friend request'});
    setPending(true);
    // setIsUser(false);
  };

  const cancelContactRequestHandler = () => {
    alert('cancel');
    setPending(false);
  }

  /*
    * INVOKE USEFFECT HOOK TO PERFORM A CLIENT LISTEN CALLED contactRequestMessage.
    * HANDLE MAKETOAST TO MAKE AN ALERT MESSAGE TO A USER THAT SENDS A CONTACT REQUEST.
  */
  useEffect(() =>{
    
  }, [socket]);


  if(pending)
  {
    display = <button onClick={cancelContactRequestHandler} className={contactModalStyle.cancel}>CANCEL</button> 
  }
  else
  {
    display = <button onClick={contactRequestHandler} className={contactModalStyle.add}>ADD</button> 
  }
  // if(pending === false)
  // {
  // }
  // else
  // {
  //   display = <button onClick={contactRequestHandler} className={contactModalStyle.add}>ADD</button> 
  // }
   
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
          <p className={contactModalStyle.name}>{searchUser.firstName} {searchUser.lastName}</p>
          <p className={contactModalStyle.email}>{searchUser.email}</p>
          {display}
        </div>
      </div>
    </div>
  );
}

export default SearchUserModal;