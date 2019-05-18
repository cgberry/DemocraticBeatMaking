/*--------creates file directory system--------*/
let fs = require('fs');

let data = fs.readFileSync('./userPresets.json');
let words = JSON.parse(data);


let mainData = fs.readFileSync('./mainPresets.json');
let mainWords = JSON.parse(mainData);

let mainDataSpamVotes = [];
let oldDataLength = Object.keys(mainData).length;

for(let i = 0; i < oldDataLength; i++){
    mainDataSpamVotes.push(0);
}

/* check presets every 5 minutes */
setInterval(function(){
    let userPresetsLength = Object.keys(words).length;
    let oldWords = words;
    
    for(let i = 4; i <= userPresetsLength; i++){
        let myPreset = oldWords[i];
        console.log(myPreset.votes)
        let currentTime = new Date().getTime()
        let endTime = myPreset.votes.date + (1000 * 60 * 60 * 24)

        /* if 24 hours since last save has passed, check votes */
        if (currentTime > endTime){
            let yesVotes = myPreset.votes.yes
            let noVotes = myPreset.votes.no

            if(yesVotes > noVotes){
                fs.readFile('./mainPresets.json', addToMain)
        
                function addToMain(err, oldData){
                    let json = JSON.parse(oldData)
                    let newKey = Object.keys(json).length + 1
                   
                    json[newKey] = myPreset
                    mainWords = json
                // console.log(json)
                    newJSON = JSON.stringify(json, null, 2)
                    fs.writeFile('./mainPresets.json', newJSON, finished)
                    
                    function finished(err){
                        console.log('got it!')
                    }
                };
                fs.readFile('./userPresets.json', presetDelete)
        
                function presetDelete(err, oldData){
                    let json = JSON.parse(oldData)
                    delete json[i];
                // console.log(json)
                    words = json
                    newJSON = JSON.stringify(json, null, 2)
                    fs.writeFile('./userPresets.json', newJSON, finished)
                    
                    function finished(err){
                        console.log('Deleted preset ' + myPreset + " from UserPresets. Preset won! Added to Main!")
                    }
                }
            }else if (noVotes >= yesVotes){
                fs.readFile('./userPresets.json', presetDelete)
        
                function presetDelete(err, oldData){
                    let json = JSON.parse(oldData)
                    delete json[i];
                // console.log(json)
                    words = json
                    newJSON = JSON.stringify(json, null, 2)
                    fs.writeFile('./userPresets.json', newJSON, finished)
                    
                    function finished(err){
                        console.log('Deleted preset ' + myPreset + " from UserPresets. Preset lost")
                    }
                }

                }
            }
    }
    
}, 1000 * 60 * 60 * 24)

/*--------acceses express and listens on the localport--------*/
let express = require('express');

let app = express();
let server = app.listen(8080);

/*--------acceses socket.io and displays website files--------*/
let socket = require('socket.io');

app.use(express.static('public'));

app.get('/userPresets', sendPresets)
app.get('/mainPresets', sendMainPresets)
app.get('/reddit', (req, res) => {res.redirect("https://www.reddit.com/r/DemocraticBeatMaking/")})
app.get('/discord', (req, res) => {res.redirect("https://discordapp.com/channels/578783270532284417/578783271094190082")})


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
    socket.on('userVotingTrack1', votePreset);
    
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
        let whichButton = data

        if(oldDataLength < Object.keys(mainData).length){
            oldDataLength = Object.keys(mainData).length
            mainDataSpamVotes.push(0)
            }
        
        mainDataSpamVotes[whichButton] += 10;

        if(mainDataSpamVotes[whichButton] >= 255){
            mainDataSpamVotes[whichButton] = 0 
            }

        let buttonVote = {index: whichButton, voteCount: mainDataSpamVotes[whichButton]}
        //need to track number of votes for preset here,
        //send votes with index number
        io.emit('mainTrack1', buttonVote)
    }

    function votePreset(data){
        let whichPreset = data.index;
        let whichVote = data.vote;

        fs.readFile('./userPresets.json', append)
        console.log(data)
        
        function append(err, oldData){
            let json = JSON.parse(oldData)
            if(whichVote === "yesVote"){
                json[whichPreset].votes.yes += 1
             }else if(whichVote === "noVote"){
                json[whichPreset].votes.no +=1
             }
            
            words = json
           // console.log(json)
            newJSON = JSON.stringify(json, null, 2)
            fs.writeFile('./userPresets.json', newJSON, finished)
            
            function finished(err){
                console.log('got it!')
            }
        }
       
    }
}