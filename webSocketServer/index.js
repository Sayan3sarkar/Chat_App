const http = require('http');
const webSocketServer = require('websocket').server;
const webSocketServerPort = 8000;

// Creating and starting server
const server = http.createServer();
server.listen(webSocketServerPort);
console.log(`Server listening on port ${webSocketServerPort}`);

const wsServer = new webSocketServer({
    httpServer: server
});

const clients = {};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

wsServer.on('request', request => {
    const userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new request from ' + request.origin);

    //Accept the request and create a connection based on the request
    const connection = request.accept(null, request.origin);
    // Store the created connection in the clients object at the index of the unique UserID
    clients[userID] = connection;
    // console.log(clients[userID]);
    console.log('Connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

    // The following method is triggered whenever server recieves any message
    connection.on('message', message => {
        if (message.type === 'utf8') {
          console.log('Received Message: ', message.utf8Data);
    
          // broadcasting message to all connected clients
          for(key in clients) {
            // console.log(clients[key]);
            clients[key].sendUTF(message.utf8Data);
            // console.log(message.utf8Data);
            console.log('sent Message to: ', clients[key]);
          }
        }
      })
});