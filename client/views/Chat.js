import React, {useContext, useEffect, useReducer, useState, useRef } from 'react';
import styleChat from '../assets/stylesheets/chat.module.css';
import {UserContext} from './WebChat';
import {SocketContext} from '../App';
import ScrollToBottom from 'react-scroll-to-bottom';

const initialState = {
    id: '',
    memberId: [],
    members: [],
    contents: []
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'PRIVATECHATROOM' : 
            return {
                id: action.id,
                membersId: action.membersId,
                members: action.members,
                contents: action.contents,
            }
        default:
            return state;
    }
}

function Chat() 
{
    const socket = useContext(SocketContext);
    const user = useContext(UserContext);
    /**
        * CLIENT LISTEN TO SERVER AN EVENT CALLED 'joinUser' FETCHING THE PRIVATE ROOM OF USERS 
        * DEVELOPER: RON SANTOS
    */
   console.log('chat user',user.id);
    const [privateChatroom, dispatch] = useReducer(reducer, initialState);
    const [messageLists, setMessageLists] = useState([]);
    useEffect(() => {
        socket.on('joinUser', (res) => {
            console.log('user', user.id)
            console.log('res',res.privateChatroom.membersId[0]);
            dispatch({
                type: 'PRIVATECHATROOM',
                id: res.privateChatroom._id,
                membersId: res.privateChatroom.membersId[0] === user.id ? res.privateChatroom.membersId[1] : res.privateChatroom.membersId[0] ,
                members: user.id === res.privateChatroom.membersId[0] ? res.privateChatroom.members[1] : res.privateChatroom.members[0] ,
                contents: res.privateChatroom.contents
            })
            setMessageLists(res.privateChatroom.contents);

        });
    }, [user]);
    
    /**
        * ADD EVENTLISTENER 'sendMessage' TO CREATE THE ROOM AUTH MESSAGE AND TIME. 
        * CLIENT EMIT TO SERVER AN EVENT CALLED 'sendMessage' SENDING THE OTHER MEMBER MESSAGE 
        * DEVELOPER: RON SANTOS
    */
    const [currentMessage, setCurrentMessage] = useState('');
    const sendMessage = async () => {
        if(currentMessage !== '')
        {
            const messageData = {
                room: privateChatroom.id,
                authorId: user.id,
                author: user.firstName,
                receipientId: privateChatroom.membersId,
                receipient: privateChatroom.members,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            }

            socket.emit('sendMessage', messageData);
            setMessageLists((list) => [...list, messageData]);
            setCurrentMessage("");

        }
    }

    /**
        * CLIENT LISTEN TO SERVER AN EVENT CALLED 'receiveMessage' FETCHING THE MESSAGE DATA FROM A SENDER 
        * DEVELOPER: RON SANTOS
    */
    useEffect(() => {
        socket.on('receiveMessage', (res) => {
            setMessageLists( res.contents)
        });
    }, [socket] )

    return (
        <>
           {
                privateChatroom && <div className={styleChat.chat}>
                <div className={styleChat.chatHeader}>
                    <img className={styleChat.img} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi3N0LBOCIWRLl7xqB5djlO0oL0PImfxJ1UiodMpb1cg&s' alt='friend' />  
                    <span>{privateChatroom.members}</span>
                </div>
                <div className={styleChat.chatBody}>
                    <ScrollToBottom className={styleChat.messageContainer}>
                        {
                            messageLists.map((messageContent) => {
                                return <>
                                    <div className={user.id === messageContent.authorId ? styleChat.you : styleChat.other}>
                                        <p className={styleChat.message}>{messageContent.message}</p>
                                        <p className={styleChat.author}>{messageContent.author}</p>
                                        <p className={styleChat.time}>{messageContent.time}</p>
                                    </div>
                                </>
                            })
                        }
                    </ScrollToBottom>
                </div>
                <div>
                    <input 
                        className={styleChat.input} type="text" 
                        placeholder='Hi'
                        value={currentMessage}
                        onChange={(e) => {
                            setCurrentMessage(e.target.value);
                        }}
                        onKeyPress={(e) => { e.key === 'Enter' && sendMessage()}} 
                        />
                </div>
            </div>
           }
            
        </>
    )
}

export default Chat
