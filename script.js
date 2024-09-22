/*/CSS/*/
html,
body {
  
  display: flex;

  width: 100%;

  height: 100%;

  margin: 0;

  padding: 0;

  background: transparent; /* S'assurer que le fond est transparent */
}
.side-menu {
  position: fixed;

  top: 0;

  left: -300px; /* Cache le menu à gauche */

  width: 187px;

  height: 100%;

  background-color: #000000;

  padding: 20px;

  transition: left 0.3s ease;

  border: 1px solid white;

  border-style: none none none none;

  opacity: 0.8;

  overflow-y: scroll;

  overflow-x: hidden;

  z-index: 9999; /* Au-dessus du lecteur vidéo */
}
.main-content {
  padding: 20px;

  z-index: 1;
}
.side-menu.open {
  left: 0;

  padding: 0px;

  cursor: default;
}
#my-video {
  position: fixed;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  display: block;

  z-index: -10;
}
.btn.btn-primary {
  color: white;

  text-decoration: none;

  background-color: #000;

  border: 0px;

  white-space: nowrap;

  text-align: left;
}
.btn.btn-primary:hover {
  width: 90%;

  padding: 10px 10px;

  margin: 10px;

  color: yellow;
}
.btn.btn-dark.btn-sm {
  color: white;

  margin: 0px;

  border: 1px solid white;

  padding: 5px 5px;
}
.side-menu::-webkit-scrollbar {
  width: 5px;
}
.side-menu::-webkit-scrollbar-track {
  background: tranparent;

  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
input,
button {
  width: 80%;

  color: white;

  background-color: #000000;

  border: 1px solid white;

  border-radius: 3px;
}
.side-menu::-webkit-scrollbar-thumb {
  background: yellow;
  border-radius: 5px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.search {
  padding-left: 5px;

  width: 100%;

  border: 0px;
}
.message-box {
  position: absolute;

  top: 50%;

  left: 50%;

  transform: translate(-50%, -50%);

  background-color: #000;

  color: #fff;

  border: 1px solid yellow;

  border-style: dashed dashed dashed dashed;
  padding: 10px;

  width: 50%;

  text-align: center;

  border-radius: 5px;

  font-size: 11px;

  z-index: 30;

  display: none;
}
.toutsat:hover {
  color: white;

  text-decoration: none;
}
.journal:hover {
  color: white;

  text-decoration: none;
}
.iframe:hover {
  color: white;

  text-decoration: none;
}
b {
  color: yellow;
}
#iframe-container {
  position: absolute;
  top: -40px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: none;
  z-index: 20;
}
