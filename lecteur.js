const startButton = document.getElementById('startRecording');
        const stopButton = document.getElementById('stopRecording');
        const downloadLinkContainer = document.getElementById('downloadLinkContainer');
        const recordingTimeDisplay = document.getElementById('recordingTime');
        let mediaRecorder;
        let chunks = [];
        let recordingInterval;
        let startTime;
        function updateRecordingTime() {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000); 
            const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
            const seconds = String(elapsedTime % 60).padStart(2, '0');
            recordingTimeDisplay.textContent = `Temps d'enregistrement : ${minutes}:${seconds}`;
        }
        startButton.onclick = () => {
           const audioContext = new AudioContext();
           const audioElement = new Audio('https://webradio.tda.dz/Bejaia_64K.mp3');
           audioElement.crossOrigin = "anonymous"; 
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
        stopButton.onclick = () => {
            mediaRecorder.stop();
            stopButton.disabled = true;
            startButton.disabled = false;
          clearInterval(recordingInterval);
            recordingTimeDisplay.textContent = 'Temps d\'enregistrement : 00:00';
            mediaRecorder.onstop = function () {
                const blob = new Blob(chunks, { type: 'audio/mpeg' });
                const audioURL = URL.createObjectURL(blob);
                const downloadLink = document.createElement('a');
                downloadLink.href = audioURL;
                downloadLink.download = 'enregistrement.mp3';
                downloadLink.textContent = 'Télécharger l\'enregistrement';
                downloadLinkContainer.innerHTML = '';
                downloadLinkContainer.appendChild(downloadLink);
                chunks = [];
            };
        };
