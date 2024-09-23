
const links = document.querySelectorAll("a.open");
const msg = document.querySelector(".message-box");
const videoElement = document.getElementById("my-video");
const iframeContainer = document.getElementById("iframe-container");
var iframe = null;
var player;
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
   const clickedLink = link.getAttribute("data-id");
    hideIframe();
    showVideo();
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
              player.ready(function() {
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
    // Swipe de gauche à droite (ouvrir le menu)
    document.getElementById("sideMenu").classList.add("open");
  } else if (deltaX < -50) {
    // Swipe de droite à gauche (fermer le menu)
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
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}
function dialogbox() {
  setTimeout(() => {
    msg.style.display = "none";
    msg.innerHTML = "";
  }, 3000);
}
document.querySelectorAll(".iframe").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    msg.style.display = "block";
    msg.innerHTML = link.textContent + " est en <b>LECTURE...</b>";
    const iframeSrc = this.getAttribute("data-id");
  
    playWithIframe(iframeSrc);
    dialogbox();
  });
});

function hideVideo() {
    videoElement.style.display = 'none'; 
}
function showVideo() {
    videoElement.style.display = 'block'; 
}
function hideIframe() {
    if (iframe) {
        iframe.style.display = 'none'; 
      
    }
}
function showIframe() {
    if (iframe) {
        iframe.style.display = 'block'; 
           
    }
}
function playWithIframe(iframeSrc) {
  if (!iframe) {
  iframe = document.createElement("iframe");
  iframe.id = "dynamic-iframe";
  iframeContainer.appendChild(iframe);
  iframe.src = iframeSrc;
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.frameBorder = "0";
  iframe.allowFullscreen = true;
  iframe.allowTransparency = true;
  iframe.style.display = "block";
const message = "Balayez dici à gauche &#8592; ou à droite &#8594; pour le menu.";

const existingP = document.querySelector("p");

if (existingP) {
    existingP.remove();
}
  
const dynPar = document.createElement("p");
  
dynPar.innerHTML = message;
    
iframeContainer.insertAdjacentElement("beforeend", dynPar);
    
iframe.addEventListener('load', function () {
                    
  if (player && !player.paused()) {
     player.pause();
          }
  
                });
  }
  showIframe();
  hideVideo();
}
videoElement.addEventListener("click", () => {
  if (!player) {
  player = videojs("my-video");
  }
  
  if (!player.paused()) {
    player.pause();
    
  } else {
    player.play();
    
  }
  
  
});
window.addEventListener("load", () => {
  document.getElementById("sideMenu").classList.add("open");
});
