const startButton = document.getElementById("startRecording");
const stopButton = document.getElementById("stopRecording");
const downloadLinkContainer = document.getElementById("downloadLinkContainer");
const recordingTimeDisplay = document.getElementById("recordingTime");
const lecteur = document.getElementById("lecteur");
let mediaRecorder;
let chunks = [];
let recordingInterval;
let startTime, audioElement, address;
let currentURL = window.location.href;
let radios = [
  { radio: { name: "bejaia", data: "https://webradio.tda.dz/Bejaia_64K.mp3"}},
  { radio: { name: "raina", data: "https://radiodzair.net:8060/raina"}},
  { radio: { name: "jilfm", data: "https://webradio.tda.dz/Jeunesse_64K.mp3"}},
  { radio: { name: "hawa", data: "https://radio4.pro-fhi.net/radio/9062/stream.mp3"}},
  { radio: { name: "iz", data: "https://radio-dzair.net/proxy/izuran/izuran?shoutcast"}},
  { radio: { name: "coran", data: "https://webradio.tda.dz/Coran_64K.mp3"}},
  { radio: { name: "oriental", data: "https://radiodzair.net:8070/orientale?shoutcast"}},
  { radio: { name: "chaabia", data: "https://radiodzair.net:8010/chaabia?shoutcast"}},
  { radio: { name: "chansons", data: "https://chantefrance.ice.infomaniak.ch/chantefrance-128.mp3"}},
  { radio: { name: "bast", data: "https://server03.quran-uni.com:7000/;*.mp3"}}
 
  ];
for (let i = 0; i < radios.length; i++) {
  let nameRadio = radios[i].radio.name;

  if (currentURL.includes(nameRadio)) {
    console.log("Région trouvée dans l'URL : " + nameRadio);

    console.log("Adresse de la radio : " + radios[i].radio.data);

    address = radios[i].radio.data;

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

  recordingTimeDisplay.innerHTML =
    "Temps d'enregistrement : <b>" + minutes + ":" + seconds + "</b>";
}
function audioRecorder(chaine) {
  chaine = address;
  const audioContext = new AudioContext();

  audioElement = new Audio(chaine);

  audioElement.crossOrigin = "anonymous";

  audioElement.currentTime = lecteur.currentTime;

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

  startButton.classList.add("active_button");

  stopButton.disabled = false;

  stopButton.classList.remove("active_button");
}
stopButton.onclick = () => {
  mediaRecorder.stop();

  audioElement.currentTime = lecteur.currentTime;

  audioElement.pause();

  lecteur.pause();

  stopButton.disabled = true;

  stopButton.classList.add("active_button");

  startButton.disabled = false;

  startButton.classList.remove("active_button");

  clearInterval(recordingInterval);

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

