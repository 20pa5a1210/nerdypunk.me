const express = require('express')
const server = require('http').createServer();
const app = express();

app.get("/", function(req, res) {
    res.sendFile("index.html", { root: __dirname })
})

server.on('request', app)
server.listen(3001, function() { console.log("server running on port 3001") })

const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
    const numClient = wss.clients.size;
    console.log("connected clients", numClient);

    wss.broadcast(`current vistors ${numClient}`);

    if (ws.readyState === ws.OPEN) {
        ws.send("Welcome to my server")
    }

    ws.on('close', function() {
        wss.broadcast(`current vistors ${numClient}`);
        console.log("a client disconnected")
    })
})

wss.broadcast = function broadcast(data) {
   wss.clients.forEach(function each(client){
       client.send(data)
   }) 
}
