/*(C) Dominic Miguel Strong, January 22nd 2018, 345links@gmail.com*/

var morseCode = {
  /*
  List of basic letter character definitions to translate

  *** NOTE: Any symbol does not work at the moment  ***
    */
  a: ".--",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",

  _0: "-----",
  _1: ".----",
  _2: "..---",
  _3: "...--",
  _4: "....-",
  _5: ".....",
  _6: "-....",
  _7: "--...",
  _8: "---..",
  _9: "----.",

  legal: "abcdefghijklmnopqrstuvwxyz1234567890 " //This space at the end is important .-.

}
morseCode.legal = morseCode.legal.split(""); //im lazy and efficient.


// reference to the input feild in the index file
inputBox = $("#input")
inputText = "";


// reference to the output feild in the index file
outputBox = $("#output")
outputText = "";


//The submit button will call the morse fuction to translate
button = $("#submit");


/*This is a list of how to treat the audio elements. This section defines how
long a dot, dash, space, and character spaces are. Also the frequency of the beeps*/


/*
Error: Audio Context Must Be created after a gesture on the page
var context = new AudioContext()
Context will now be defined when the morse() function is called
*/
defineOnce = 0;



/*dot slider on the settings tab 
range from 1 to 1000*/

dotSlide = $("#dotSlide");

/*dash slider on the settings tab 
range from 1 to 1000*/

dashSlide = $("#dashSlide");

/*character space slider on the settings tab 
range from 1 to 300*/
charSpaceSlide = $("#charSpaceSlide"); //300

/*space slider on the settings tab 
range from 1 to 300*/

spaceSlide = $("#spaceSlide");

/*frequency slider on the settings tab 
range from 1 to 1000*/

frequencySlide = $("#frequencySlide")

//Variable to make sure the user doesnt spam the play button >:c
playing = false;

graph = document.getElementById("graph")
ctx = graph.getContext("2d");

ctx.fillStyle = "#EEEEEE";
ctx.fillRect(0, 0, graph.width, graph.height);


function RecordAudio(stream, cfg) {

  var config = cfg || {};
  var bufferLen = config.bufferLen || 4096;
  var numChannels = config.numChannels || 2;
  this.context = stream.context;
  var recordBuffers = [];
  var recording = false;
  this.node = (this.context.createScriptProcessor ||
    this.context.createJavaScriptNode).call(this.context,
    bufferLen, numChannels, numChannels);

  stream.connect(this.node);
  this.node.connect(this.context.destination);

  this.node.onaudioprocess = function(e) {
    if (!recording) return;
    for (var i = 0; i < numChannels; i++) {
      if (!recordBuffers[i]) recordBuffers[i] = [];
      recordBuffers[i].push.apply(recordBuffers[i], e.inputBuffer.getChannelData(i));
    }
  }

  this.getData = function() {
    var tmp = recordBuffers;
    recordBuffers = [];
    return tmp; // returns an array of array containing data from various channels
  };

  this.start() = function() {
    recording = true;
  };

  this.stop() = function() {
    recording = false;
  };
}



setInterval(appLoop, 1000 / 60);



setDefaults();

function resetSlides() {
  dotSlide[0].value = defaultDotLength;
  dashSlide[0].value = defaultDashLength;
  charSpaceSlide[0].value = defaultCharSpaceLength;
  spaceSlide[0].value = defaultSpaceLength;
  frequencySlide[0].value = defaultFrequency;
}

function setDefaults() {


  //How long a dot is
  dotLength = defaultDotLength = 300;

  //How long a dash is
  dashLength = defaultDashLength = 550;

  //space between dots and dashes
  charSpaceLength = defaultCharSpaceLength = 70;

  //how long there is no sound between words
  spaceLength = defaultSpaceLength = 230;

  //The frequency/pitch of a beep
  frequency = defaultFrequency = 800;

  /*Re-adjust the sliders because if i dont, the value they were at before will just overide
  the new values when the appLoop comes around*/
  resetSlides();
}

function appLoop() {

  /*This if statement is a bug fix. When I typed into a text feild, the alt/filler text would not dissapear
  so i just did it manually here*/

  if (document.getElementById("output").value == "") {

    document.getElementById("output1lable").innerHTML = "output..."

  } else {

    document.getElementById("output1lable").innerHTML = ""

  }

  //ajustable settings

  /*
  This app will constantly refer to the sliders in the
  settings tab to change the values of the audio variables
  this will create a live update effect in the settings

  */

  dotLength = slideVal(dotSlide);

  dashLength = slideVal(dashSlide);

  charSpaceLength = slideVal(charSpaceSlide);

  spaceLength = slideVal(spaceSlide);

  frequency = slideVal(frequencySlide);
}

function slideVal(slider) {

  return slider["0"].valueAsNumber

}

