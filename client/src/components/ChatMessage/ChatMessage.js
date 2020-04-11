import React from 'react';
import './ChatMessage.css';

const ChatMessage = (props) => {
  let time = new Date(props.message.date_created);

  if (props.message.username === props.user){
    return (
        <div className='outgoing' >
        <div className=''>{props.message.username}</div>
        
        <div className="box has-background-link has-text-light chat-bubble is-paddingless">
        <div className='txt' key={props.message.id}>
          {props.message.content}   
        </div>
         <div className='txt'>
              {time.toLocaleString([], {hour: 'numeric', minute:'2-digit'})}
          </div>
        </div> 

      </div>
    );
  } else return (
    <div className='incoming-message' key={props.message.id}>
        <div className='incoming'>{props.message.username}</div>
        
        <div className="box has-background-grey has-text-light chat-bubble is-paddingless">
        <div className='txt'>
          <div className='' key={props.message.id}> {props.message.content}</div>   
        </div>

         <div className='incoming txt'>
              {time.toLocaleString([], {hour: 'numeric', minute:'2-digit'})}
          </div>
        </div> 

      </div>
  );
}

export default ChatMessage;