const startButton = document.getElementById("startRecording");
const lecteur = document.getElementById("lecteur");
const stopButton = document.getElementById("stopRecording");
const downloadLinkContainer = document.getElementById("downloadLinkContainer");
const recordingTimeDisplay = document.getElementById("recordingTime");
let mediaRecorder;
let chunks = [];
let recordingInterval;
let startTime;
let address;
let currentURL = window.location.href;
let radios = [
  {
    radio: {
      region: "bejaia",
      adresse: "https://webradio.tda.dz/Bejaia_64K.mp3"
    }
  },
  {
    radio: { region: "alger", adresse: "https://webradio.tda.dz/Alger_64K.mp3" }
  },
  { radio: { region: "oran", adresse: "https://webradio.tda.dz/Oran_64K.mp3" } }
];
for (let i = 0; i < radios.length; i++) {
  let region = radios[i].radio.region;
  if (currentURL.includes(region)) {
    console.log("Région trouvée dans l'URL : " + region);
    console.log("Adresse de la radio : " + radios[i].radio.adresse);
    address = radios[i].radio.adresse;
    break;
  }
}
document.getElementById("startRecording").addEventListener("click", function () {
    audioRecorder(address);
  });
function updateRecordingTime() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, "0");

  const seconds = String(elapsedTime % 60).padStart(2, "0");

  recordingTimeDisplay.textContent = `Temps d'enregistrement : ${minutes}:${seconds}`;
}

function audioRecorder(address) {
  startButton.onclick = () => {
    const audioContext = new AudioContext();

    const audioElement = new Audio(adresse);

    audioElement.crossOrigin = "anonymous";
    lecteur.play();
    audioElement.play();

    const source = audioContext.createMediaElementSource(audioElement);

    const streamDestination = audioContext.createMediaStreamDestination();

    source.connect(streamDestination);

    source.connect(audioContext.destination);

    mediaRecorder = new MediaRecorder(streamDestination.stream);

    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };

    mediaRecorder.start();

    startTime = Date.now();

    recordingInterval = setInterval(updateRecordingTime, 1000);

    startButton.disabled = true;

    stopButton.disabled = false;
  };
}
stopButton.onclick = () => {
  mediaRecorder.stop();

  stopButton.disabled = true;

  startButton.disabled = false;

  clearInterval(recordingInterval);

  audioElement.pause();
  audioElement.currentTime = 0;
  lecteur.pause();
  lecteur.currentTime = 0;
  recordingTimeDisplay.textContent = "Temps d'enregistrement : 00:00";

  mediaRecorder.onstop = function () {
    const blob = new Blob(chunks, { type: "audio/mpeg" });

    const audioURL = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");

    downloadLink.href = audioURL;

    downloadLink.download = "enregistrement.mp3";

    downloadLink.textContent = "Télécharger l'enregistrement";

    downloadLinkContainer.innerHTML = "";

    downloadLinkContainer.appendChild(downloadLink);

    chunks = [];
  };
};