function morse() {

  /*
  #1 Get the input Text
  #2 Loop through the character string
  #3 Match the single character to the defined morse translation
  #4 add it to the output string
    #5 Display the output string into the output text feild
    */
  if (defineOnce == 0) {
    context = new AudioContext()
  }
  defineOnce++;

  //resetting the output text
  outputText = "";


  //getting what the user typed in
  inputText = document.getElementById("input").value



  for (var i = 0; i < inputText.length; i++) {

    /* loop through all the characters of the input text*/


    //get the current character the input string
    var char = inputText[i];



    /*set the character to lower case because the capitalization doesnt change
    the morse code but i will have to make more definitions
        */

    char = char.toLowerCase()



    if (morseCode.legal.indexOf(char) == -1) {
      console.log("ERROR: Input contains illegal character : " + char);

      $("#input").css({
        "border": "6px solid red"
      })

      return;

    } else {
      console.log("legal")
      $("#input").css({
        "border": "1px solid rgba(0,0,0,.12)",
        "border-top": "0px",
        "border-right": "0px",
        "border-left": "0px"
      })


    }



    /*
        as long as the current character is not a space 
        you can keep going
        */

    if (char != " ") {

      /*If you look at the key for the number definitions at the top of the 
      file, you will notice every number starts with a underscore ex(_1:, _2:)
      this is because having a single number ex (1:, 2:) will become a
      syntax error. Right here, I account for the underscore. If the
      current character from a string is a interger then add a underscore
      to the character string. So "1" becomes "_1". */

      if (Number.isInteger(parseInt(char))) {

        char = "_" + char;

      }

      /*This line allows for string to turn into javascript commands
      so when this line is read by the compiler it will say 
      morseText = morseCode.a or morseCode._1*/

      morseText = eval("morseCode." + char)


      // morseText = (morseText == "." ? "1" : 0)
      /*
      this could be an option setting to use 1's and 0's but i would have to 
      tweak the audio output (beep) function
      */

    } else {

      /* If the character is a space then there will be a space added to the
      output string*/

      morseText = " "


    }

    /*Finish By adding the translated text to the output*/
    outputText += morseText + " ";
  }


  /*Output the final text*/

  document.getElementById("output").value = outputText;

}




function play() {

  /*Starts off a chain reading the output morse code character by character*/

  if (!playing) {

    characterIndex = 0;

    chain();

  }

  playing = true;


}

function stopPlaying() {

  /*Breaks the chain loop by making the if statement, allowing it to continue, false*/

  characterIndex = outputText.length - 1;

}

function chain() {

  /*If im under the character limit of the outputText*/


  if (characterIndex <= outputText.length - 1) {


    // Get the current character
    var char = outputText[characterIndex];


    // If the character is a space
    if (char == " ") {


      // Dont make any sound and wait for the specified 
      // space time to loop again

      setTimeout(chain, spaceLength);
      characterIndex++;



    } else { // if the character is not a space

      //wait for the specified wait time between letters to make a beep sound

      setTimeout(function() {

        beep(char, chain /*callback*/ )

        //when the beep sound stops recall this method
        characterIndex++;

      }, charSpaceLength)


    }

  } else {

    //If were done , were not playing anything, you can press the button again

    playing = false;

  }

}

function beep(type0, callback0) {

  //We already know were going to make a beep but it just depends on
  //when we stop the beep.

  var type = type0;

  var callback = callback0 || function() {}

  var o = context.createOscillator() //cant explain this ;p

  var g = context.createGain() //cant explain that

  o.frequency.value = frequency; //set the pitch and shiz

  o.connect(g) //dunnno

  g.connect(context.destination) //idk

  o.start(0) //ahh! this is familiar ;)

  //duration of a beep
  var time = 0;

  switch (type) {
    case "-":
      //if the character is a dash then the duration is the dash length
      time = dashLength;
      break
    case ".":
      //if the character is a dot then the duration is the dot length
      time = dotLength;
      break
  }

  setTimeout(function() { // wait the length of the character

    //after the wait stop the beep
    o.stop();

    //feedback to the console
    console.log('beep: ' + type)

    //start the chain again to start on the next character
    callback();

  }, time);

}

function recordAudioVolume() {
  audioContext = null;
  meter = null;
  mediaStreamSource = null;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContext();
  try {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    navigator.getUserMedia({
      "audio": {
        "mandatory": {
          "googEchoCancellation": "false",
          "googAutoGainControl": "false",
          "googNoiseSuppression": "false",
          "googHighpassFilter": "false"
        },
        "optional": []
      },
    }, function(stream) {
      /*
       * In this function the morse code app can 
       * start to listen in the changes in volume/pitch
       * the differences in pitches will be calculated 
       * to create the diffrent letters in morse code
       */
      mediaStreamSource = audioContext.createMediaStreamSource(stream);
      meter = createAudioMeter(audioContext);
      mediaStreamSource.connect(meter);


      hear()



    }, function() {
      alert('Stream generation failed.');
    });
  } catch (e) {
    alert('getUserMedia threw exception :' + e);
  }
}
calibrated = false

