import React, {useState} from "react";

import contactModalStyle from "../assets/stylesheets/contactModal.module.css";
import friendImg from '../assets/img/ron.jpg'
import { AiFillCloseCircle } from "react-icons/ai";


function SearchUserModal({ setIsUser, searchId, searchFirstName, searchLastName, searchEmail }) {
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
          <p className={contactModalStyle.name}>{searchFirstName} {searchLastName}</p>
          <p className={contactModalStyle.email}>{searchEmail}</p>
          <button className={contactModalStyle.add}>Add</button> 
        </div>
      </div>
    </div>
  );
}

export default SearchUserModal;