// index.js  用来创建 node 服务
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('webviewEvent', (msg) => {
        console.log('webviewEvent: ' + msg);
        io.emit('webviewEvent', msg);
        // socket.broadcast.emit('chat message', msg);
    });
    socket.on('webviewEventCallback', (msg) => {
        console.log('webviewEventCallback: ' + msg);
        io.emit('webviewEventCallback', msg);
    });
})


server.listen(9527, () => {
    console.log('listening on 9527')
})