function hear() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, graph.width, graph.height);

  recordingTime = 15000
  recordingRate = 1000 / 60

  dataset = []
  dataSetID = 0;

  highestPoints = []
  highestPointID = 0;

  hearingOutput = "";

  //Get the data
  console.log("Recording...")
  offset = 0;
  if (!calibrated) {
    prevY = 0;
    y = 0;
    total = 0;
    average = 0;
    threshold = 2.3 //1.5
    averageAndThreshold = 0;
  }

  hearing = setInterval(function() {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, graph.width, graph.height);

    dataset[dataSetID] = meter.volume;
    if (!calibrated) {
      total += meter.volume;
      average = total / dataset.length
      averageAndThreshold = average * threshold;
    }
    for (var i = 0; i < dataset.length; i++) {

      if (i == 0) {
        ctx.beginPath()
        ctx.moveTo(0, graph.height)
        ctx.strokeStyle = "yellow";
        ctx.lineTo(dataSetID, graph.height)
        ctx.stroke()
        ctx.closePath()
      } else {
        //console.log("rgb(" + 255 - (Math.floor(255 * g(dataset[i - 1]) / graph.height)) + ", " + 0 + ", " + 0 + ")")
        ctx.beginPath()
        r = Math.floor(255 * (g(dataset[i - 1]) / graph.height))
          //console.log(r)
        c = "rgb(" + r + ", " + 0 + ", " + (255 - r) + ")"
        if (calibrated) {
          c = "rgb(" + 0 + ", " + (255 - r) + ", " + r + ")"
            // console.log(c)
        }
        ctx.lineWidth = 2
        ctx.strokeStyle = c;
        ctx.moveTo(i - 1 + offset, g(dataset[i - 1]))
        ctx.lineTo(i + offset, g(dataset[i]))
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.lineWidth = 1;
        ctx.strokeStyle = "yellow"
        ctx.moveTo(0, g(averageAndThreshold))
        ctx.lineTo(graph.width, g(averageAndThreshold))
        ctx.stroke()
        ctx.closePath()


        ctx.beginPath()
        ctx.lineWidth = 1;
        ctx.strokeStyle = "blue"
        ctx.moveTo(0, g(average))
        ctx.lineTo(graph.width, g(average))
        ctx.stroke()
        ctx.closePath()

      }
    }
    ctx.fillStyle = "yellow"
    ctx.font = "10px Arial";
    ctx.fillText("threshold: " + averageAndThreshold, 10, g(averageAndThreshold) - 5);

    ctx.fillStyle = "blue"
    ctx.font = "10px Arial";
    ctx.fillText("average: " + average, 10, g(average) - 5);

    if (!calibrated) {
      ctx.fillStyle = "white"
      ctx.font = "10px Arial";
      ctx.fillText("Calibrating...(" + recordingTime / 1000 + " seconds)", 10, 10);
    } else {
      ctx.fillStyle = "white"
      ctx.font = "10px Arial";
      ctx.fillText("Recording...(" + recordingTime / 1000 + " seconds)", 10, 10);
    }

    if (dataSetID > graph.width) {
      offset--;
    }
    // ctx.fillRect(dataSetID, y, 1, 1)

    dataSetID++;
  }, recordingRate)

  setTimeout(function() {
    clearInterval(hearing)
    if (!calibrated) {
      average = 0;
      count = 0;
      for (var i = 0; i < dataset.length; i++) {
        average += dataset[i]
        count++;
      }
      average = average / count;
      console.log("average: " + average)
      console.log("average and threshold: " + averageAndThreshold)
      console.log(dataset)
    }
    if (!calibrated) {
      calibrated = true
      hear()
    } else {
      for (var i = 0; i < dataset.length; i++) {
        if (dataset[i] > averageAndThreshold && dataset[i] > dataset[i - 1] && dataset[i] > dataset[i + 1]) {
          highestPoints[highestPointID] = {
            time: i,
            value: dataset[i]
          }
          highestPointID++;
        }
      }

      for (var i = 0; i < highestPoints.length; i++) {
        /*if (i != 0) {
          timeDistances[timeDistanceID] = highestPoints[i].time - highestPoints[i - 1].time;
          timeDistanceID++;
        }*/
        /*if (i == highestPoints.length - 1) {
          highestPoints[i].duration = 2000
        } else {
          highestPoints[i].duration = highestPoints[i + 1].time - highestPoints[i].time
        }*/
        if (i == 0) {
          highestPoints[i].duration = highestPoints[i].time
        } else {
          highestPoints[i].duration = highestPoints[i].time - highestPoints[i - 1].time
        }
      }
      console.log(highestPoints);
      //console.log(timeDistances)
    }

    for (var i = 0; i < highestPoints.length; i++) {
      if (highestPoints[i].duration < 50 || highestPoints[i].duration >= 2000) {

        hearingOutput += "."

      } else {

        if (highestPoints[i].duration < 80) {

          hearingOutput += "-"

        } else {

          if (highestPoints[i].duration < 120) {

            hearingOutput += " "

          }
        }
      }
    }
    console.log(hearingOutput)


  }, recordingTime)
}

function g(x) {
  return graph.height - (200 * x * 2)
}