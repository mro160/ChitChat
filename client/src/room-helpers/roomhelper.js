const handleInputChange = (event, updateState) =>{
    updateState(event.target.value);
}

const getUserRooms = async (userId) => {
    try {
        const response = await fetch(`/users/${userId}/chatrooms`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
        const rooms = await response.json()
        return rooms 
    }catch(err){
        console.log(err)
    }
}

const getSubscribedRooms = async (userId) =>{
    try {
        const response = await fetch(`/users/${userId}/subscriptions`, {
            method: 'GET',
            // headers: {'Content-Type': 'application/json'}
        })
        const rooms = await response.json()
        return rooms 
    }catch(err){
        console.log(err)
    }
}

const roomSearch = async (creator, room_name) => {
    try{
    const response = await fetch(`/users/${creator}/chatrooms/${room_name}`,  {
          method : 'GET',
          headers: {'Content-Type' : 'application/json'},
      })
    const data = await response.json()
    let results = [];
    if (Object.keys(data).length === 0){
        return []
    } else {
        let room = {
            "name": room_name,
            "creator": creator,
            "chatroom_id": data.chatroom_id,
        };
            results.push(room);
    }
    return results;
    } catch(err){
        console.log(err)
        return [];
    } 
        // this.setState({
        //   searchChatResults: results,
        //   roomSearchInput: '',
        //   roomCreatorInput: ''
        // });
}

const createRoom = async (room) => {
    try{
        const response = await fetch(`/users/${room.creator_id}/chatrooms`,  {
          method : 'POST',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({
              'chatroom_name': room.room_name,
          })
      })
      const newRoom = await response.json()
      return newRoom
    } catch (err) {
        console.log(err)
    } 
}


const subscribe = async (roomId, userId) => {
    try {
        const response = await fetch(`/chatrooms/${roomId}/subscriptions`,  {
            method : 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                'user_id': userId,
            })
        })
        const room = await response.json()
        return room
    } catch (err) {
        return null
    }    
}



const deleteRoom = async (roomId) => {
    try {
       await Promise.all([
         //delete all user subscriptions to chatroom
         fetch(`/chatrooms/${roomId}/subscriptions`,  {
                 method : 'DELETE',
                 headers: {'Content-Type' : 'application/json'},
         }),
 
         //delete all chatroom messages
         fetch(`/chatrooms/${roomId}/messages`,  {
                 method : 'DELETE',
                 headers: {'Content-Type' : 'application/json'},
         }),
 
         //delete chatroom
         fetch(`/chatrooms/${roomId}`,  {
                 method : 'DELETE',
                 headers: {'Content-Type' : 'application/json'},
         })
       ]);
    } catch(err) {
         console.log(err);
       }
   }

const deleteSubscription = async (roomId, userId) =>{
    try {
        const response = await fetch(`/users/${userId}/subscriptions/chatrooms/${roomId}`,  {
             method : 'DELETE',
             headers: {'Content-Type' : 'application/json'},
        })
        return response
    } catch (err){
        console.log(err)
    }
 }


const sendMessage = async (message) => { 
    //post message to db then emit
    try{
        await fetch(`/chatrooms/${message.chatroom_id}/messages`,  {
            method : 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                "id": message.id, 
                "chatroom_id": message.chatroom_id,
                "content": message.content, 
                "date_created": message.date_created, 
            })
        })
    } catch(err){
        console.log(err)
    }
}

const getMessages = async (roomId) => {
    const response = await fetch(`/chatrooms/${roomId}/messages`,  {
        method : 'GET',
        headers: {'Content-Type' : 'application/json'},
    })

    const messages = await response.json()
    return messages
}

export { handleInputChange , 
        roomSearch, 
        createRoom ,
        subscribe,
        deleteRoom,
        deleteSubscription,
        getMessages,
        sendMessage,
        getUserRooms,
        getSubscribedRooms
    }