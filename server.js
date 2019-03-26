/*--------acceses express and listens on the localport--------*/
let express = require('express');

let app = express();
let server = app.listen(3000);

/*--------acceses socket.io and displays website files--------*/
let socket = require('socket.io')

app.use(express.static('public'));

let io = socket(server);

/*--------creates file directory system--------*/
let fs = require('fs');

var data = "New File Contents1";

fs.appendFile("temp.txt", data, function(err, data) {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});

/*--------creates a connection for data to be sent and recieved--------*/
io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log ('new connection @ ', socket.id);
    socket.on('track1', up);

    function up(data){
        socket.broadcast.emit('track1', data)
        console.log(data);
    }
}