import React from 'react'
import notificationStyle from '../assets/stylesheets/notificationStyle.module.css';
import friendRequestPhoto from '../assets/img/ron.jpg'

function Notification() {
  return (
    <>
      <div className={notificationStyle.header}>Notifications</div>
        <div className={notificationStyle.message}>
          <img className={notificationStyle.img} src={friendRequestPhoto} alt='friend'></img>
          <div>
              <p className={notificationStyle.content}><span>John Ronald Santos</span>  sent you a friend requesst</p>
              <div>
                <button className={notificationStyle.confirm}>Confirm</button>
                <button className={notificationStyle.delete}>Delete</button>
              </div>
          </div>
      </div>
    </>
  )
}

export default Notification
