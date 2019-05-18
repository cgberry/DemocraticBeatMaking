/* ---------opens client-side socket----------*/
let socket = io.connect();
socket.on('mainTrack1', changeColor)

/////////////////////////////////////
//        GLOBAL VARIABLES         //
/////////////////////////////////////
let cnv;

let loopBeat;

let mainSequencer;
let mainSynth;

let mainVolumeSlider;

let userSequencer;
let userSynth;

let userVolumeSlider;

let counter;

let playButton;

let userPresets;

let userPresetDropdown;
let userPresetDropdownContentDiv;

let userPresetButtons = [];
let userPresetLength;

let userSaveButton;

let mainPresets;

let mainPresetDropdown;
let mainPresetDropdownContentDiv;

let mainPresetButtons = [];
let mainPresetLength;

let voteDiv;
let voteP;
let questionP;
let yesButton, noButton;

let presetID;

let attackSlider, decaySlider, sustainSlider, releaseSlider;

let pitchEnterButton, waveEnterButton;
let pitchArray = [], waveform;
let pitchInput, waveInput;

let discordPanel;
let discordYPos = 0;

let redditImage;
let redditA;
/////////////////////////////////////
//              INIT               //
/////////////////////////////////////

function preload(){
  userPresets = loadJSON('userPresets');
  mainPresets = loadJSON('mainPresets');
}


