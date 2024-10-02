const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serving index.html from the main directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// Handling socket connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a specific room
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        socket.to(roomId).emit('userJoined', socket.id);});

    // Handle drawing event
    socket.on('drawing', (data) => {
        socket.to(data.roomId).emit('drawing', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Server listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
