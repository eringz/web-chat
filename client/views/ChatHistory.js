import React, { useContext, useEffect, useState } from 'react'
import chatHistoryStyle from '../assets/stylesheets/chatHistory.module.css';
import {UserContext} from './WebChat';
import {SocketContext} from '../App';
import makeToast from '../Toaster';

function ChatHistory() {
    const socket = useContext(SocketContext);
    const user = useContext(UserContext);

    /**
        * CLIENT EMIT TO SERVER AN EVENT CALLED 'getPrivateChatrooms' REQUESTING THE DATA FROM SERVER OF EXISTING PRIVATE CHATROOMS .
        * DEVELOPER: RON SANTOS
    */
    const [privateChatroomLists, setPrivateChatroomLists] = useState([]);
    useEffect(() => {
        socket.emit('getPrivateChatrooms', user.id);
    }, [socket]);

    /**
        * CLIENT LISTEN TO SERVER AN EVENT CALLED 'privateChatroomLists' OF FETCH DATA OF ALL EXISTING CHATOOMS.
        * DEVELOPER: RON SANTOS
    */
    useEffect(() => {
        socket.on('privateChatroomLists', (res) => {
            setPrivateChatroomLists(res);
        });
    }, [socket]);

    /**
        * ADD EVENTLISTENER CALLED 'roomHandler' IN PREPARATION OF 'joinRoom' CLIENT EMIT REQUEST.
        * CLIENT EMIT TO SERVER AN EVENT CALLED 'joinRoom' OF AN EXISTING CHATROOM WITH A MEMBER OF TARGET USER.
        * DEVELOPER: RON SANTOS
    */
    const roomHandler = (e) => {
        e.preventDefault();
        makeToast('info', e.target.id.value);
        socket.emit('joinRoom', e.target.id.value)
    }

    console.log('pcrlists:', privateChatroomLists);
    return (
        <>
            <div className={chatHistoryStyle.header}>Chats</div>
            {
                privateChatroomLists && (privateChatroomLists.map((privateChatroom) => {
                    return <form onClick={roomHandler} className={chatHistoryStyle.message}>
                        <input type="hidden" name="id" value={privateChatroom._id} />
                        <img className={chatHistoryStyle.img}  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi3N0LBOCIWRLl7xqB5djlO0oL0PImfxJ1UiodMpb1cg&s' alt='friend'></img>
                        <div>
                            <p className={chatHistoryStyle.friend}>{user.id ===  privateChatroom.membersId[0] ? privateChatroom.members[1] : privateChatroom.members[0]}</p>
                            <p className={chatHistoryStyle.content}>{privateChatroom.contents[privateChatroom.contents.length-1].author}: {privateChatroom.contents[privateChatroom.contents.length-1].message}</p>
                        </div>
                    </form>
                }))
            }
        </>
    )
}

export default ChatHistory
