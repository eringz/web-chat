import React, { useState, useEffect, useRef } from 'react'
import notificationStyle from '../assets/stylesheets/notificationStyle.module.css';
import friendRequestPhoto from '../assets/img/ron.jpg'
// import axios from 'axios';
// import makeToast from '../Toaster';

function Notification({socket, id}) {
  // const [notificationList, setNotificationList] = useState([]);
  
  let shouldLog = useRef(true);

  useEffect(() => {
    const receiverId = id;
    console.log('notification page', receiverId);
    socket.on('receiveNotification', (res) => {
      console.log('receive ', res);
    });
  }, [socket])
  
  



  // if(shouldLog)//
  // {
  // axios.get('http://localhost:8888/notification/display', {
  //   receiverId
  // })
  //   .then((response) => {

  //     makeToast('success', response.data.message)
  //     console.log(response.data);
  //     socket.emit('notifications', response.data.notifications);
     
  //   })
  //   .catch((err) => {
  //     if(err && 
  //       err.response && 
  //       err.response.data && 
  //       err.response.data.message
  //     )
  //       makeToast('error', err.response.data.message);
  //       console.log(err);
  //   });
  //   }//


  return (
    <>
      <div className={notificationStyle.header}>Notifications</div>
        <div className={notificationStyle.message}>
          <img className={notificationStyle.img} src={friendRequestPhoto} alt='friend'></img>
          <div>
              <p className={notificationStyle.content}><span>John Ronald Santos</span>  sent you a friend request</p>
              <div>
                <button className={notificationStyle.confirm}>Confirm</button>
                <button className={notificationStyle.delete}>Delete</button>
              </div>
          </div>
      </div>
      {/* <div>{notificationList.map((notification) => {
         <h1 key={notification.id}>{notification.senderId}</h1>
      })}</div> */}
    </>
  )
}

export default Notification
