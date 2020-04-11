import React, { Component } from 'react';
import './ChatWindow.css';
import ChatMessage from '../ChatMessage/ChatMessage.js';

class ChatWindow extends Component{

    componentWillUnmount(){
      this.props.exitChatroom();
    }

    renderMessages = (messages, user) => {
        let mes = messages.map((message, i , arr) => {
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
            } else return <ChatMessage message ={message} user={user} className='' key={i}/>;
        });
        
        return mes;
    }

    render(props){
        return (
        <div className='window-container'>
         <section className='columns is-centered flex'>
          <div className='column title-div'>
            <h1 className='title has-text-white-ter has-text-weight-light'>
              {this.props.chatroomName}
            </h1>
            <p className="subtitle">
            </p>
          </div>
        </section>
        
        <section className='columns'>
              <div className="chat-display column is-6 is-offset-3">
                {this.renderMessages(this.props.messageList, this.props.user.username)}
              </div>

        </section>

          <section className='columns'>

                <form className='this column is-6 is-offset-3 is-paddingless' onSubmit={this.props.submitHandler}>

                        <label></label> 
                        <input
                          className='input'
                          type='text' 
                          name="messageinput" 
                          onChange={this.props.inputChangeHandler}
                          value={this.props.inputFieldContents || ''}
                      />
                  </form>
            </section>

            </div>


        );
    }
}

export default ChatWindow;