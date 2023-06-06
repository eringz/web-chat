import React from "react";
import contactModalStyle from "../assets/stylesheets/contactModal.module.css";
import friendImg from '../assets/img/ron.jpg'
import { AiFillCloseCircle } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";

function Modal({ setOpenModal }) {
  return (
    <div className={ contactModalStyle.modalBackground}>
      <div className={contactModalStyle.modalContainer}>
        <div className={contactModalStyle.titleCloseBtn}>
          <button className={contactModalStyle.button}
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <AiFillCloseCircle />
          </button>
        </div>
        
        <div className="title">
            <form>
            <input  className={contactModalStyle.input} type='email' placeholder="Email address" />
            <button className={contactModalStyle.search} type='submit'><BsSearch size="30" /></button>
            </form>
        </div>
        <div className="body">
            <img className={contactModalStyle.img} src={friendImg} alt='friend' />
            <p className={contactModalStyle.name}>John Ronald Santos</p>
            <p className={contactModalStyle.email}>ron.garcia.santos@gmail.com</p>
            <button className={contactModalStyle.add}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;