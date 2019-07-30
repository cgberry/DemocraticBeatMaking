/*--------creates file directory system--------*/
let fs = require('fs');

let data = fs.readFileSync('./userPresets.json');
let words = JSON.parse(data);

let mainData = fs.readFileSync('./mainPresets.json');
let mainWords = JSON.parse(mainData);

/* parse out main data */
let mainDataSpamVotes = [[], [], []];
let mainDataLength = Object.keys(mainWords).length;
console.log(mainDataLength)

let mainDataOldPresetLengths = []

for(let i = 1; i <= mainDataLength; i++){
    let mainPresetAmount = Object.keys(mainWords[i]).length;
    mainDataOldPresetLengths.push(mainPresetAmount)
    for(let j =0; j < mainPresetAmount; j++){
    mainDataSpamVotes[i-1].push(0);
    }
}
console.log(mainDataOldPresetLengths)
/* check user presets every 10 minutes for votes*/
setInterval(function(){
    let oldWords = words;

    for(let seqIndex = 1; seqIndex<=3; seqIndex++){
        let userPresetsLength = Object.keys(words[seqIndex]).length
        let presetKeyArray = Object.keys(words[seqIndex])
    
        for(let keyIndex = 3; keyIndex < userPresetsLength; keyIndex++){
            let presetIndex = presetKeyArray[keyIndex]
            let myPreset = oldWords[seqIndex][presetIndex];
            //console.log(myPreset.votes)
            let currentTime = new Date().getTime()
            let endTime = myPreset.votes.date + (1000 * 60 * 60 * 24)

            /* if 24 hours since last save has passed, check votes */
            if (currentTime > endTime){
                let yesVotes = myPreset.votes.yes
                let noVotes = myPreset.votes.no

                //if preset won after 24 hours, send user preset to main and delete
                if(yesVotes > noVotes){
                    fs.readFile('./mainPresets.json', addToMain)
            
                    function addToMain(err, oldData){
                        let json = JSON.parse(oldData)
                        let newKey = Object.keys(json[seqIndex]).length + 1
                    
                        json[seqIndex][newKey] = myPreset
                        mainWords = json
                    // console.log(json)
                        newJSON = JSON.stringify(json, null, 2)
                        fs.writeFile('./mainPresets.json', newJSON, finished)
                        
                        function finished(err){
                            console.log('Moved ' + seqIndex + ' ', presetIndex + ' to ' + seqIndex + ' ', newKey)
                        }
                    };
                    fs.readFile('./userPresets.json', presetDelete)
            
                    function presetDelete(err, oldData){
                        let json = JSON.parse(oldData)
                        delete json[seqIndex][presetIndex];
                    // console.log(json)
                        words = json
                        newJSON = JSON.stringify(json, null, 2)
                        fs.writeFileSync('./userPresets.json', newJSON, finished)
                        
                        function finished(err){
                            console.log('Deleted preset ' + seqIndex + presetIndex + " from UserPresets. Preset won! Added to Main!")
                        }
                    }
                }else if (noVotes >= yesVotes){
                    fs.readFile('./userPresets.json', presetDelete)
            
                    function presetDelete(err, oldData){
                        let json = JSON.parse(oldData)
                        delete json[seqIndex][presetIndex];
                    // console.log(json)
                        words = json
                        newJSON = JSON.stringify(json, null, 2)
                        fs.writeFileSync('./userPresets.json', newJSON, finished)
                        
                        function finished(err){
                            console.log('Deleted preset ' + seqIndex + presetIndex + " from UserPresets. Preset lost")
                        }
                    }

                    }
            }
    }
}
}, 1000 * 60 * 1)

/* every 10 seconds, the spam votes get reset to 0*/
setInterval(function(){
    for(let seqID = 1; seqID <= mainDataLength; seqID++){
        let mainPresetAmount = Object.keys(mainWords[seqID]).length;
       for(let presetID = 0; presetID < mainPresetAmount; presetID++){
           mainDataSpamVotes[seqID-1][presetID] = 0;
       }
    }
}, 1000 * 10);

/*--------acceses express and listens on the localport--------*/
let express = require('express');

let app = express();
let server = app.listen(80);

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
        let newPreset = data.preset
        let whichSeq = data.sequencerID
        fs.readFile('./userPresets.json', append)
        
        function append(err, oldData){
            let json = JSON.parse(oldData)
            let newKey = returnMissingKey(Object.keys(json[whichSeq]))
            console.log(newPreset)
            json[whichSeq][newKey] = newPreset
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
        let dataArray = data.split(' ');
        let seqID = parseInt(dataArray[0])
        let whichButton = parseInt(dataArray[1])
        

        if(mainDataOldPresetLengths[seqID] < Object.keys(mainWords[seqID + 1]).length){
            mainDataOldPresetLengths[seqID] = Object.keys(mainWords[seqID + 1]).length
            mainDataSpamVotes[seqID].push(0)
            }
        
        mainDataSpamVotes[seqID][whichButton -1] += 10;
      //  console.log(mainDataSpamVotes)

        if(mainDataSpamVotes[seqID][whichButton-1] >= 255){
            mainDataSpamVotes[seqID][whichButton-1] = 0 
            }

        let buttonVote = {sequencerIndex: seqID, presetIndex: whichButton, voteCount: mainDataSpamVotes[seqID][whichButton-1]}
       // console.log(buttonVote)
        //need to track number of votes for preset here,
        //send votes with index number
        io.emit('mainTrack1', buttonVote)
    }

    function votePreset(data){
        let whichSeq = data.sequencerIndex;
        let whichPreset = data.presetIndex;
        let whichVote = data.vote;

        fs.readFile('./userPresets.json', append)
        console.log(data)
        
        function append(err, oldData){
            let json = JSON.parse(oldData)
            if(whichVote === "yesVote"){
                json[whichSeq][whichPreset].votes.yes += 1
             }else if(whichVote === "noVote"){
                json[whichSeq][whichPreset].votes.no +=1
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

function returnMissingKey(array){
    let newArray = []
    for(let i = 0; i< array.length; i++){
      newArray.push(parseInt(array[i]))
    }
    for(let i = 0; i< array.length - 1; i++){
     if(newArray[i+1] - newArray[i] != 1){
       let missingIndex = newArray[i] + 1
       return missingIndex;
     }
    }
    console.log(newArray.length + 1)
    return newArray.length + 1
  }
