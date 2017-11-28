const socket = io();

const codeText = document.querySelector("#codeText");
const runText = document.querySelector("#runText");
const runButton = document.querySelector("button");

codeText.addEventListener("keyup", () => {
  console.log("On change");
  socket.emit("codeTextChange", codeText.value);
});

runButton.addEventListener("click", () => {
  console.log("Run clicked");
  socket.emit("run");
});

socket.on("codeTextInit", (text) => {
  codeText.value = text;
});

socket.on("codeTextUpdate", (text) => {
  codeText.value = text;
});

socket.on("runResults", (resultText) => {
  runText.value = resultText;
});

setInterval(() => {
  codeText.value = codeText.value += "w";
  socket.emit("codeTextChange", codeText.value);  
}, 500);