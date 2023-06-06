import React from 'react'
import chatHistoryStyle from '../assets/stylesheets/chatHistory.module.css';
import friendPhoto from '../assets/img/ron.jpg';

function ChatHistory() {
    return (
        <>
            <div className={chatHistoryStyle.header}>Chats</div>
            <div className={chatHistoryStyle.message}>
                <img className={chatHistoryStyle.img} src={friendPhoto} alt='friend'></img>
                <div>
                    <p className={chatHistoryStyle.friend}>Name of friends in chatroom</p>
                    <p className={chatHistoryStyle.content}>Message ..........................</p>
                </div>
            </div>

        </>
    )
}

export default ChatHistory
