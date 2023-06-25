import React, { useState, useEffect, useContext, useRef  } from 'react';
import contactStyle from '../assets/stylesheets/contact.module.css';
import SearchModal from './SearchModal';
import { GrAdd } from "react-icons/gr";
import {UserContext} from './WebChat';
import {SocketContext} from '../App';
import makeToast from '../Toaster';

function Contact() {

  const socket = useContext(SocketContext);
  const user = useContext(UserContext);
  let shouldLog = useRef(true);
  const [modalOpen, setModalOpen] = useState(false);

  /**
    * CLIENT EMIT TO SERVER AN EVENT CALLED 'joinRoom' OF AN EXISTING CHATROOM WITH A MEMBER OF TARGET USER.
    * DEVELOPER: RON SANTOS
  */
  useEffect(() => {
    socket.emit('searchContacts', user.id);
  }, [socket]);
  
  /**
    * CLIENT LISTEN TO SERVER WITH AN EVENT CALLED 'contacts' TO FETCH CONTACTS OF A USER FROM SERVER.
    * DEVELOPER: RON SANTOS
  */
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

  /**
    * CLIENT EMIT TO SERVER WITH AN EVENT CALLED 'createRoom' PASSING USER ID AND TARGET ID AS PARAMETERS.
    * DEVELOPER: RON SANTOS
  */
  const contactHandler = (e) => {
    e.preventDefault();
    socket.emit('createRoom', [user.id, e.target.id.value]);
  }

  return (
    <>
      <div className={contactStyle.id}>
        <p>Contact </p>
        <span onClick={() => {setModalOpen(true)}} className={contactStyle.span}><GrAdd size="30" /></span>
      </div>
      {
        contacts.map((contact) => {
          return<form onClick={contactHandler} className={contactStyle.contact}>
            <input type="hidden" name="id" value={contact._id} />
            <img className={contactStyle.img}  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi3N0LBOCIWRLl7xqB5djlO0oL0PImfxJ1UiodMpb1cg&s' alt='friend'></img>
            <p className={contactStyle.friend}>{contact.firstName} {contact.lastName}</p>
          </form>
        })
      }
      {modalOpen && <SearchModal setOpenModal={setModalOpen} />}
    </>
  )
}

export default Contact
