const playSound = (sound) => {
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
};

const numberOfSounds = 10,
  numberOfTracks = 6;

const playButton = document.querySelector(".play"),
  loopInput = document.querySelector("#loop"),
  addTrackButton = document.querySelector(".add"),
  plusButton = document.querySelector(".plus"),
  minusButton = document.querySelector(".minus"),
  speedSpan = document.querySelector(".speed span"),
  tracksContainer = document.querySelector(".tracks"),
  tracks = [],
  recordings = [];

let trackIndex = 0;

const KeyToSound = {
  a: document.querySelector("#s1"),
  s: document.querySelector("#s2"),
  d: document.querySelector("#s3"),
  f: document.querySelector("#s4"),
  g: document.querySelector("#s5"),
  h: document.querySelector("#s6"),
  j: document.querySelector("#s7"),
  k: document.querySelector("#s8"),
  l: document.querySelector("#s9"),
};

const removeTrack = (id) => {
  const foundTrack = tracks.find((track) => track.id === id),
    trackIndex = tracks.indexOf(foundTrack);

  foundTrack.container.remove();

  tracks.splice(trackIndex, 1);
  recordings.splice(trackIndex, 1);
};

const generateTrack = () => {
  const trackDiv = document.createElement("div");
  trackDiv.className = "track";

  const recordButton = document.createElement("button");
  recordButton.textContent = "Record";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  const soundsDiv = document.createElement("div");
  soundsDiv.className = "sounds";

  const arrayOfSounds = [];

  for (let i = 0; i < numberOfSounds; i++) {
    const soundDiv = document.createElement("div");
    soundsDiv.appendChild(soundDiv);
    arrayOfSounds.push(soundDiv);
  }

  const checkboxInput = document.createElement("input");
  checkboxInput.type = "checkbox";

  trackDiv.appendChild(recordButton);
  trackDiv.appendChild(deleteButton);
  trackDiv.appendChild(soundsDiv);
  trackDiv.appendChild(checkboxInput);

  tracksContainer.appendChild(trackDiv);

  const track = {
    id: trackIndex,
    delete: deleteButton,
    button: recordButton,
    sounds: arrayOfSounds,
    checkbox: checkboxInput,
    container: trackDiv,
  };

  trackIndex++;

  tracks.push(track);
  recordButton.addEventListener("click", () =>
    recordTrack(track.id, arrayOfSounds)
  );
  deleteButton.addEventListener("click", () => removeTrack(track.id));
  recordings.push({ id: track.id, sounds: [] });
};

for (let i = 0; i < numberOfTracks; i++) {
  generateTrack();
}

let currentSoundIndex = null,
  currentTrackIndex = null,
  currentRecordingIndex = null;

const onKeyPress = (event) => {
  if (currentTrackIndex !== null) {
    const sounds = tracks.find(
        (track) => track.id === currentTrackIndex
      ).sounds,
      currentSound = sounds[currentSoundIndex],
      nextSound = sounds[currentSoundIndex + 1];

    if (event) {
      currentSound.innerHTML = event.key;
      const recording = recordings.find((rec) => rec.id === currentTrackIndex);
      recording.sounds[currentSoundIndex] = event.key;
      playSound(KeyToSound[event.key]);
    }

    sounds[currentSoundIndex].style.borderColor = "grey";

    if (nextSound) {
      nextSound.style.borderColor = "red";
    }

    currentSoundIndex++;

    if (currentSoundIndex > sounds.length - 1) {
      for (const sound in sounds) {
        if (sounds[sound] && sounds[sound].style) {
          sounds[sound].style.borderColor = "black";
        }
      }
      currentTrackIndex = null;
    }
  }
};

const recordTrack = (trackIndex, sounds) => {
  currentSoundIndex = 5;
  onKeyPress();
  currentTrackIndex = trackIndex;
  currentSoundIndex = 0;

  tracks.forEach(track=>{
    track.sounds.forEach(sound=>{
      sound.style.borderColor = "black";
    })
  })

  for (const sound in sounds) {
    if (sounds[sound] && sounds[sound].style) {
      sounds[sound].innerHTML = "";
      sounds[sound].style.borderColor = "grey";
    }
  }
  sounds[0].style.borderColor = "red";
};

document.addEventListener("keypress", onKeyPress);

const currentTimeouts = [];

let shouldBePlayingSound = true,
  currentSpeed = 1000;

const playOneRound = (recordingIndex, shouldLoop) => {
  const currentRecordings = recordings.find((rec) => rec.id === recordingIndex);

  if(currentRecordings){
    for (let i = 0; i < currentRecordings.sounds.length; i++) {
      currentTimeouts[recordingIndex] = setTimeout(() => {
        shouldBePlayingSound && playSound(KeyToSound[currentRecordings.sounds[i]]);
        if (i === currentRecordings.sounds.length - 1) {
          if(shouldLoop){
            playOneRound(recordingIndex, shouldLoop);
          } else {
            playButton.innerHTML = "PLAY"
          }
        }
      }, currentSpeed * i);
    }
  }
};

playButton.addEventListener("click", function (e) {
  if(this.innerHTML==="PLAY"){
    this.innerHTML = "PAUSE"

    shouldBePlayingSound = true;
    tracks.forEach(({ checkbox, id }) => {
      if (currentTimeouts[id]) {
        clearTimeout(currentTimeouts[id]);
      }
      if (checkbox.checked) {
        playOneRound(id, loopInput.checked);
      }
    });
  } else {
    this.innerHTML = "PLAY"

    shouldBePlayingSound = false;
    tracks.forEach(({ id }) => {
      if (currentTimeouts[id]) {
        clearTimeout(currentTimeouts[id]);
      }
    });
  }
});

addTrackButton.addEventListener("click", function () {
  generateTrack();
});

const changeSpeed = (speed) => {
  currentSpeed = 60000 / speed;
  console.log(currentSpeed, speed)
  speedSpan.innerHTML = speed;
}

plusButton.addEventListener("click", function(){
  const newSpeed = +speedSpan.innerHTML + 5;
  changeSpeed(newSpeed);
})

minusButton.addEventListener("click", function(){
  const newSpeed = +speedSpan.innerHTML - 5
  changeSpeed(newSpeed > 0 ? newSpeed : 5);
})
