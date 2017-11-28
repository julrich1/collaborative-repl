const socket = io();

const codeText = document.querySelector("#codeText");

socket.on("codeTextInit", (text) => {
  codeText.value = text;
});

socket.on("codeTextUpdate", (text) => {
  codeText.value = text;
});

codeText.addEventListener("keyup", () => {
  console.log("On change");
  socket.emit("codeTextChange", codeText.value);
});

