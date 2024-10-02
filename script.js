const links = document.querySelectorAll("a.open");

const msg = document.querySelector(".message-box");

const videoElement = document.getElementById("videoContainer");

const iframeContainer = document.getElementById("iframe-container");
let iframe = null;
let iframeCreated = false;

let player;

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const clickedLink = link.getAttribute("data-id");

    fullscreenBtn.classList.remove('hidden'); 

    iframeCreated = false;
    
    iframeContainer.innerHTML = ""; //formater le contenu ->

    videoElement.style.display = "block";

    var xhr = new XMLHttpRequest();

    var baseURL =
      "https://raw.githubusercontent.com/ma00tv/ma00tv.github.io/main/JB.json";

    xhr.open("GET", baseURL, true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        for (var i = 0; i < data.length; i++) {
          if (data[i].chaine.title === clickedLink) {
            if (data[i].chaine.protocol === "https") {
              player = videojs("my-video");

              player.src({
                src: data[i].chaine.url,

                type: player.currentType()
              });

              player.ready(function () {

          

                player.load();

                player.play();

                player.controls(true);

                openFullscreen();
              });
            } else {
              player.pause();

              window.open(data[i].chaine.url);
            }

            player.on("play", function () {
              msg.style.display = "block";

              msg.innerHTML = link.textContent + " est en <b>LECTURE...</b>";

              dialogbox();
            });

            player.on("pause", function () {
              msg.style.display = "block";

              msg.innerHTML = link.textContent + " est en <b>PAUSE</b>...";

              dialogbox();
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
  fullscreenBtn.classList.remove('hidden'); 
    document.getElementById("sideMenu").classList.add("open");
  } else if (deltaX < -50) {
  startHideTimer();
  document.getElementById("sideMenu").classList.remove("open");
    
  }
});


const b = document.querySelector("button");

const elem = document.querySelector("body");

b.addEventListener("click", function () {
  const api = "https://api.vevioz.com/apis/search/";

  const d = document.querySelector(".elem");

  const mp3 = d.value;

  window.open(api + mp3);
});


function dialogbox() {
  setTimeout(() => {
    msg.style.display = "none";

    msg.innerHTML = "";
  }, 3000);
}

document.querySelectorAll(".iframe").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    fullscreenBtn.classList.remove('hidden'); 
    videoElement.style.display = "none";

    msg.style.display = "block";

    msg.innerHTML = link.textContent + " est en <b>LECTURE...</b>";

    dialogbox();

    const iframeSrc = this.getAttribute("data-id");

    iframeContainer.style.display = "block";

    playWithIframe(iframeSrc);
  });
});



function playWithIframe(iframeSrc) {
  setTimeout(function () {
    if (player) {
      player.pause();
    } else {
      player = videojs("my-video");
      player.pause();
    }

    msg.style.display = "block";

    msg.innerHTML = "Rétablissement de la chaine ⚠️";

    dialogbox();
  }, 5000);
  
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
  
  const message = "&#8592;  balayer d'ici le MENU  &#8594;";

  const existingP = document.querySelector("p");

  if (existingP) {
    existingP.remove();
  }
  
  const dynPar = document.createElement("p");
  
  dynPar.innerHTML = message;
  
  iframeContainer.insertAdjacentElement("beforeend", dynPar);

  
  iframe.addEventListener("load", function () {   
  openFullscreen();
     });
}



window.addEventListener("load", () => {
  document.getElementById("sideMenu").classList.add("open");
  openFullscreen();
});


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
      
      videoElement.requestFullscreen();
      
      
  }
});

function startHideTimer() {
   
  hideTimer = setTimeout(() => {
    fullscreenBtn.classList.add("hidden");
  }, 4000);
}

document.addEventListener("fullscreenchange", function () {
  if (iframeContainer.fullscreenElement) {
    startHideTimer();
  } else {
    clearTimeout(hideTimer);

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
                            
