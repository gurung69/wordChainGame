const express = require('express')
const { socket } = require('../src/socket')
const { v4: uuidv4} = require('uuid')

const app = express()
const httpServer = require('http').createServer(app)

const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket)=>{
    console.log(`User ${socket.id} connected`)

    socket.on('create-room', (cb)=>{
        const roomId = uuidv4()

        socket.join(roomId)
        cb(roomId)
    })

    socket.on('join-room', (roomId, cb) => {
        const room = io.sockets.adapter.rooms.get(roomId);
    
        if (room) {
            socket.join(roomId);
            io.to(roomId).emit('room-joined');
            socket.to(roomId).emit('create-gameIndex', socket.id);
            cb({ success: true });
        } else {
            cb({ success: false, message: "Room does not exist." });
        }
    });

    socket.on('gameIndex', playerIndex=>{
        const room = Array.from(socket.rooms)[1];

        io.to(room).emit('gameIndex', playerIndex)
    })
})

httpServer.listen(3000, ()=>{
    console.log('Server is running on http://localhost:3000')
})