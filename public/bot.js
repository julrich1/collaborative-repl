const socket = io();

const codeText = document.querySelector("#codeText");
const runText = document.querySelector("#runText");
const runButton = document.querySelector("button");

// codeText.addEventListener("keyup", (key) => {
//   // console.log("On change");
//   // const cursorStart = codeText.cursorStart;
//   // const textData = { key: key, cursorPos: cursorStart }; 

//   // socket.emit("codeTextChange", textData);
// });

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
  const key = String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65);
  
  const textData = { key: key, cursorPos: 0, line: 1 };   
  socket.emit("codeTextChange", textData);  
}, 500);