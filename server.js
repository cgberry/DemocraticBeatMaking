/*--------creates file directory system--------*/
let fs = require('fs');

var data = fs.readFileSync('./presets.json');
let words = JSON.parse(data)

//Work on router and watch Programming with Text 8.3

// fs.appendFile("temp.txt", data, function(err, data) {
//   if (err) console.log(err);
//   console.log("Successfully Written to File.");
// });

/*--------acceses express and listens on the localport--------*/
let express = require('express');

let app = express();
let server = app.listen(3000);

/*--------acceses socket.io and displays website files--------*/
let socket = require('socket.io');

app.use(express.static('public'));

app.get('/presets', sendPresets)

function sendPresets(request, response){
    response.send(words)
}

let io = socket(server);

/*--------creates a connection for data to be sent and recieved--------*/
io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log ('new connection @ ', socket.id);
    socket.on('track1', savePreset);

    function savePreset(data){
        let newPreset = data
        fs.readFile('./presets.json', append)
        
        function append(err, oldData){
            let json = JSON.parse(oldData)
            let newKey = Object.keys(json).length + 1
            console.log(newPreset)
            json[newKey] = newPreset
            words = json
           // console.log(json)
            newJSON = JSON.stringify(json, null, 2)
            fs.writeFile('./presets.json', newJSON, finished)
            
            function finished(err){
                console.log('got it!')
            }
        };
        
 
    }
}