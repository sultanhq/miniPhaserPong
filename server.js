//

var express = require('express')
  , app = express(app)
  , server = require('http').createServer(app)
  , io = require('socket.io')(server);



// serve static files from the current directory
app.use(express.static(__dirname));


server.listen(8000, function(){
  console.log('listening on *:8000');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