function setup() {
  /* Canvas Callbacks */
  cnv = createCanvas(1200, 1200);
  background(220);
  cnv.mousePressed(canvasPressed);
  cnv.mouseMoved(canvasMoved);
  cnv.mouseReleased(canvasReleased);
  cnv.touchStarted(canvasPressed);
  cnv.touchMoved(canvasMoved);
  cnv.touchEnded(canvasReleased);
  
  // cnv.touchStarted(function(event) {event.preventDefault()});
  // cnv.touchMoved(function(event) {event.preventDefault()});
  // cnv.touchEnded(function(event) {event.preventDefault()});

  //GONNA PUT THIS INTO ONE GIANT FOR LOOP! WISH ME LUCK!
  /* Declares StepSequencer Classes */
  mainSequencer = new StepSequencer();
 // mainSequencer.yOffset = 520

  userSequencer = new StepSequencer();
  userSequencer.xOffset = 520;
 // userSequencer.yOffset = 

  /*CREATES THE PRESET PARAMETERS*/
  userPresetLength = Object.keys(userPresets).length;

  userPresetDropdown = createButton("presets");
  userPresetDropdown.class('dropbtn')
  userPresetDropdown.id("userDropbtn");
  userPresetDropdown.parent("userDropdown");
  userPresetDropdown.position(520, 425);
  
  userPresetDropdownContentDiv = createDiv();
  userPresetDropdownContentDiv.class('dropdown-content')
  userPresetDropdownContentDiv.id("userDropdown-content");
  userPresetDropdownContentDiv.parent("userDropbtn");

  for (let i = 0; i < userPresetLength; i++) {
    userPresetButtons[i] = createButton(i + 1);
  //  userPresetButtons[i].position(i * 30, 0)
    userPresetButtons[i].id(i + 1);
    userPresetButtons[i].mousePressed(setPresets);
    userPresetButtons[i].parent("userDropdown-content");
  }

  userSaveButton = createButton("Save Preset");
  userSaveButton.id("savebtn");
  userSaveButton.mousePressed(savePreset);
  userSaveButton.position(620, 425);

  mainPresetLength = Object.keys(mainPresets).length;

  mainPresetDropdown = createButton("presets");
  mainPresetDropdown.class('dropbtn')
  mainPresetDropdown.id("mainDropbtn");
  mainPresetDropdown.parent("mainDropdown");
  mainPresetDropdown.position(40, 425);
  
  mainPresetDropdownContentDiv = createDiv();
  mainPresetDropdownContentDiv.class('dropdown-content')
  mainPresetDropdownContentDiv.id("mainDropdown-content");
  mainPresetDropdownContentDiv.parent("mainDropbtn");

  for (let i = 0; i < mainPresetLength; i++) {
    mainPresetButtons[i] = createButton(i + 1);
  //  mainPresetButtons[i].position(i * 30, 0)
    mainPresetButtons[i].id(i + 1);
    mainPresetButtons[i].mousePressed(selectPresets);
    mainPresetButtons[i].parent("mainDropdown-content");
  }

  /* Playbutton */
  playButton = createButton('play');
  playButton.class('playButtons');
  playButton.position(0, 0);
  playButton.mousePressed(playButtonPressed);
  
  /* Volume */
	mainVolumeSlider = createSlider(-100, 0, 0);
  mainVolumeSlider.id("mainVolume");
  mainVolumeSlider.class('slider');
  mainVolumeSlider.position(400, 100);

  userVolumeSlider = createSlider(-100, 0, 0);
  userVolumeSlider.id("userVolume");
  userVolumeSlider.class('slider');
  userVolumeSlider.position(880, 100);

  /* Voting Structure */
  voteDiv = createDiv();
  voteDiv.id("vote");
  
  voteP = createP("Thank you for voting!");
  voteP.id("voteP");
  voteP.position(800, 425);
  voteP.hide();

  questionP = createP("Do you think this preset" + "<br>" + "contributes to the overall piece?");
  questionP.id("questionP");
  questionP.position(800, 415);
  questionP.hide();
    
  yesButton = createButton("YES");
  yesButton.id("yesVote");
  yesButton.parent("vote");
  yesButton.mousePressed(voting);
  yesButton.position(800, 475);
  yesButton.hide();
  
  noButton = createButton("NO");
  noButton.id("noVote");
  noButton.parent("vote");
  noButton.mousePressed(voting);
  noButton.position(850, 475);
  noButton.hide();

  /* Envelope Sliders */
  attackSlider = createSlider(0.0, 0.25, 0.1, 0.001);
  attackSlider.id("userAttack");
  attackSlider.class('slider')
  attackSlider.position(930, 100);
  
  decaySlider = createSlider(0.0, 1.0, 0.1, 0.001);
  decaySlider.id("userDecay");
  decaySlider.class('slider')
  decaySlider.position(950, 100);
  
  sustainSlider = createSlider(0.0, 1.0, 0.1, 0.001);
  sustainSlider.id("userSustain");
  sustainSlider.class('slider')
  sustainSlider.position(970, 100);
  
  releaseSlider = createSlider(0.1, 10.0, 0.1, 0.001);
  releaseSlider.id("userRelease");
  releaseSlider.class('slider')
  releaseSlider.position(990, 100);

  /* Input Fields */
  pitchInput = createElement('textarea');
  pitchInput.attribute("style", "height: 80px; width: 100px");
  pitchInput.attribute("placeholder", "C4 D4 E4 F#4 G4 A4 B4 C5 D5 E5 Gb5 G5 A5 B5 C6 D6");
  pitchInput.class("textareas")
  pitchInput.id("pitchInput1")
  pitchInput.position(930, 300)

  pitchEnterButton = createButton("Enter<br> Pitch Scheme");
  pitchEnterButton.mousePressed(yourPitchInput);
  pitchEnterButton.class("enterbutton")
  pitchEnterButton.id("pitchenter1")
  pitchEnterButton.position(1040, 300)
  
  waveInput = createInput();
  waveInput.class("inputs")
  waveInput.attribute("placeholder", "ex. sine3 triangle square5 sawtooth16")
  waveInput.id("waveinput1")
  waveInput.position(930, 400)

  waveEnterButton = createButton("Enter Your<br> Waveform");
  waveEnterButton.mousePressed(yourWaveInput);
  waveEnterButton.class("enterbutton")
  waveEnterButton.id("waveenter1")
  waveEnterButton.position(1080, 400)

  /* Draw Sequencers */
  strokeWeight(1);
  mainSequencer.drawMatrix();
  userSequencer.drawMatrix();

  /* Declares Synths */
  mainSynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
  mainSynth.set({
    'oscillator': {
      'type': 'triangle'
    },
    'envelope': {
      'attack': 0.005,
      'decay': 0.1,
      'sustain': 0.3,
      'release': 1
    },
    'volume': -1.0,
    'filter': {
      'type': 'lowpass',
      'frequency': 10,
      'rolloff': -12,
      'Q': 100,
      'gain': 0
    }
  });

  userSynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
  userSynth.set({
    'oscillator': {
      'type': 'triangle'
    },
    'envelope': {
      'attack': 0.005,
      'decay': 0.1,
      'sustain': 0.3,
      'release': 1
    },
    'volume': -1.0,
    'filter': {
      'type': 'lowpass',
      'frequency': 10,
      'rolloff': -12,
      'Q': 100,
      'gain': 0
    }
  });
  
  ///////////////////////////////////////////////////////
  /* what happens below is only created once */
  ///////////////////////////////////////////////////////
  discordPanel = createElement("iframe")
  discordPanel.attribute("src", "https://discordapp.com/widget?id=578783270532284417&theme=dark");
  discordPanel.attribute("width", "300");
  discordPanel.attribute("height", "500");
  discordPanel.position(width, discordYPos);
  
  redditA = createA("https://www.reddit.com/r/DemocraticBeatMaking/", "");
  redditA.id("redditLink")
  redditA.position(width - 70, 10)
  
  redditImage = createImg("http://i.imgur.com/sdO8tAw.png")
  redditImage.size(50, AUTO);
  redditImage.parent("redditLink");
  
  
  /* Drawing */
  strokeWeight(3);
  line(490, 0, 490, height);

  strokeWeight(1);

  push();
  textSize(32);
  fill(0);
  text("Work Together Here", 75, 25);
  pop();
  
  push();
  fill(0);
  textSize(32);
  text("Make Your Contributions Here", 525, 25);
  pop();

  /* Mute when started */
  Tone.Master.mute = true;

  /* Declares Song Structure */
  loopBeat = new Tone.Loop(song, '16n');

  Tone.Transport.bpm.value = 140;
  Tone.Transport.start();
  loopBeat.start(0);

  counter = 0;
}

