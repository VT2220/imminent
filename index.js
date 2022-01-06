const express = require('express');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();

const server = createServer(app);
const io = new Server(server);

const users = {};
const rooms = {};
// when user connects to socket server -> instance of socket is created for him
io.on('connection', (socket) => {
  socket.on('joined room', ({ roomId, user }) => {
    const userObj = {
      socketId: socket.id,
      ...user,
    };
    if (users[roomId]) {
      users[roomId].push(userObj);
    } else {
      users[roomId] = [userObj];
    }
    rooms[socket.id] = roomId;
    const allusers = users[roomId].filter(
      (data) => data.socketId !== socket.id
    );
    socket.emit('all users', allusers);
  });

  socket.on('sending signal', (payload) => {
    io.to(payload.userToSignal.socketId).emit('somebody joined', {
      signal: payload.signal,
      caller: payload.caller,
    });
  });

  socket.on('returning signal', (payload) => {
    io.to(payload.caller.socketId).emit('receiving returned signal', {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on('disconnect', () => {
    console.log('------------');
    console.log('Disconnected');
    const roomId = rooms[socket.id];
    let roomsUser = users[roomId];
    if (roomsUser) {
      roomsUser = roomsUser.filter((user) => user.socketId !== socket.id);
      users[roomId] = roomsUser;
    }
    if (users[roomId] && users[roomId].length === 0) {
      delete users[roomId];
    }
    delete rooms[socket.id];
    socket.broadcast.emit('somebody left', socket.id);
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
  });
}

const port = process.env.PORT || 8000;
server.listen(port, () =>
  console.log(`Server is up and running on port ${port}...`)
);
