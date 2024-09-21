/*/script projet simpleTV made in algeria/*/
const links = document.querySelectorAll("a.open");
const msg = document.querySelector(".message-box");
const videoElement = document.getElementById("my-video");
const iframeContainer = document.getElementById("iframe-container");
var player;
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const clickedLink = link.getAttribute("data-id");

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
              const type = link.getAttribute("data-youtube");
              
              player = videojs("my-video");
              player.src({
                src: data[i].chaine.url,

                type: player.currentType()
              });
              player.ready(function (){ //lecture quant le lecteur est pret
                
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
    document.getElementById("sideMenu").classList.add("open");
  } else if (deltaX < -50) {
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
  player = videojs("my-video");

  if (player.paused()) {
    player.src("");
    player.controls(false);
    
  } else {
    player.pause();
    player.src("");
    player.controls(false);
  }

  let iframe = document.getElementById("dynamic-iframe");

  if (!iframe) {
    iframe = document.createElement("iframe");

    iframe.id = "dynamic-iframe";

    iframeContainer.appendChild(iframe);
  }

  iframe.src = iframeSrc;

  iframe.width = "100%";

  iframe.height = "100%";

  iframe.frameBorder = "0";

  iframe.allowFullscreen = true;

  iframe.allowTransparency = true;

  iframe.style.display = "block";
}
videoElement.addEventListener("click", () => {
  player = videojs("my-video");

  if (!player.paused()) {
    player.pause();
    
  } else {
    player.play();
    
  }

  
});
window.addEventListener("load", () => {
  document.getElementById("sideMenu").classList.add("open");
});
