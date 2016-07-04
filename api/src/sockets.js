import Socketio from 'socket.io';

const io = new Socketio();

io.on('connection', function(socket) {
  console.log('socket connected.');

  socket.on('report/add', function(data) {
    console.log('FROM SOCKET: report added!');
  })
})

export default io;
