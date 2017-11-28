const socket = io();

const codeText = document.querySelector("#codeText");
const runText = document.querySelector("#runText");
const runButton = document.querySelector("button");

// codeText.addEventListener("keyup", (event) => {
//   console.log("On keypress", event);
  
//   const cursorStart = codeText.selectionStart;
//   const textData = { key: event.key, cursorPos: cursorStart }; 
  
//   socket.emit("codeTextChange", textData);
// });

const keys = {};

codeText.addEventListener("keydown", keydown, false);
codeText.addEventListener("keypress", handleInput, false);
codeText.addEventListener("keyup", keyup, false);

function handleInput(e) {
  if (keys[e.key]) {
    console.log(e);
    sendKey(e.key, codeText.selectionStart);    
  }
}

function keydown(e) {
  keys[e.key] = true;
}

function keyup(e) {
  keys[e.key] = false;

  if (e.key === "Backspace") {
    sendKey("Backspace", codeText.selectionStart);
  }
}

function sendKey(key, cursorStart) {
  const textData = { key: event.key, cursorPos: cursorStart }; 
  console.log("Sending position: ", cursorStart );
  socket.emit("codeTextChange", textData);
}

// codeText.addEventListener("keyup", (event) => {
//   console.log("On change", event);
//   codeText.dispatchEvent(keypressEvent);
//   // const cursorStart = codeText.selectionStart;
//   // const textData = { key: event.charCode, cursorPos: cursorStart }; 
  
//   // socket.emit("codeTextChange", textData);
// });

runButton.addEventListener("click", () => {
  console.log("Run clicked");
  socket.emit("run");
});

socket.on("codeTextInit", (text) => {
  codeText.value = text;
});

socket.on("codeTextUpdate", (textData) => {
  let cursorStart = codeText.selectionStart;
  let cursorEnd = codeText.selectionEnd;
  
  console.log("Cursor start", cursorStart, textData.updatePos);

  codeText.value = textData.text;

  if (textData.updatePos < cursorStart) { cursorStart++; cursorEnd++; }

  codeText.selectionStart = cursorStart;
  codeText.selectionEnd = cursorEnd;
});

socket.on("runResults", (resultText) => {
  runText.value = resultText;
});