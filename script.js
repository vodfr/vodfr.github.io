const links = document.querySelectorAll("a.open");
const msg = document.querySelector(".message-box");
const videoElement = document.getElementById("videoContainer");
const video = document.getElementById("my-video");
const iframeContainer = document.getElementById("iframe-container");
const bar = document.querySelector(".custom-controls");
const b = document.querySelector("button");
const elem = document.querySelector("body");
let iframe = null;
let iframeCreated = false;
let dynToggle;
let hideTimer;
let player;
let downloadSize = 10000000;
let elapsedTime = 0;
let startTime;
let timeoutId;
let timer;
window.addEventListener("load", () => {
  player = videojs("my-video", {
    controls: false,
    autoplay: false,
    preload: "auto",
    techOrder: ["html5"]
  });
msg.innerHTML = "Bienvenue sur le site!";
document.getElementById("sideMenu").classList.add("open");
startSpeedTest();
});
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const clickedLink = link.getAttribute("data-id");

      startSpeedTest();
      if (iframeContainer) {
        iframeContainer.style.display = "none";
        videoElement.style.display = "block";
        iframeContainer.innerHTML = "";
      }
      if (dynToggle) {
        dynToggle.style.display = "none";
      }

      fullscreenBtn.classList.remove("hidden");
      castBtn.classList.remove("hidden");
      iframeCreated = false;

      var xhr = new XMLHttpRequest();

      var baseURL =
        "https://raw.githubusercontent.com/vodfr/ma00tv.github.io/refs/heads/main/db.json";

      xhr.open("GET", baseURL, true);

      xhr.onload = function () {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);

          for (var i = 0; i < data.length; i++) {
            if (data[i].chaine.title === clickedLink) {
              if (data[i].chaine.protocol === "https") {
                player.src({
                  src: data[i].chaine.url,
                  type: "application/x-mpegURL"
                });

                player.ready(function () {
                  player.load();
                  player.play();
                  openFullscreen();
                });
              } else {
                player.pause();
                window.open(data[i].chaine.url);
              }

              player.on("play", function () {
                msg.style.display = "block";
                msg.innerHTML =
                  "<marquee width='100%' direction='left' scrollamount='10'>" +
                  link.textContent +
                  " est en <b>LECTURE...</b></marquee>";
              });
              player.on("pause", function () {
                msg.style.display = "block";
                msg.innerHTML =
                  "<marquee width='100%' direction='left' scrollamount='10'>" +
                  link.textContent +
                  " est en <b>PAUSE</b></marquee>";
              });
          
              player.on("waiting", () => {
              controls();
              });
              player.on("playing", () => {
              controls();
              });
            }
          }
        }
      };

      xhr.send();
    });
  });

  let startX;
  document.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
  });
  document.addEventListener("touchmove", function (e) {
    let touch = e.touches[0];

    let deltaX = touch.clientX - startX;

    if (deltaX > 50) {
      fullscreenBtn.classList.remove("hidden");
      castBtn.classList.remove("hidden");
      document.getElementById("sideMenu").classList.add("open");
    } else if (deltaX < -50) {
      startHideTimer();
      document.getElementById("sideMenu").classList.remove("open");
    }
    
  });

  b.addEventListener("click", function () {
    const api = "https://api.vevioz.com/apis/search/";

    const d = document.querySelector(".elem");

    const mp3 = d.value;

    window.open(api + mp3);
  });

  document.querySelectorAll(".iframe").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      controls();
      if (videoElement) {
        iframeContainer.style.display = "block";
        videoElement.style.display = "none";
      }
      fullscreenBtn.classList.remove("hidden");
      msg.innerHTML =
        "<marquee width='100%' direction='left' scrollamount='5'>" +
        link.textContent +
        " est en <b>LECTURE...</b></marquee>";

      const iframeSrc = this.getAttribute("data-id");

      iframeContainer.style.display = "block";

      playWithIframe(iframeSrc);
    });
  });
  function playWithIframe(iframeSrc) {
    let changed;
    if (changed) {
      clearTimeout(changed);
    }
    changed = setTimeout(function () {
      if (player) {
        player.pause();
      } else {
        player = videojs("my-video", {
        controls: false,
        autoplay: false,
        preload: "auto",
        techOrder: ["html5"]
        });
        player.pause();
      }
      controls();
    }, 4000);
     
    iframe = document.getElementById("dynamic-iframe");

    if (!iframe) {
      iframe = document.createElement("iframe");
    }

    iframe.id = "dynamic-iframe";

    iframe.src = iframeSrc;

    iframe.width = "100%";

    iframe.height = "100%";

    iframe.frameBorder = "0";

    iframe.allowFullscreen = true;

    iframe.allowTransparency = true;

    iframe.style.display = "block";

    iframeContainer.appendChild(iframe);

    iframeCreated = true;

    const message = "&#9776;";
    const existingP = document.querySelector("#menuToggle");
    if (existingP) {
      existingP.remove();
    }
    dynToggle = document.createElement("div");
    dynToggle.id = "menuToggle";
    dynToggle.innerHTML = message;
    dynToggle.style.position = "fixed";
    dynToggle.style.top = "50%";
    dynToggle.style.left = "0";
    dynToggle.style.backgroundColor = "#000";
    dynToggle.style.color = "white";
    dynToggle.style.padding = "0px";
    dynToggle.style.cursor = "pointer";
    dynToggle.style.textAlign = "center";
    dynToggle.style.width = "30px";
    dynToggle.style.height = "30px";
    dynToggle.style.lineHeight = "30px";
    dynToggle.style.fontSize = "20px";
    dynToggle.style.transform = "translateY(-50%)";
    dynToggle.style.border = "1px solid white";
    dynToggle.style.borderRadius = "8px";
    dynToggle.style.zIndex = "999";
    dynToggle.style.boxSizing = "border-box";
    dynToggle.style.display = "block";
    dynToggle.classList.add("styleBtn");
    document.body.appendChild(dynToggle);
    dynToggle.addEventListener("click", function () {
      if (dynToggle) {
        document.getElementById("sideMenu").classList.toggle("open");
      } else {
        document.getElementById("sideMenu").classList.remove("open");
      }
    });
    if (iframeCreated) {
      openFullscreen();
    }
  }