/////////////////////////////////////
//          MAIN SONG LOOP         //
/////////////////////////////////////
function song(time) {
  mainSynth.set({
    'volume': (mainSequencer.polySeq[counter].length * -1.0) + mainVolumeSlider.value()
  });

  userSynth.set({
    'volume': (userSequencer.polySeq[counter].length * -1.0) + userVolumeSlider.value(),
    'envelope': {
      'attack': attackSlider.value(),
      'decay': decaySlider.value(),
      'sustain': sustainSlider.value(),
      'release': releaseSlider.value()
    }
  });
  
  mainSynth.triggerAttackRelease(mainSequencer.polySeq[counter].filter(filterUndefined), '8n', time);

  userSynth.triggerAttackRelease(userSequencer.polySeq[counter].filter(filterUndefined), '8n', time);

  counter = (counter + 1) % 16;

}

class StepSequencer {
  constructor(){
  /* Matrix of On/Off within Step Sequencer */
  this.polyMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
    
	/* Notes to be pushed into polySeq */
  this.polyNotes = ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4',
    'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5'];
    
  /* Actual sequence to be triggered in polySynth.triggerAttackRelease */
  this.polySeq = [
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]
  ];

  /* Size and Location Variables */ 
  this.beatLength = 16;
  this.boxSize = 24;
  this.lineEnd = this.beatLength * this.boxSize;
  this.xOffset = 40;
  this.yOffset = 40;
    
  /* Binds event listener fuctions to this? */   
  this.lastCellState = 1;
  this.mouseIsDragged = false;
    
  /* Binds event listener fuctions to this? */  
  this.canvasPressed = this.canvasPressed.bind(this);
  this.canvasMoved = this.canvasMoved.bind(this);
  this.canvasReleased = this.canvasReleased.bind(this);
  }

  /////////////////////////////////////
  //       DRAWS STEP SEQUENCER      //
  /////////////////////////////////////
  drawMatrix() {
    fill(125);
    /* Background Square */ 
    rect(this.xOffset, this.yOffset, this.lineEnd, this.lineEnd);

    /* Grid creation */ 
    for (let i = 0; i < this.beatLength; i++) {
      let lineStart = (i * this.boxSize) + this.boxSize;

      /* Horizontal line */ 
      line(this.xOffset, lineStart + this.yOffset,
        this.lineEnd + this.xOffset, lineStart + this.yOffset);

      /* Vertical line */ 
      line(lineStart + this.xOffset, this.yOffset,
        lineStart + this.xOffset, this.lineEnd + this.yOffset);
    }

    /* On/Off Grid Squares */ 
    for (let j = 0; j < pow(this.beatLength, 2); j++) {
      let toRowIndex = j % this.beatLength;
      let toColumnIndex = Math.floor(j / this.beatLength);

      fill(j, 255 / (2 / (j + 2)), j / 2)
      if (this.polyMatrix[toRowIndex][toColumnIndex] === 1) {
        this.noteRect = rect((toColumnIndex * this.boxSize) + this.xOffset,
          (toRowIndex * this.boxSize) + this.yOffset,
          this.boxSize, this.boxSize);
      }

    }

  }

  /////////////////////////////////////
  // FUNCTIONS FOR EVENT LISTENER ON //
  //              CANVAS             //
  /////////////////////////////////////
  canvasPressed() {
    this.mouseIsDragged = true;
    let rowClicked = floor(this.beatLength * (mouseY - this.yOffset) / this.lineEnd);
    let columnClicked = floor(this.beatLength * (mouseX - this.xOffset) / this.lineEnd);


    if (this.polyMatrix[rowClicked][columnClicked] === 1) {
      this.lastCellState = 1;
    } else if (this.polyMatrix[rowClicked][columnClicked] === 0) {
      this.lastCellState = 0;
    }

    cnv.mouseReleased = function() {
      this.mouseIsDragged = false;
    }

  }

   canvasMoved() {
    if (this.mouseIsDragged) {
      let rowClicked = floor(this.beatLength * (mouseY - this.yOffset) / this.lineEnd);
      let columnClicked = floor(this.beatLength * (mouseX - this.xOffset) / this.lineEnd);

      if (this.polyMatrix[rowClicked][columnClicked] === this.lastCellState) {
        this.polyMatrix[rowClicked][columnClicked] = +!this.polyMatrix[rowClicked][columnClicked];
      }
      // console.log('You clicked row ' + rowClicked + ' and column ' + columnClicked);
      this.drawMatrix();
    }
  }
  
    canvasReleased() {
    this.mouseIsDragged = false;
    this.polyMatrixNotes();
  }

  /////////////////////////////////////
  //    CONVERTS polyMatrix ON and   //
  //		     OFF TO PITCH            //
  /////////////////////////////////////
  polyMatrixNotes() {
    for (let i = 0; i < pow(this.beatLength, 2); i++) {
      let toRowIndex = i % this.beatLength;
      let toColumnIndex = Math.floor(i / this.beatLength);

      if (this.polyMatrix[toRowIndex][toColumnIndex] === 1) {
        this.polySeq[toColumnIndex].splice(toRowIndex, 1, this.polyNotes[toRowIndex]);
      } else if (this.polyMatrix[toRowIndex][toColumnIndex] === 0) {
        this.polySeq[toColumnIndex].splice(toRowIndex, 1, undefined);
      }

    }
  }
  
}

