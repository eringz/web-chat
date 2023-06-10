import React, {useState, useEffect, useRef} from "react";
import contactModalStyle from "../assets/stylesheets/contactModal.module.css";
import { AiFillCloseCircle } from "react-icons/ai";
import makeToast from "../Toaster";


function SearchUserModal({socket, user, senderId, setIsUser}) {

  
  console.log('user:', user, 'senderId:', senderId, 'setIsUser', setIsUser);
  
  const [pending, setPending] = useState(false);
  let shouldLog = useRef(true);
  let display;
  // socket.on('searchedContactRequest', (res) => {
  //   console.log('ewa', res);
  //   // if(!res.contactRequestPending)
  //   // {
  //   //   setPending(false);
  //   // }
  // });

  /* 
    * CREATE submitHandler FUNCTION TO MAKE A CLIENT EMIT CALLED sendContactRequest.
  */
  const contactRequestHandler = () => {
    socket.emit('sendContactRequest', {receiverId: user.id, senderId: senderId, action: 'sent you a friend request'});
    setIsUser(false);
  };

  const cancelContactRequestHandler = () => {
    alert('cancel');
  }

  socket.emit('searchContactRequest', {receiverId: user._id, senderId: senderId});
  /*
    * INVOKE USEFFECT HOOK TO PERFORM A CLIENT LISTEN CALLED contactRequestMessage.
    * HANDLE MAKETOAST TO MAKE AN ALERT MESSAGE TO A USER THAT SENDS A CONTACT REQUEST.
  */
  useEffect(() =>{
    
  }, [socket]);


  if(!pending)
  {
    display = <button onClick={contactRequestHandler} className={contactModalStyle.add}>ADD</button> 
  }
  // if(pending === false)
  // {
  //   display = <button onClick={cancelContactRequestHandler} className={contactModalStyle.cancel}>CANCEL</button> 
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
          <p className={contactModalStyle.name}>{user.firstName} {user.lastName}</p>
          <p className={contactModalStyle.email}>{user.email}</p>
          {display}
        </div>
      </div>
    </div>
  );
}

export default SearchUserModal;