function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    // Safari
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    // IE11
    elem.msRequestFullscreen();
  }
}

const fullscreenBtn = document.getElementById("fullscreenBtn");
const fullscreenIcon = fullscreenBtn.querySelector("i");
fullscreenBtn.addEventListener("click", function () {
  if (iframeCreated === true) {
    if (!iframeContainer.fullscreenElement) {
      document.getElementById("sideMenu").classList.remove("open");
      iframeContainer.requestFullscreen();
      fullscreenIcon.classList.remove("fa-expand");
      fullscreenIcon.classList.add("fa-compress");
      startHideTimer();
    } else {
      if (iframeContainer.exitFullscreen) {
        iframeContainer.exitFullscreen();
        fullscreenIcon.classList.remove("fa-compress");
        fullscreenIcon.classList.add("fa-expand");
        fullscreenBtn.classList.remove("hidden");

        clearTimeout(hideTimer);
      }
    }
  } else {
    video.requestFullscreen();
  }
});

function startHideTimer() {
  if (hideTimer) {
    clearTimeout(hideTimer);
  }
  hideTimer = setTimeout(() => {
    fullscreenBtn.classList.add("hidden");
    castBtn.classList.add("hidden");
  }, 6000);
}
document.addEventListener("fullscreenchange", function () {
  if (iframeContainer.fullscreenElement) {
    startHideTimer();
  } else {
    clearTimeout(hideTimer);
    castBtn.classList.remove("hidden");
    fullscreenBtn.classList.remove("hidden");
    document.getElementById("sideMenu").classList.add("open");
  }
});
const searchInput = document.getElementById("searchInput");
const chaines = Array.from(document.querySelectorAll("#sideMenu a"));
function filterAndHighlight() {
  const filter = searchInput.value.toLowerCase();

  if (filter === "") {
    chaines.forEach((chaine) => chaine.classList.remove("highlight"));
    return;
  }

  let firstMatch = null;

  chaines.forEach((chaine) => {
    const text = chaine.textContent.toLowerCase();
    if (text.includes(filter)) {
      chaine.classList.add("highlight");
      if (!firstMatch) {
        firstMatch = chaine;
      }
    } else {
      chaine.classList.remove("highlight");
    }
  });

  if (firstMatch) {
    firstMatch.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}
searchInput.addEventListener("input", filterAndHighlight);
document.querySelectorAll(".conteneur").forEach(function (conteneur) {
  const title = conteneur.querySelector(".section-title");

  title.addEventListener("click", function () {
    conteneur.classList.toggle("active");
  });
});


function updateSpeed() {
  let currentTime = new Date().getTime();
  let duration = (currentTime - startTime) / 1000;
  let bitsLoaded = downloadSize * 8;
  let speedBps = bitsLoaded / duration;
  let speedMbps = (speedBps / (1024 * 1024)).toFixed(2);
  let percentage = Math.min((speedMbps / 100) * 100, 100).toFixed(2);
  document.getElementById("speed-display").textContent = speedMbps + " Mbps";

  let qualityText = "";
  let qualityClass = "";
  let signalBars = document.querySelectorAll(".signal-bar");
  let activeBars = Math.ceil((percentage / 100) * signalBars.length);
  signalBars.forEach((bar, index) => {
    if (index < activeBars) {
      bar.classList.add("active");
      if (percentage > 80) {
        qualityText = "Excellente";
        qualityClass = "excellent";
        bar.style.backgroundColor = "lime";
      } else if (percentage >= 50) {
        qualityText = "Bonne";
        qualityClass = "good";
        bar.style.backgroundColor = "yellow";
      } else {
        qualityText = "Faible";
        qualityClass = "poor";
        bar.style.backgroundColor = "red";
      }
      let percentageDisplay = document.getElementById("percentage-display");
      percentageDisplay.textContent = percentage + "% (" + qualityText + ")";
      percentageDisplay.className = "percentage-display " + qualityClass;
    } else {
      bar.classList.remove("active");
      bar.style.backgroundColor = "#fff";
    }
  });

  let distance = calculateDistance();
  let type = determineConnectionType(speedMbps);
  document.getElementById("distance-display").textContent =
    "Distance: " + distance + " m";
  document.getElementById("type-display").textContent = "Type: " + type;
}

function startSpeedTest() {
  startTime = new Date().getTime();
  document.getElementById("type-display").textContent = "Type: Inconnu";
  timer = setInterval(function () {
    elapsedTime += 1000;
    updateSpeed();
    if (elapsedTime >= 1000) {
      clearInterval(timer);
    }
  }, 1000);
}

function calculateDistance() {
  return Math.floor(Math.random() * 1000) + 1;
}

function determineConnectionType(speedMbps) {
  if (speedMbps > 50) {
    return "5G";
  } else if (speedMbps > 20) {
    return "4G";
  } else if (speedMbps > 5) {
    return "Wi-Fi";
  } else {
    return "Ethernet";
  }
}


function controls() {
  bar.style.opacity = "1";
  msg.style.display = "block";
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(function () {
    bar.style.opacity = "0";
    msg.style.display = "none";
  }, 2000);
}
video.addEventListener("touchmove", () => {
  controls();
});
const controlplay = document.querySelector("#play-button");
const controlpause = document.querySelector("#pause-button");
const controlfull = document.querySelector("#fullscreen-button");
controlplay.addEventListener("click", () => {
  player.play();
});
controlpause.addEventListener("click", () => {
  player.pause();
});
controlfull.addEventListener("click", () => {
  video.requestFullscreen();
});

