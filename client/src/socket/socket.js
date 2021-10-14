import io from "socket.io-client";

const url = process.env.REACT_APP_API || window.location.host
let socket = io(url, 
{ 
    path: "/sockets", 
    transports : ["websocket"] 
});

export default socket;