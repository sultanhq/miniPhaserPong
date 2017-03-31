var express = require('express')
  , app = express(app)
  , server = require('http').createServer(app)
  , io = require('socket.io')(server);

app.use(express.static(__dirname));

server.listen(8000, function(){
  console.log('listening on *:8000');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('control message', function(msg){
    io.emit('control message', msg);
  });
});
