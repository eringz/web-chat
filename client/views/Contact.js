import React, { useState, useEffect, useContext, useRef  } from 'react';
import contactStyle from '../assets/stylesheets/contact.module.css';
import SearchModal from './SearchModal';
import { GrAdd } from "react-icons/gr";
import friendPhoto from  '../assets/img/ron.jpg';
import {UserContext} from './WebChat';
import {SocketContext} from '../App';
import makeToast from '../Toaster';

function Contact() {

  const socket = useContext(SocketContext);
  const user = useContext(UserContext);
  let shouldLog = useRef(true);

  useEffect(() => {
    socket.emit('searchContacts', user.id);
  }, [socket]);
  

  const [contacts, setContacts] = useState([])
  useEffect(() => {
    if(shouldLog)
    {
      shouldLog = false;
      socket.on('contacts', (res) => {
        setContacts(res);
      });
    }
  }, [socket]);

  console.log('contacts id:', contacts);

  const contactHandler = (e) => {
    e.preventDefault();
    
    makeToast('info', e.target.id.value);
  }


  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div className={contactStyle.id}>
        Contact 
        <span onClick={() => {setModalOpen(true)}} className={contactStyle.span}><GrAdd size="30" /></span>
      </div>
      
      {/* <p>Online</p> */}
      {
        contacts.map((contact) => {
          return<form onClick={contactHandler} className={contactStyle.contact}>
            <input type="hidden" name="id" value={contact._id} />
            <img className={contactStyle.img} src={friendPhoto} alt='friend'></img>
            <p className={contactStyle.friend}>{contact.firstName} {contact.lastName}</p>
          </form>
        })
      }
      
      {modalOpen && <SearchModal setOpenModal={setModalOpen} />}
    </>
  )
}

export default Contact