/////////////////////////////////////
//         CANVAS CALLBACKS        //
/////////////////////////////////////

function canvasPressed(){
  userSequencer.canvasPressed()
 // mainSequencer.canvasPressed()
}
function canvasMoved(){
   userSequencer.canvasMoved()
 // mainSequencer.canvasMoved()
}
function canvasReleased(){
  userSequencer.canvasReleased()
 // mainSequencer.canvasReleased()
}

/////////////////////////////////////
//    FILTERS UNDEFINED IN ARRAY   //
/////////////////////////////////////
function filterUndefined(value) {
  return value !== undefined;
}


/////////////////////////////////////
//       SETS PRESETS FOR USER     //
/////////////////////////////////////
function setPresets() {
  //check the buttons id, whatever id it has is the preset it needs to select
  let myID = event.srcElement.id;
  presetID = myID

  let whichButton = {...userPresets[myID]};

  // deep clone an array of arrays
  let setSequence = whichButton.sequence.map(i => ([...i]));
  let setEnvelope = {...whichButton.envelope};

  let setAttack = setEnvelope.attack
  let setDecay = setEnvelope.decay
  let setSustain = setEnvelope.sustain
  let setRelease = setEnvelope.release

  let setWaveform = whichButton.waveform;
  let setPitchScheme = whichButton.pitchArray;
  console.log(setPitchScheme)
  
  userSequencer.polyMatrix = setSequence;
  userSequencer.polyNotes = setPitchScheme;

  userSynth.set({
    'oscillator': {
      'type': setWaveform
    },
    'envelope': {
      'attack': setAttack,
      'decay': setDecay,
      'sustain': setSustain,
      'release': setRelease
    }
  });

  attackSlider.value(setAttack);
  decaySlider.value(setDecay);
  sustainSlider.value(setSustain);
  releaseSlider.value(setRelease);
  
  userSequencer.drawMatrix();
  userSequencer.polyMatrixNotes();

  let placeholderString = setPitchScheme.toString();
    let newPitchString = placeholderString.replace(/,/g, ' ')
    pitchInput.attribute("placeholder", newPitchString)

    waveInput.attribute("placeholder", setWaveform)
  
  //When Votes selected
  if (whichButton.haveVoted === false){
    yesButton.show();
    noButton.show();
    questionP.show();
    voteP.hide();
  }else{
    yesButton.hide();
    noButton.hide();
    questionP.hide();
    voteP.show();
  }
}

