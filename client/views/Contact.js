import React, { useState } from 'react';
import Modal from './Modal';
import contactStyle from '../assets/stylesheets/contact.module.css';
import { GrAdd } from "react-icons/gr";
import friendPhoto from  '../assets/img/ron.jpg';

function Contact() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className={contactStyle.header}>
        Contact 
        <span onClick={() => {setModalOpen(true)}} className={contactStyle.span}><GrAdd size="30" /></span>
      </div>
      <p>Online</p>
      <div className={contactStyle.contact}>
        <img className={contactStyle.img} src={friendPhoto} alt='friend'></img>
        <p className={contactStyle.friend}>John Ronald Santos Friend</p>
      </div>
      {modalOpen && <Modal setOpenModal={setModalOpen} />}
    </>
  )
    
}

export default Contact
