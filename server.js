var express = require('express'),
  app = express(app),
  server = require('http').createServer(app),
  io = require('socket.io')(server);

app.use(express.static(__dirname));

server.listen(8000, '0.0.0.0', function() {
  console.log('listening on *:8000');
});

io.on('connection', function(socket) {
  console.log('a user connected ' + socket.id);

  socket.on('disconnect', function() {
    console.log('user disconnected');
    io.emit('disconnect', socket.id);
  });

  socket.on('join', function(data){
    io.emit('join', data)
  });

  socket.on('available', function(msg) {
    io.emit('available', msg);
  });

  socket.on('Lcontrol message', function(msg) {
    io.emit('Lcontrol message', msg);
  });

  socket.on('Rcontrol message', function(msg) {
    io.emit('Rcontrol message', msg);
  });

  socket.on('score', function(msg) {
    io.emit('score', msg);
  });

  socket.on('winner', function(msg) {
    io.emit('winner', msg);
  });

  socket.on('newGame', function(msg) {
    io.emit('newGame', msg);
  });

});
