const express = require('express')
const { v4: uuidv4} = require('uuid')

const app = express()
const path = require('path');
const httpServer = require('http').createServer(app)

const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

app.use(express.static(path.join(__dirname, '../client/dist')))

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '../client/dist', "index.html"))
})


io.on('connection', (socket)=>{
    console.log(`User ${socket.id} connected`)

    socket.on('disconnect', ()=>{
        const roomId = socket.gameroom

        socket.to(roomId).emit('player-left')
        console.log(roomId)

        console.log(`Socket disconnected: ${socket.id}`)
    })

    socket.on('create-room', (cb)=>{
        const roomId = uuidv4()

        socket.join(roomId)

        socket.gameroom = roomId
        cb(roomId)
    })

    socket.on('join-room', (roomId, cb) => {
        const room = io.sockets.adapter.rooms.get(roomId);
    
        if (room && room.size < 2) {
            socket.join(roomId);
            io.to(roomId).emit('room-joined');
            socket.gameroom = roomId
            setTimeout(()=>socket.to(roomId).emit('setup-game'), 2000)
            cb({ success: true });
        } else {
            cb({ success: false, message: "Unable to join room" });
        }
    });

    socket.on('leave-room', (roomId)=>{
        socket.leave(roomId)
        socket.gameroom = null
    })

    socket.on('setup-game', (length)=>{
        const room = Array.from(socket.rooms)[1];

        let index1 = Math.floor(Math.random() * (length - 0 + 1)) + 0;
        let index2 = index1;

        while (index1 === index2) {
            index2 = Math.floor(Math.random() * (length - 0 + 1)) + 0;
        }

        io.to(socket.id).emit('start-game', {'you': index1, 'opponent': index2, 'turn': true})
        socket.to(room).emit('start-game', {'you': index2, 'opponent': index1, 'turn': false})
    })

    socket.on('toogle-turn', (gameSate)=>{
        const room = Array.from(socket.rooms)[1]

        socket.to(room).emit('toogle-turn', gameSate)
    })
})

httpServer.listen(3000, ()=>{
    console.log('Server is running on http://localhost:3000')
})