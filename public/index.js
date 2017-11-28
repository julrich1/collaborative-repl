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
  const cursorStart = codeText.selectionStart;
  const cursorEnd = codeText.selectionEnd;
  
  codeText.value = text;

  codeText.selectionStart = cursorStart;
  codeText.selectionEnd = cursorEnd;
});

socket.on("runResults", (resultText) => {
  runText.value = resultText;
});