/////////////////////////////////////
//            SPAM VOTES           //
/////////////////////////////////////
function selectPresets() {
  //check the buttons id, whatever id it has is the preset it needs to select
  let myID = event.srcElement.id;
  socket.emit('mainTrack1', myID);
  
}

/////////////////////////////////////
//        SETS MAIN PRESETS        //
/////////////////////////////////////
function changeColor(data){
  //Changes Color of Button
  let index = parseInt(data.index)
  let voteCount = parseInt(data.voteCount)

  voteCountPercentage = voteCount/255
  console.log(voteCountPercentage)
  
  let redColor = (voteCountPercentage * 2) * 255
  let greenColor = 255

  if (voteCountPercentage > 0.5) {
    redColor = 255
    greenColor = 255 - (255 * ((voteCountPercentage - 0.5) * 2))
  }
  let displayColor = '#' + redColor.toString(16) + greenColor.toString(16) + '00'
  mainPresetButtons[index - 1].style('background-color', displayColor)

  //Vote Procedure
  if (voteCount === 0){
    let whichButton = {...mainPresets[index]};

    // deep clone an array of arrays
    let setSequence = whichButton.sequence.map(i => ([...i]));
    let setEnvelope = {...whichButton.envelope};

    let setAttack = setEnvelope.attack
    let setDecay = setEnvelope.decay
    let setSustain = setEnvelope.sustain
    let setRelease = setEnvelope.release

    let setWaveform = whichButton.waveform;
    let setPitchScheme = whichButton.pitchArray;

    mainSynth.set({
      'oscillator': {
        'type': setWaveform
      },
      'envelope': {
        'attack': setAttack,
        'decay': setDecay,
        'sustain': setSustain,
        'release': setRelease
        }
    });
    mainSequencer.polyMatrix = setSequence;
    mainSequencer.polyNotes = setPitchScheme;

    mainSequencer.drawMatrix();
    mainSequencer.polyMatrixNotes();
    console.log('changed!')
  }
    
  
}

/////////////////////////////////////
//          SAVES PRESETS          //
/////////////////////////////////////

function savePreset() {
  userPresetLength = Object.keys(userPresets).length;
  let newKey = userPresetLength + 1;
  console.log(newKey);
  /*Preset in dictonary format 
  Loading it like this creates the new key*/
  let date = new Date();
  let time = date.getTime();

  let newPreset = {
      "sequence": userSequencer.polyMatrix,
      "envelope":{
        "attack": attackSlider.value(),
        "decay": decaySlider.value(),
        "sustain": sustainSlider.value(),
        "release": releaseSlider.value(),
      },
      "pitchArray": userSequencer.polyNotes,
      "waveform": waveform,
      "haveVoted": false,
      "votes": {
          "date": time,
          "yes": 0,
          "no": 0
      } 
  };

  if (confirm("Would you like to save your presets?")) {
    userPresets[newKey] = newPreset;
    socket.emit('userTrack1', newPreset);
  }
  userPresetButtons[userPresetLength] = createButton(userPresetLength + 1);
 // presetButtons[presetLength].position(presetLength * 30, 0)
 userPresetButtons[userPresetLength].id(userPresetLength + 1);
 userPresetButtons[userPresetLength].mousePressed(setPresets);
  userPresetButtons[userPresetLength].parent("userDropdown-content");
  Tone.context.resume();
}

