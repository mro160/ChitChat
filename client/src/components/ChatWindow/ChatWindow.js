import React, { useEffect, useState } from 'react';
import './ChatWindow.css';
import ChatMessage from '../ChatMessage/ChatMessage.js';
import { getMessages, sendMessage } from '../../room-helpers/roomhelper';


const ChatWindow = ({user, chatroom, socket}) => {
  const [messageInput, setMessageInput] = useState('')
  const [messageList, setMessageList] = useState([])

  useEffect(() => {
    socket.on('chat message', (message) => {
        setMessageList(messageList => [message, ...messageList])
      });
      
      return () => socket.off('chat message')
  }, [socket])

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(chatroom.chatroom_id)
      setMessageList(messages)
    }
    
    fetchMessages()
  }, [chatroom])

  const submitHandler = async (event) => {
    event.preventDefault()
    if (messageInput === '') return;
      const message = {
        "username": user.username,
        "id": user.id,
        "chatroom_id": chatroom.chatroom_id,
        "content": messageInput,
        "date_created": Date.now()
      }

      try {
        socket.emit('chat message', message.username, message.content, chatroom.name, message.date_created)
        sendMessage(message)
        setMessageInput('')
      } catch (err){
        console.log(err)
      }
  }

  const renderMessages = (messages, user) => {
    let mes = messages.map((message ,i, arr) => {
        if (i === arr.length -1){
           return (<React.Fragment key={i}>
            <ChatMessage message={message} user={user} className='' />
            <div className='column is-offset-5'>{new Date(message.date_created).toDateString()}</div>  
            </React.Fragment>);
        }

        if (arr[i + 1] !== undefined && new Date(message.date_created).toDateString() !== new Date(arr[i + 1].date_created).toDateString()) {
          return (<React.Fragment key={i}>
            <div className='column is-offset-5'>{new Date(message.date_created).toDateString()}</div>
              <ChatMessage message ={message} user={user} className='' />
            </React.Fragment>);
        } else return <ChatMessage message={message} user={user} className='' key={i}/>;
    });
    
    return mes;
  }

  return (
    <div className='window-container animate__animated animate__fadeIn'>
     <section className='columns is-centered flex'>
      <div className='column title-div'>
        <h1 className='title has-text-white-ter has-text-weight-light'>
          {chatroom.name}
        </h1>
        <p className="subtitle">
        </p>
      </div>
    </section>
    
    <section className='columns'>
          <div className="chat-display box column is-9">
            {renderMessages(messageList, user.username)}
          </div>

    </section>

      <section className='columns'>

            <form className='message-box column is-9 is-paddingless' onSubmit={submitHandler}>

                    <label></label> 
                    <input
                      className='input'
                      type='text' 
                      name="messageinput" 
                      onChange={(e) => setMessageInput(e.target.value)}
                      value={messageInput || ''}
                  />
              </form>
        </section>

        </div>


    );
} 


export default ChatWindow;