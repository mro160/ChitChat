import io from "socket.io-client";
let socket = io('ws://localhost:3001', 
{ 
    path: "/sockets", 
    transports : ["websocket"] 
});

export default socket;