/*--------creates file directory system--------*/
let fs = require('fs');

var data = fs.readFileSync('./userPresets.json');
let words = JSON.parse(data)


/*--------acceses express and listens on the localport--------*/
let express = require('express');

let app = express();
let server = app.listen(3000);

/*--------acceses socket.io and displays website files--------*/
let socket = require('socket.io');

app.use(express.static('public'));

app.get('/userPresets', sendPresets)

function sendPresets(request, response){
    response.send(words)
}

let io = socket(server);

/*--------creates a connection for data to be sent and recieved--------*/
io.sockets.on('connection', newConnection);

function newConnection(socket){
    let address = socket.request.socket.remoteAddress
    console.log ('new connection @ ', socket.id, address, 
                address.address, ":", address.port);
   
    socket.on('track1', savePreset);
    
    function savePreset(data){
        let newPreset = data
        fs.readFile('./userPresets.json', append)
        
        function append(err, oldData){
            let json = JSON.parse(oldData)
            let newKey = Object.keys(json).length + 1
            console.log(newPreset)
            json[newKey] = newPreset
            words = json
           // console.log(json)
            newJSON = JSON.stringify(json, null, 2)
            fs.writeFile('./userPresets.json', newJSON, finished)
            
            function finished(err){
                console.log('got it!')
            }
        };
        
 
    }
}