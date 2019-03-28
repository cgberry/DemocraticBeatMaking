/* ---------opens client-side socket----------*/
let socket = io.connect('http://192.168.1.7:3000');

/////////////////////////////////////
//        GLOBAL VARIABLES         //
/////////////////////////////////////

let cnv;

let loopBeat;

let polySequencer;
let polySynth;

let volumeSlider;

let counter;

let playButton;

let presets;

let presetDropdown;
let presetDropdownContentDiv;

let presetButtons = [];
let presetLength;

let saveButton;

/////////////////////////////////////
//              INIT               //
/////////////////////////////////////

function preload(){
  presets = loadJSON('presets');
}


function setup() {
  polySequencer = new StepSequencer();
  
  cnv = createCanvas(600, 500);
  cnv.mousePressed(polySequencer.canvasPressed);
  cnv.mouseMoved(polySequencer.canvasMoved);
  cnv.mouseReleased(polySequencer.canvasReleased);
  cnv.touchStarted(polySequencer.canvasPressed);
  cnv.touchMoved(polySequencer.canvasMoved);
  cnv.touchEnded(polySequencer.canvasReleased);
  
  // cnv.touchStarted(function(event) {event.preventDefault()});
  // cnv.touchMoved(function(event) {event.preventDefault()});
  // cnv.touchEnded(function(event) {event.preventDefault()});

  /*CREATES THE PRESET PARAMETERS*/
  presetLength = Object.keys(presets).length;
  
  presetDropdown = createButton("presets");
  presetDropdown.id("dropbtn");
  presetDropdown.parent("dropdown");
  presetDropdown.position(0, 450);
  
  presetDropdownContentDiv = createDiv();
  presetDropdownContentDiv.id("dropdown-content");
  presetDropdownContentDiv.parent("dropbtn");

  for (let i = 0; i < presetLength; i++) {
    presetButtons[i] = createButton(i + 1);
  //  presetButtons[i].position(i * 30, 0)
    presetButtons[i].id(i + 1);
    presetButtons[i].mousePressed(setPresets);
    presetButtons[i].parent("dropdown-content");
  }

  saveButton = createButton("Save Preset");
  saveButton.id("savebtn");
  saveButton.mousePressed(savePreset);
  saveButton.position(310, 450);

  playButton = createButton('play');
  playButton.class('playButtons');
  playButton.position(0, 0);
  playButton.mousePressed(playButtonPressed);
  
  
	volumeSlider = createSlider(-100, 0, 0);
  volumeSlider.id("polyVolume");
  volumeSlider.class('volume');
  volumeSlider.position(400, 200);

  polySequencer.drawMatrix();

  Tone.Master.mute = true;

  polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
  polySynth.set({
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
  polySynth.set({
    'volume': (polySequencer.polySeq[counter].length * -1.0) + volumeSlider.value()
  });
  
  polySynth.triggerAttackRelease(polySequencer.polySeq[counter].filter(filterUndefined), '8n', time);

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
    background(220);
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


      //find out how to construct an array and push that into an array
      if (this.polyMatrix[toRowIndex][toColumnIndex] === 1) {
        this.polySeq[toColumnIndex].splice(toRowIndex, 1, this.polyNotes[toRowIndex]);
      } else if (this.polyMatrix[toRowIndex][toColumnIndex] === 0) {
        this.polySeq[toColumnIndex].splice(toRowIndex, 1, undefined);
      }

    }
  }
  
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
  let whichButton = presets[myID];

  // deep clone an array of arrays
  let setSequence = whichButton.sequence.map(i => ({...i}));
  
  polySequencer.polyMatrix = setSequence;
  
  polySequencer.drawMatrix();
  polySequencer.polyMatrixNotes();
}

/////////////////////////////////////
//          SAVES PRESETS           //
/////////////////////////////////////

function savePreset() {
  presetLength = Object.keys(presets).length;
  let newKey = presetLength + 1;
  console.log(newKey);
  /*Preset in dictonary format 
  Loading it like this creates the new key*/
  let newPreset = {
      "sequence": polySequencer.polyMatrix
  };

  if (confirm("Would you like to save your presets?")) {
    presets[newKey] = newPreset;
  }
  presetButtons[presetLength] = createButton(presetLength + 1);
 // presetButtons[presetLength].position(presetLength * 30, 0)
  presetButtons[presetLength].id(presetLength + 1);
  presetButtons[presetLength].mousePressed(setPresets);
  presetButtons[presetLength].parent("dropdown-content");
  Tone.context.resume();
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
