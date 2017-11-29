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

let startPos = 0;
let startLine = 0;

codeText.addEventListener("keydown", keydown, false);
codeText.addEventListener("keypress", handleInput, false);
codeText.addEventListener("keyup", keyup, false);

function handleInput(e) {
  if (keys[e.key]) {
    console.log(e);
    // console.log(getCursorPosition());
    sendKey(e.key);
  }
}

function keydown(e) {
  keys[e.key] = true;
  startPos = getCursorPosition();
  startLine = getLineNumber();
}

function keyup(e) {
  keys[e.key] = false;

  if (e.key === "Backspace") {
    console.log("StartPOS is ", startPos);
    if (startPos === 0 && startLine === 0) { 
      console.log("Backspace a position zero, skipping send.");
      return;
    }
    sendKey("Backspace", codeText.selectionStart);
  }
  // console.log(getCursorPosition());  
  
}

function sendKey(key) {
  console.log(getLineNumber());
  const textData = { key: event.key, cursorPos: getCursorPosition(), line: getLineNumber() }; 
  console.log("Sending position: ", getCursorPosition(), "Sending line: ", getLineNumber());
  socket.emit("codeTextChange", textData);
}

function getLineNumber() {
  return codeText.value.substr(0, codeText.selectionStart).split("\n").length - 1;
}

function getCursorPosition() {
  const line = getLineNumber();
  let characters = 0;

  const textArray = codeText.value.split("\n");
// console.log("Text array", textArray);
  for (let i = 0; i < line; i++) {
    // console.log(`Text Array of line ${i} length is: ${textArray[i].length}`);
    characters += textArray[i].length + 1; 
  }
// console.log("Characters", characters, "Selection start: ", codeText.selectionStart);
  return codeText.selectionStart - characters;
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

socket.on("codeTextInit", (textArray) => {
  codeText.value = "";
  for (const line of textArray) {
    codeText.value += line + "\n";
  }
});

socket.on("codeTextUpdate", (textData) => {
  codeText.value = "";
  for (const line of textData.text) {
    codeText.value += line + "\n";
  }

  // let cursorStart = codeText.selectionStart;
  // let cursorEnd = codeText.selectionEnd;
  
  // console.log("Cursor start", cursorStart, textData.updatePos);

  // codeText.value = textData.text;

  // if (textData.updatePos < cursorStart && textData.backspace !== true) { cursorStart++; cursorEnd++; }
  // if (textData.updatePos < cursorStart && textData.backspace === true) { cursorStart--; cursorEnd--; }

  // codeText.selectionStart = cursorStart;
  // codeText.selectionEnd = cursorEnd;
});

socket.on("runResults", (resultText) => {
  runText.value = resultText;
});

socket.on("connect", () => {
  console.log("Connected");
  codeText.disabled = false;
});

socket.on("disconnect", () => {
  console.log("Disconnected");
  codeText.disabled = true;
});