/*--------creates file directory system--------*/
let fs = require('fs');

let data = fs.readFileSync('./userPresets.json');
let words = JSON.parse(data)

let mainData = fs.readFileSync('./mainPresets.json');
let mainWords = JSON.parse(mainData)

let mainDataVotes = []
let oldDataLength = Object.keys(mainData).length;

for(let i = 0; i < oldDataLength; i++){
    mainDataVotes.push(0);
}


/*--------acceses express and listens on the localport--------*/
let express = require('express');

let app = express();
let server = app.listen(3000);

/*--------acceses socket.io and displays website files--------*/
let socket = require('socket.io');

app.use(express.static('public'));

app.get('/userPresets', sendPresets)
app.get('/mainPresets', sendMainPresets)


function sendPresets(request, response){
    response.send(words)
}

function sendMainPresets(request, response){
    response.send(mainWords)
}

let io = socket(server);

/*--------creates a connection for data to be sent and recieved--------*/
io.sockets.on('connection', newConnection);

function newConnection(socket){
    let address = socket.request.socket.remoteAddress
    console.log ('new connection @ ', socket.id, address);
   
    socket.on('userTrack1', savePreset);
    socket.on('mainTrack1', selectPreset);
    
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

    function selectPreset(data){
        if(oldDataLength < Object.keys(mainData).length){
            oldDataLength = Object.keys(mainData).length
            mainDataVotes.push(0)
            }
        
        mainDataVotes[data] += 10;

        if(mainDataVotes[data] >= 255){
            mainDataVotes[data] = 0 
            }

     let buttonVote = {index: data, voteCount: mainDataVotes[data]}
        //need to track number of votes for preset here,
        //send votes with index number
        io.emit('mainTrack1', buttonVote)
    }
}