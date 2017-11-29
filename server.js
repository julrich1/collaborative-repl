const PORT = process.env.PORT || 8000;

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const fs = require("fs");

const { spawn } = require("child_process");

let codeText = ["const a = 5;", "const b = 100;", "console.log(a+b);"];
let node;

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.emit("codeTextInit", (codeText));

  socket.on("codeTextChange", (textData) => {
    updateText(textData);

    //To-Do: Return correct cursor POS from function
    let newTextData;

    if (textData.key === "Backspace") {
      newTextData = { text: codeText, updatePos: textData.cursorPos, line: textData.line, backspace: true };  
    }
    else {
      newTextData = { text: codeText, updatePos: textData.cursorPos, line: textData.line, backspace: false };
    }

    console.log(newTextData);
    socket.broadcast.emit("codeTextUpdate", newTextData);
    console.log(codeText, codeText.length);
  });

  socket.on("run", () => {
    console.log("Run event was triggered");
    
    fs.writeFile("output/output.js", codeText, () => {
      node = spawn("node", ["output/output.js"]);
      
      node.stdout.setEncoding("utf8");

      node.stdout.on("data", (data) => {
        console.log("Node output: ", data);
        io.emit("runResults", data);
      });
  
      node.stderr.on("data", (data) => {
        console.log("Node error: ", data);
      });
  
      node.on("error", (error) => {
        console.log("Error starting Node: ", error);
      });
  
      node.on("close", (code) => {
        console.log("Node closed with code: ", code);
      });      
    });    
  });
});

http.listen(PORT, () => {
  console.log("Listening on port ", PORT);
});

// function convertKey(key) {
//   if (key === "Backspace") {
//     return String.fromCharCode(8);
//   }

//   return key;
// }

function updateText(textData) {
  console.log("textData: ", textData.key, textData.cursorPos, textData.line);
  // console.log("Codetext = ", codeText);

  if (!codeText[textData.line]) { codeText[textData.line] = ""; }
  if (textData.key === "Backspace") {
    if (textData.cursorPos === codeText[textData.line].length) {
      // codeText[textData.line] 
      codeText[textData.line] += codeText[textData.line + 1];
      shiftUp(textData.line + 1);
    }
    else {
      codeText[textData.line] = codeText[textData.line].slice(0, textData.cursorPos) + codeText[textData.line].slice(textData.cursorPos + 1);
    }
  }
  else if (textData.key === "Enter") {
    const newLineText = codeText[textData.line].slice(textData.cursorPos);
    codeText[textData.line] = codeText[textData.line].slice(0, textData.cursorPos);
    shiftDown(textData.line);
    codeText[textData.line + 1] = newLineText;
  }
  else if (textData.key.length <= 1)
    codeText[textData.line] = codeText[textData.line].slice(0, textData.cursorPos) + textData.key + codeText[textData.line].slice(textData.cursorPos);
}

function shiftDown(lineNumber) {
  console.log("CodeText before:", codeText);
  for (let i = codeText.length; i > lineNumber; i--) {
    codeText[i] = codeText[i - 1];
  }

  console.log("CodeText after:", codeText);
}

function shiftUp(lineNumber) {
  console.log("CodeText before:", codeText, "Starting at lineNumber: ", lineNumber);
  for (let i = lineNumber; i < codeText.length - 1; i++) {
    console.log(`Replacing codeText ${codeText[i]} with ${codeText[i+1]}`);
    codeText[i] = codeText[i + 1];
  }

  codeText.splice(codeText.length - 1, 1);

  console.log("CodeText after:", codeText);
}