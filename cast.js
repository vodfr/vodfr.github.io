let initializeCastApi = function () {
  console.log("initializeCastApi");

  let sessionRequest = new chrome.cast.SessionRequest(
    chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
  );

  let apiConfig = new chrome.cast.ApiConfig(
    sessionRequest,

    sessionListener,

    receiverListener
  );

  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
};
if (!chrome.cast || !chrome.cast.isAvailable) {
  setTimeout(initializeCastApi, 1000);
}
function onInitSuccess() {
  console.log("onInitSuccess");
}
function onError(e) {
  console.log("onError", e);
}
function sessionListener(e) {
  console.log("sessionListener", e);
}
function receiverListener(availability) {
  console.log("receiverListener", availability);

  if (availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
    document.getElementById("castButton").removeAttribute("disabled");
  }
}
function onSessionRequestSuccess(session) {
  console.log("onSessionRequestSuccess", session);

  let currentSource = player.currentSrc();

  let mediaInfo = new chrome.cast.media.MediaInfo(
    currentSource,
    "application/x-mpegURL"
  );

  let request = new chrome.cast.media.LoadRequest(mediaInfo);

  session.loadMedia(request, onMediaLoadSuccess, onError);
}
function onMediaLoadSuccess(e) {
  console.log("onMediaLoadSuccess", e);
}
const castBtn = document.getElementById("castBtn");
castBtn.addEventListener("click", function () {
  chrome.cast.requestSession(onSessionRequestSuccess, onError);
});
