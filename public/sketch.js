/* ---------opens client-side socket----------*/
let socket = io.connect();
socket.on('mainTrack1', changeColor)

/////////////////////////////////////
//        GLOBAL VARIABLES         //
/////////////////////////////////////
let cnv;

let loopBeat;

let mainSequencer = [];
let mainSynth = [];

let mainVolumeSlider = [];

let userSequencer = [];
let userSynth = [];

let userVolumeSlider = [];

let counter;

let playButton;

let userPresets;

let userPresetDropdown;
let userPresetDropdownContentDiv;

let userPresetButtons = [[], [], []];
let userPresetLength = [];

let userSaveButton;

let mainPresets;

let mainPresetDropdown;
let mainPresetDropdownContentDiv;

let mainPresetButtons = [[], [], []];
let mainPresetLength =[];

let voteDiv=[];
let voteP=[];
let questionP=[];
let yesButton=[], noButton=[];

let presetID;

let attackSlider = [], decaySlider =[], sustainSlider =[], releaseSlider =[];

let pitchEnterButton, waveEnterButton;
let pitchArray = [], waveform;
let pitchInput = [], waveInput = [];

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
  cnv = createCanvas(1200, 1630);
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
  for(let sequencerIndex = 0; sequencerIndex < 3; sequencerIndex++){
    /* Declares StepSequencer Classes */
    let sequencerSpacing = 500 * sequencerIndex;
    mainSequencer[sequencerIndex] = new StepSequencer();
    mainSequencer[sequencerIndex].yOffset = 40 + sequencerSpacing

    userSequencer[sequencerIndex] = new StepSequencer();
    userSequencer[sequencerIndex].xOffset = 520;
    userSequencer[sequencerIndex].yOffset = 40 + sequencerSpacing

    /*CREATES THE PRESET PARAMETERS*/
    userPresetLength[sequencerIndex] = Object.keys(userPresets[sequencerIndex + 1]).length;

    userPresetDropdown = createButton("presets");
    userPresetDropdown.class('dropbtn')
    userPresetDropdown.id("userDropbtn" + sequencerIndex);
    userPresetDropdown.parent("userDropdown" + sequencerIndex);
    userPresetDropdown.position(520, 425 + sequencerSpacing);

    userPresetDropdownContentDiv = createDiv();
    userPresetDropdownContentDiv.class('dropdown-content')
    userPresetDropdownContentDiv.id("userDropdown-content" + sequencerIndex);
    userPresetDropdownContentDiv.parent("userDropbtn" + sequencerIndex);

    for (let i = 0; i < userPresetLength[sequencerIndex]; i++) {
      let presetKeyArray = Object.keys(userPresets[sequencerIndex + 1])
      let seqIndexAndPresetIndex = sequencerIndex.toString() + " " + presetKeyArray[i]
      userPresetButtons[sequencerIndex][i] = createButton(seqIndexAndPresetIndex);
    //  userPresetButtons[i].position(i * 30, 0)
      userPresetButtons[sequencerIndex][i].id(seqIndexAndPresetIndex);
      userPresetButtons[sequencerIndex][i].mousePressed(setPresets);
      userPresetButtons[sequencerIndex][i].parent("userDropdown-content" + sequencerIndex);
    }

    userSaveButton = createButton("Save Preset");
    userSaveButton.class("savebtn")
    userSaveButton.id("savebtn" + " " + sequencerIndex);
    userSaveButton.mousePressed(savePreset);
    userSaveButton.position(620, 425 + sequencerSpacing);

    mainPresetLength[sequencerIndex] = Object.keys(mainPresets[sequencerIndex + 1]).length;

    mainPresetDropdown = createButton("presets");
    mainPresetDropdown.class('dropbtn')
    mainPresetDropdown.id("mainDropbtn" + sequencerIndex);
    mainPresetDropdown.parent("mainDropdown" + sequencerIndex);
    mainPresetDropdown.position(40, 425 + sequencerSpacing);

    mainPresetDropdownContentDiv = createDiv();
    mainPresetDropdownContentDiv.class('dropdown-content')
    mainPresetDropdownContentDiv.id("mainDropdown-content" + sequencerIndex);
    mainPresetDropdownContentDiv.parent("mainDropbtn" + sequencerIndex);

    for (let i = 0; i < mainPresetLength[sequencerIndex]; i++) {
      let seqIndexAndPresetIndex = sequencerIndex.toString() + " " + (i + 1)
      mainPresetButtons[sequencerIndex][i] = createButton(seqIndexAndPresetIndex);
    //  mainPresetButtons[i].position(i * 30, 0)
      mainPresetButtons[sequencerIndex][i].id(seqIndexAndPresetIndex);
      mainPresetButtons[sequencerIndex][i].mousePressed(selectPresets);
      mainPresetButtons[sequencerIndex][i].parent("mainDropdown-content" + sequencerIndex);
    }



    /* Volume */
    mainVolumeSlider[sequencerIndex] = createSlider(-100, 0, 0);
    mainVolumeSlider[sequencerIndex].id("mainVolume" + sequencerIndex);
    mainVolumeSlider[sequencerIndex].class('slider');
    mainVolumeSlider[sequencerIndex].position(400, 100 + sequencerSpacing);

    userVolumeSlider[sequencerIndex] = createSlider(-100, 0, 0);
    userVolumeSlider[sequencerIndex].id("userVolume" + sequencerIndex);
    userVolumeSlider[sequencerIndex].class('slider');
    userVolumeSlider[sequencerIndex].position(880, 100 + sequencerSpacing);

    /* Voting Structure */
    voteDiv[sequencerIndex] = createDiv();
    voteDiv[sequencerIndex].id("vote" + sequencerIndex);

    voteP[sequencerIndex] = createP("Thank you for voting!");
    voteP[sequencerIndex].id("voteP" + sequencerIndex);
    voteP[sequencerIndex].position(800, 425 + sequencerSpacing);
    voteP[sequencerIndex].hide();

    questionP[sequencerIndex] = createP("Do you think this preset" + "<br>" + "contributes to the overall piece?");
    questionP[sequencerIndex].id("questionP" + sequencerIndex);
    questionP[sequencerIndex].position(800, 415 + sequencerSpacing);
    questionP[sequencerIndex].hide();

    yesButton[sequencerIndex] = createButton("YES");
    yesButton[sequencerIndex].id("yesVote" +  sequencerIndex);
    yesButton[sequencerIndex].parent("vote" + sequencerIndex);
    yesButton[sequencerIndex].mousePressed(voting);
    yesButton[sequencerIndex].position(800, 475 + sequencerSpacing);
    yesButton[sequencerIndex].hide();

    noButton[sequencerIndex] = createButton("NO");
    noButton[sequencerIndex].id("noVote" +  sequencerIndex);
    noButton[sequencerIndex].parent("vote" + sequencerIndex);
    noButton[sequencerIndex].mousePressed(voting);
    noButton[sequencerIndex].position(850, 475 + sequencerSpacing);
    noButton[sequencerIndex].hide();

    /* Envelope Sliders */
    attackSlider[sequencerIndex] = createSlider(0.0, 0.25, 0.1, 0.001);
    attackSlider[sequencerIndex].id("userAttack" + sequencerIndex);
    attackSlider[sequencerIndex].class('slider')
    attackSlider[sequencerIndex].position(930, 100 + sequencerSpacing);

    decaySlider[sequencerIndex] = createSlider(0.0, 1.0, 0.1, 0.001);
    decaySlider[sequencerIndex].id("userDecay" + sequencerIndex);
    decaySlider[sequencerIndex].class('slider')
    decaySlider[sequencerIndex].position(950, 100 + sequencerSpacing);

    sustainSlider[sequencerIndex] = createSlider(0.0, 1.0, 0.1, 0.001);
    sustainSlider[sequencerIndex].id("userSustain" + sequencerIndex);
    sustainSlider[sequencerIndex].class('slider')
    sustainSlider[sequencerIndex].position(970, 100 + sequencerSpacing);

    releaseSlider[sequencerIndex] = createSlider(0.1, 10.0, 0.1, 0.001);
    releaseSlider[sequencerIndex].id("userRelease" + sequencerIndex);
    releaseSlider[sequencerIndex].class('slider')
    releaseSlider[sequencerIndex].position(990, 100 + sequencerSpacing);

    /* Input Fields */
    pitchInput[sequencerIndex] = createElement('textarea');
    pitchInput[sequencerIndex].attribute("style", "height: 80px; width: 100px");
    pitchInput[sequencerIndex].attribute("placeholder", "C4 D4 E4 F#4 G4 A4 B4 C5 D5 E5 Gb5 G5 A5 B5 C6 D6");
    pitchInput[sequencerIndex].class("textareas")
    pitchInput[sequencerIndex].id("pitchInput" + " " + sequencerIndex)
    pitchInput[sequencerIndex].position(930, 300 + sequencerSpacing)

    pitchEnterButton = createButton("Enter<br> Pitch Scheme");
    pitchEnterButton.mousePressed(yourPitchInput);
    pitchEnterButton.class("enterbutton")
    pitchEnterButton.id("pitchenter" + " " + sequencerIndex)
    pitchEnterButton.position(1040, 300 + sequencerSpacing)

    waveInput[sequencerIndex] = createInput();
    waveInput[sequencerIndex].class("inputs")
    waveInput[sequencerIndex].attribute("placeholder", "ex. sine3 triangle square5 sawtooth16")
    waveInput[sequencerIndex].id("waveinput" + " " + sequencerIndex)
    waveInput[sequencerIndex].position(930, 400 + sequencerSpacing)

    waveEnterButton = createButton("Enter Your<br> Waveform");
    waveEnterButton.mousePressed(yourWaveInput);
    waveEnterButton.class("enterbutton")
    waveEnterButton.id("waveenter"  + " " + sequencerIndex)
    waveEnterButton.position(1080, 400 + sequencerSpacing)

    /* Draw Sequencers */
    strokeWeight(1);
    mainSequencer[sequencerIndex].drawMatrix();
    userSequencer[sequencerIndex].drawMatrix();

    /* Declares Synths */
    mainSynth[sequencerIndex] = new Tone.PolySynth(4, Tone.Synth).toMaster();
    mainSynth[sequencerIndex].set({
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

    userSynth[sequencerIndex] = new Tone.PolySynth(4, Tone.Synth).toMaster();
    userSynth[sequencerIndex].set({
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
}

  ///////////////////////////////////////////////////////
  /* what happens below is only created once */
  ///////////////////////////////////////////////////////

  /* Playbutton */
  playButton = createButton('play');
  playButton.class('playButtons');
  playButton.position(0, 0);
  playButton.mousePressed(playButtonPressed);

  discordPanel = createElement("iframe")
  discordPanel.attribute("src", "https://discordapp.com/widget?id=578783270532284417&theme=dark");
  discordPanel.attribute("width", "320");
  discordPanel.attribute("height", "600");
  discordPanel.attribute("frameborder", "0");
  discordPanel.id("discordpanel")
  discordPanel.position(width, discordYPos);
  
  redditA = createA("https://www.reddit.com/r/DemocraticBeatMaking/", "");
  redditA.attribute("target", "_blank");
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
  for(let sequencerIndex = 0; sequencerIndex < 3; sequencerIndex++){
    mainSynth[sequencerIndex].set({
      'volume': (mainSequencer[sequencerIndex].polySeq[counter].length * -1.0) + mainVolumeSlider[sequencerIndex].value()
    });

    userSynth[sequencerIndex].set({
      'volume': (userSequencer[sequencerIndex].polySeq[counter].length * -1.0) + userVolumeSlider[sequencerIndex].value(),
      'envelope': {
        'attack': attackSlider[sequencerIndex].value(),
        'decay': decaySlider[sequencerIndex].value(),
        'sustain': sustainSlider[sequencerIndex].value(),
        'release': releaseSlider[sequencerIndex].value()
      }
    });
    
    mainSynth[sequencerIndex].triggerAttackRelease(mainSequencer[sequencerIndex].polySeq[counter].filter(filterUndefined), '8n', time);
    userSynth[sequencerIndex].triggerAttackRelease(userSequencer[sequencerIndex].polySeq[counter].filter(filterUndefined), '8n', time);
  }

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
    let rowClicked = floor(this.beatLength * (mouseY - this.yOffset) / this.lineEnd);
    let columnClicked = floor(this.beatLength * (mouseX - this.xOffset) / this.lineEnd);

    this.mouseIsDragged = true;

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
  let sequencerIndex = 0
  if(mouseY < 500){
      sequencerIndex = 0
  }else if (mouseY >= 500 && mouseY < 1000){
    sequencerIndex = 1
  }else if (mouseY >= 1000 && mouseY < height){
    sequencerIndex = 2
  }
  userSequencer[sequencerIndex].canvasPressed()
}

function canvasMoved(){
  let sequencerIndex = 0
  if(mouseY < 500){
      sequencerIndex = 0
  }else if (mouseY >= 500 && mouseY < 1000){
    sequencerIndex = 1
  }else if (mouseY >= 1000 && mouseY < height){
    sequencerIndex = 2
  }
  userSequencer[sequencerIndex].canvasMoved()
}

function canvasReleased(){
  let sequencerIndex = 0
  if(mouseY < 500){
      sequencerIndex = 0
  }else if (mouseY >= 500 && mouseY < 1000){
    sequencerIndex = 1
  }else if (mouseY >= 1000 && mouseY < height){
    sequencerIndex = 2
  }
  userSequencer[sequencerIndex].canvasReleased()
}

/////////////////////////////////////
//    FILTERS UNDEFINED IN ARRAY   //
/////////////////////////////////////
function filterUndefined(value) {
  return value !== undefined;
}

/////////////////////////////////////
//       Returns Missing Key       //
/////////////////////////////////////
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
  let nextKey = newArray.length + 1
  return nextKey
}

/////////////////////////////////////
//       SETS PRESETS FOR USER     //
/////////////////////////////////////
function setPresets() {

  //check the buttons id, whatever id it has is the preset it needs to select
  let myID = event.srcElement.id;
  presetID = myID

  let idArray = myID.split(" ")
  let seqID = parseInt(idArray[0]) + 1
  let preID = idArray[1]

  console.log(seqID, preID)

  let whichButton = {...userPresets[seqID][preID]};

  // deep clone an array of arrays
  let setSequence = whichButton.sequence.map(i => ([...i]));
  let setEnvelope = {...whichButton.envelope};

  let setAttack = setEnvelope.attack
  let setDecay = setEnvelope.decay
  let setSustain = setEnvelope.sustain
  let setRelease = setEnvelope.release

  let setWaveform = whichButton.waveform;
  waveform = setWaveform
  let setPitchScheme = whichButton.pitchArray;
  console.log(setPitchScheme)
  
  userSequencer[seqID-1].polyMatrix = setSequence;
  userSequencer[seqID-1].polyNotes = setPitchScheme;

  userSynth[seqID-1].set({
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

  attackSlider[seqID - 1].value(setAttack);
  decaySlider[seqID - 1].value(setDecay);
  sustainSlider[seqID - 1].value(setSustain);
  releaseSlider[seqID - 1].value(setRelease);
  
  userSequencer[seqID - 1].drawMatrix();
  userSequencer[seqID - 1].polyMatrixNotes();

  let placeholderString = setPitchScheme.toString();
  let newPitchString = placeholderString.replace(/,/g, ' ')
  pitchInput[seqID - 1].attribute("placeholder", newPitchString)

  waveInput[seqID - 1].attribute("placeholder", setWaveform)
  
  //When Votes selected
  if (whichButton.haveVoted === false){
    yesButton[seqID - 1].show();
    noButton[seqID - 1].show();
    questionP[seqID - 1].show();
    voteP[seqID - 1].hide();
  }else{
    yesButton[seqID - 1].hide();
    noButton[seqID - 1].hide();
    questionP[seqID - 1].hide();
    voteP[seqID - 1].show();
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
  let sequencerIndex = parseInt(data.sequencerIndex);
  let presetIndex = parseInt(data.presetIndex);
  let voteCount = parseInt(data.voteCount);

  voteCountPercentage = voteCount/255
  console.log(voteCountPercentage)
  
  let redColor = (voteCountPercentage * 2) * 255
  let greenColor = 255

  if (voteCountPercentage > 0.5) {
    redColor = 255
    greenColor = 255 - (255 * ((voteCountPercentage - 0.5) * 2))
  }
  let displayColor = '#' + redColor.toString(16) + greenColor.toString(16) + '00'
  mainPresetButtons[sequencerIndex][presetIndex-1].style('background-color', displayColor)

  //Vote Procedure
  if (voteCount === 0){
    let whichButton = {...mainPresets[sequencerIndex+1][presetIndex]};

    // deep clone an array of arrays
    let setSequence = whichButton.sequence.map(i => ([...i]));
    let setEnvelope = {...whichButton.envelope};

    let setAttack = setEnvelope.attack
    let setDecay = setEnvelope.decay
    let setSustain = setEnvelope.sustain
    let setRelease = setEnvelope.release

    let setWaveform = whichButton.waveform;
    let setPitchScheme = whichButton.pitchArray;

    mainSynth[sequencerIndex].set({
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
    mainSequencer[sequencerIndex].polyMatrix = setSequence;
    mainSequencer[sequencerIndex].polyNotes = setPitchScheme;

    mainSequencer[sequencerIndex].drawMatrix();
    mainSequencer[sequencerIndex].polyMatrixNotes();
    console.log('changed!')
  }
    
  
}

/////////////////////////////////////
//          SAVES PRESETS          //
/////////////////////////////////////

function savePreset() {
  let myName = event.srcElement.id;
  let splitName = myName.split(" ")
  let seqID = parseInt(splitName[1]) + 1

   userPresetLength[seqID - 1] = Object.keys(userPresets[seqID]).length;
  // let newKey = userPresetLength[seqID] + 1;
  let newKey = returnMissingKey(Object.keys(userPresets[seqID]))
  console.log(newKey);
  /*Preset in dictonary format 
  Loading it like this creates the new key*/
  let date = new Date();
  let time = date.getTime();

  let newPreset = {
    "sequencerID": seqID, "preset" :{
      "sequence": userSequencer[seqID -1].polyMatrix,
      "envelope":{
        "attack": attackSlider[seqID-1].value(),
        "decay": decaySlider[seqID-1].value(),
        "sustain": sustainSlider[seqID-1].value(),
        "release": releaseSlider[seqID-1].value(),
      },
      "pitchArray": userSequencer[seqID-1].polyNotes,
      "waveform": waveform,
      "haveVoted": false,
      "votes": {
          "date": time,
          "yes": 0,
          "no": 0
      } 
    }
  };

  if (confirm("Would you like to save your presets?")) {
    userPresets[seqID][newKey] = newPreset.preset;
    socket.emit('userTrack1', newPreset);
  }
  let newName = (seqID-1) + " " + newKey
  userPresetButtons[seqID - 1][userPresetLength[seqID - 1]] = createButton(newName);
 // presetButtons[presetLength].position(presetLength * 30, 0)
 userPresetButtons[seqID - 1][userPresetLength[seqID - 1]].id(newName);
 userPresetButtons[seqID - 1][userPresetLength[seqID - 1]].mousePressed(setPresets);
  userPresetButtons[seqID - 1][userPresetLength[seqID - 1]].parent("userDropdown-content" + (seqID -1));
  Tone.context.resume();
}

/////////////////////////////////////
//             VOTING              //
/////////////////////////////////////
function voting(){
  let idArray = presetID.split(" ")
  let seqID = parseInt(idArray[0]) + 1
  let preID = idArray[1]
  let whichButton = userPresets[seqID][preID]
  let whichVote = event.srcElement.id
  whichVote = whichVote.replace(/[0-9]/g, '');
  console.log(whichVote);

  let sendVote = {sequencerIndex: seqID, presetIndex: preID, vote: whichVote}
  
 if(whichVote === "yesVote"){
   whichButton.haveVoted = true
   yesButton[seqID - 1].hide();
   noButton[seqID - 1].hide();
   questionP[seqID - 1].hide();
   voteP[seqID - 1].show();
   socket.emit('userVotingTrack1', sendVote);
 }
  if(whichVote === "noVote"){
    whichButton.haveVoted = true
    yesButton[seqID - 1].hide();
    noButton[seqID - 1].hide();
    questionP[seqID - 1].hide();
    voteP[seqID - 1].show();
     socket.emit('userVotingTrack1', sendVote);
  }
}

/////////////////////////////////////
//           TEST INPUTS           //
/////////////////////////////////////
function yourPitchInput(){
  let myID = event.srcElement.id;
  myID = myID.split(" ")
  myID = parseInt(myID[1])
  console.log(myID)
  let myValue = pitchInput[myID].value()
  
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
    userSequencer[myID].polyNotes = pitchArray;
    userSequencer[myID].polyMatrixNotes();

    let placeholderString = pitchArray.toString();
    let newString = placeholderString.replace(/,/g, ' ')
    pitchInput[myID].attribute("placeholder", newString)
  }else if (splitValue.length != 16 || regTests === false){
    alert("You must have sixteen notes in this format:\nB5 C6 D3 F3 . . .")
  }
  console.log(pitchArray)
}

function yourWaveInput(){
  let myID = event.srcElement.id;
  myID = myID.split(" ")
  myID = parseInt(myID[1])
  console.log(myID)
  let myValue = waveInput[myID].value()
  
  //regexp to test waveform
  let reg = /^(sine|triangle|square|sawtooth)(1)?(\d)?$/
  
  //regexp tests
  let regTest = reg.test(myValue, reg);
  
  console.log(regTest);
  
  if(regTest){
    waveform = myValue
    waveInput[myID].attribute("placeholder", waveform)
    userSynth[myID].set({
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
  //move the square according to the vertical scroll amount
  discordYPos += event.delta;
  if(discordYPos > 1000){
   discordYPos = 1000 
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
