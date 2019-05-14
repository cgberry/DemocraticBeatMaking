/* ---------opens client-side socket----------*/
let socket = io.connect('localhost:3000');
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
/////////////////////////////////////
//              INIT               //
/////////////////////////////////////

function preload(){
  userPresets = loadJSON('userPresets');
  mainPresets = loadJSON('mainPresets');
}


function setup() {
  /* Declares StepSequencer Classes */
  mainSequencer = new StepSequencer();

  userSequencer = new StepSequencer();
  userSequencer.xOffset = 520
  
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
  mainVolumeSlider.id("polyVolume");
  mainVolumeSlider.class('volume');
  mainVolumeSlider.position(400, 200);

  userVolumeSlider = createSlider(-100, 0, 0);
  userVolumeSlider.id("polyVolume");
  userVolumeSlider.class('volume');
  userVolumeSlider.position(900, 200);

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

  /* Drawing */
  strokeWeight(3);
  line(490, 0, 490, height);

  strokeWeight(1);
  mainSequencer.drawMatrix();
  userSequencer.drawMatrix();

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

  /* Declares Synths */
  Tone.Master.mute = true;

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
    'volume': (userSequencer.polySeq[counter].length * -1.0) + userVolumeSlider.value()
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
    'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5'
  ];
    
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
//          SETS PRESETS           //
/////////////////////////////////////
function setPresets() {
  //check the buttons id, whatever id it has is the preset it needs to select
  let myID = event.srcElement.id;
  presetID = myID

  let whichButton = userPresets[myID];

  // deep clone an array of arrays
  let setSequence = whichButton.sequence.map(i => ({...i}));
  
  userSequencer.polyMatrix = setSequence;
  
  userSequencer.drawMatrix();
  userSequencer.polyMatrixNotes();
  
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

function changeColor(data){
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

  if (voteCount === 0){
    let whichButton = mainPresets[index];

    // deep clone an array of arrays
    let setSequence = whichButton.sequence.map(i => ({...i}));
  
    mainSequencer.polyMatrix = setSequence;
  
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
