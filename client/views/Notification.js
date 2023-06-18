import React, { useState, useEffect, useContext, useReducer } from 'react'
import notificationStyle from '../assets/stylesheets/notificationStyle.module.css';
import friendRequestPhoto from '../assets/img/ron.jpg';
import {SocketContext} from '../App';
import {UserContext} from './WebChat';
import makeToast from '../Toaster';

const initialState = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
}

const reducer = (state, action) => {
  switch (action.type) {
      case 'USER' : 
          return {
              id: action.id,
              firstName: action.firstName,
              lastName: action.lastName,
              email: action.email,
          }
      default:
          return state;
  }
}

function Notification() {
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);

  const [ u, dispatch] = useReducer(reducer, initialState); 
  const [isTrue, setIsTrue] = useState(false)

  useEffect(() => {
    socket.on('notification', (res) => {
      console.log('notification response:', res);
      if(res.user !== null)
      {
        dispatch({
          type:"USER",
          id: res.user._id,
          firstName: res.user.firstName,
          lastName: res.user.lastName,
          email: res.user.email
        })
        setIsTrue(true);
      }
      else
      {
        setIsTrue(false);
      }
      
    })
  }, [socket]);

  /**
    * CLIENT EMIT TO SERVER EVENT CALLED 'getNotifications' TO GET USER'S NOTIFICATION LISTS
    * DEVELOPER: RON SANTOS
  */
 useEffect(() => {
    socket.emit('getNotifications', user.id); 
  }, [socket]);

  /**
    * CLIENT LISTEN TO SERVER EVENT CALLED 'notifications' TO STORE TO 'notificationLists' VARIABLE
    * DEVELOPER: RON SANTOS
  */
  const [notificationLists, setNotificationLists] = useState([]);
  useEffect(() => {
    socket.on('notifications', (res) => {
        console.log(res);
        setNotificationLists(res);
    });
  }, [socket]);

  console.log('notification list', notificationLists);
  
  /**
    * SET EVENT LISTENER CALLED 'confirmHandler' HAVE CLIENT EMIT CALLED 'confirmContactRequests'
    * DEVELOPER: RON SANTOS
  */
  const confirmHandler = (e) => {
    socket.emit('cContactRequest', [user.id, e.target.value ]);
    makeToast('info', 'You confirm a contact request');
  }

  /**
    * CLIENT LISTEN EVENT CALLED 'confirmedContactRequest' AND STORE IN NOTIFICATION LISTS THE RESULT CONFIRMED CONTACT REQUEST.
    * DEVELOPER: RON SANTOS
  */
  useEffect((res) => {
    socket.on('confirmedContactRequest', (res) => {
      setNotificationLists(res);
    });
  }, [socket ]);

  /**
    * SET EVENT LISTENER CALLED 'rejecthandler' HAVE CLIENT EMIT CALLED 'rejectContactRequest'.
    * DEVELOPER: RON SANTOS
  */
  const rejecthandler = (e) => {
    socket.emit('rejectContactRequest', [user.id, e.target.value ]);
    makeToast('info', 'You reject a contact request');
  }

  /**
    * CLIENT LISTEN EVENT CALLED 'rejectedContactRequests' AND STORE IN NOTIFICATION LISTS THE RESULT OF REJECTED CONTACT REQUEST.
    * DEVELOPER: RON SANTOS
  */
  useEffect((res) => {
    socket.on('rejectedContactRequests', (res) => {
      setNotificationLists(res);
    });
  }, [socket]);


  return (
    <>
      <div className={notificationStyle.header}>Notifications</div>
      {
        isTrue ? (
          <div className={notificationStyle.message}>
            {/* <input type="hidden" name="userId" value={u._id} /> */}
            <img className={notificationStyle.img} src={friendRequestPhoto} alt='friend'></img>
            <div>
                <p className={notificationStyle.content}><span>{u.firstName} {u.lastName}</span>  sent you a friend request</p>
                <div>
                  <button
                    onClick={confirmHandler} 
                    type="submit"
                    value={u._id}
                    className={notificationStyle.confirm}>
                    Confirm
                  </button>
                  <button 
                    onClick={rejecthandler}  
                    type="submit" 
                    value={u._id} 
                    className={notificationStyle.delete}>
                    REJECT
                  </button>
                </div>
            </div>
          </div>
        ) : (<p></p>)
      }
      
      { notificationLists &&
        (notificationLists.map((notificationUser) => {
          return <div className={notificationStyle.message}>
            <input type="hidden" name="userId" value={notificationUser._id} />
            <img className={notificationStyle.img} src={friendRequestPhoto} alt='friend'></img>
            <div>
                <p className={notificationStyle.content}><span>{notificationUser.firstName} {notificationUser.lastName}</span>  sent you a friend request</p>
                <div>
                  <button
                    onClick={confirmHandler} 
                    type="submit"
                    value={notificationUser._id}
                    className={notificationStyle.confirm}>
                    Confirm
                  </button>
                  <button 
                    onClick={rejecthandler}  
                    type="submit" 
                    value={notificationUser._id} 
                    className={notificationStyle.delete}>
                    REJECT
                  </button>
                </div>
            </div>
          </div>
        }))
      }
    </>
  )
}

export default Notification