/////////////////////////////////////
//             VOTING              //
/////////////////////////////////////
function voting(){
  let whichButton = userPresets[presetID]
  let whichVote = event.srcElement.id
  console.log(whichVote);

  let sendVote = {index: presetID, vote: whichVote}
  
 if(whichVote === "yesVote"){
   whichButton.haveVoted = true
   yesButton.hide();
   noButton.hide();
   questionP.hide();
   voteP.show();
   socket.emit('userVotingTrack1', sendVote);
 }
  if(whichVote === "noVote"){
    whichButton.haveVoted = true
    yesButton.hide();
    noButton.hide();
    questionP.hide();
    voteP.show();
     socket.emit('userVotingTrack1', sendVote);
  }
}

/////////////////////////////////////
//           TEST INPUTS           //
/////////////////////////////////////
function yourPitchInput(){
  let myValue = pitchInput.value()
  
  //turns input value into an array
  let splitValue = myValue.split(" ");
  
  //regexp to test note names
  let reg = /^[ABCDEFG](#)?(b)?[0-9]$/
  
  //regexp tests
  let regTests = regArrayTest(splitValue, reg);
  
  console.log(regTests);
  
  if(splitValue.length === 16 && regTests != false){
    pitchArray = []
    for(let i = 0; i < splitValue.length; i++){
      pitchArray.push(splitValue[i]);
    }
    console.log(pitchArray)
    userSequencer.polyNotes = pitchArray;
    userSequencer.polyMatrixNotes();

    let placeholderString = pitchArray.toString();
    let newString = placeholderString.replace(/,/g, ' ')
    pitchInput.attribute("placeholder", newString)
  }else if (splitValue.length != 16 || regTests === false){
    alert("You must have sixteen notes in this format:\nB5 C6 D3 F3 . . .")
  }
  console.log(pitchArray)
}

function yourWaveInput(){
  let myValue = waveInput.value()
  
  //regexp to test waveform
  let reg = /^(sine|triangle|square|sawtooth)(1)?(\d)?$/
  
  //regexp tests
  let regTest = reg.test(myValue, reg);
  
  console.log(regTest);
  
  if(regTest){
    waveform = myValue
    waveInput.attribute("placeholder", waveform)
    userSynth.set({
      'oscillator': {
        'type': waveform
      }
    });
  }else if (!regTest){
    alert("You must have a waveform in this format:\n sine triangle2 sawtooth8 square16 \n (did you also press enter while you were typing the notes in?)")
  }
  console.log(waveform)
}

function regArrayTest(array, reg){
  for(let i = 0; i < array.length; i++){
   let regTest = reg.test(array[i]);
    if (regTest === false){
     return regTest; 
    }
  }
}

/////////////////////////////////////
//         DISCORD SCROLL          //
/////////////////////////////////////
function mouseWheel(event) {
  print(event.delta);
  //move the square according to the vertical scroll amount
  discordYPos += event.delta;
  if(discordYPos > 700){
   discordYPos = 700 
  }
  
  if(discordYPos < 0){
   discordYPos = 0 
  }
  
  discordPanel.position(width, discordYPos);
  //uncomment to block page scrolling
  //return false;
}

/////////////////////////////////////
//       MASTER PLAY BUTTON        //
/////////////////////////////////////
function playButtonPressed() {
  if (Tone.Master.mute) {
    Tone.Master.mute = false;
  } else {
    Tone.Master.mute = true;
  }
}

/////////////////////////////////////
//       IF AUDIO CONTEXT IS			 //
//			 NOT ALLOWED TO START      //
/////////////////////////////////////
document.documentElement.addEventListener(
  "mousedown",
  function() {
   mouse_IsDown = true;
    if (Tone.context.state !== 'running') {
      Tone.context.resume();
    }
  })
