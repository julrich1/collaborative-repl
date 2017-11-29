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
    drawLineNumbers();    
  }
}

function keydown(e) {
  keys[e.key] = true;
  startPos = getCursorPosition()
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
    sendKey("Backspace");
    drawLineNumbers();    
  }
}

function sendKey(key) {
  console.log(getLineNumber());
  const textData = { key: key, cursorPos: getCursorPosition(), line: getLineNumber() }; 
  console.log("Sending position: ", getCursorPosition(), "Sending line: ", getLineNumber());
  socket.emit("codeTextChange", textData);
}

function getLineNumber() {
  return codeText.value.substr(0, codeText.selectionStart).split("\n").length - 1;
}

function getMaxLines() {
  return codeText.value.substr(0).split("\n").length - 1;
}

function getCursorPosition() {
  const line = getLineNumber();
  let characters = 0;

  const textArray = codeText.value.split("\n");
  for (let i = 0; i < line; i++) {
    characters += textArray[i].length + 1; 
  }
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
  codeText.value = textArray[0];
  for (let i = 1; i < textArray.length; i++) {
    codeText.value += "\n" + textArray[i];
  }

  drawLineNumbers();
});

socket.on("codeTextUpdate", (textData) => {
  let cursorStart = codeText.selectionStart;
  let cursorEnd = codeText.selectionEnd;

  const currentLine = getLineNumber(); 

  console.log("Cursor start", cursorStart, textData.updatePos);
  console.log("Modified line: ", textData.line);
  console.log("Current cursor line: ", getLineNumber());

  codeText.value = textData.text[0];
  for (let i = 1; i < textData.text.length; i++) {
    codeText.value += "\n" + textData.text[i];
  }

  if (textData.line > currentLine) {
    //Do nothing? 
    console.log("Line is greater, do nothing"); 
  }
  else {
    if (textData.updatePos < cursorStart && textData.backspace !== true) { cursorStart++; cursorEnd++; }
    if (textData.updatePos < cursorStart && textData.backspace === true) { cursorStart--; cursorEnd--; }    
  }

  codeText.selectionStart = cursorStart;
  codeText.selectionEnd = cursorEnd;

  drawLineNumbers();
  
  // let cursorStart = codeText.selectionStart;
  // let cursorEnd = codeText.selectionEnd;
  
  // console.log("Cursor start", cursorStart, textData.updatePos);

  // codeText.value = textData.text;

  // if (textData.updatePos < cursorStart && textData.backspace !== true) { cursorStart++; cursorEnd++; }
  // if (textData.updatePos < cursorStart && textData.backspace === true) { cursorStart--; cursorEnd--; }

  // codeText.selectionStart = cursorStart;
  // codeText.selectionEnd = cursorEnd;
});

function drawLineNumbers() {
  const linesTable = document.querySelector("table");

  while (linesTable.firstChild) {
    linesTable.removeChild(linesTable.firstChild);
  }
  
  for (let i = 0; i < getMaxLines(); i++) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.textContent = i + 1;

    tr.appendChild(td);
    linesTable.appendChild(tr);
  }
}

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