const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const fs = require("fs");

const { spawn } = require("child_process");

let codeText = "const a = 5; const b = 100; console.log(a+b);";
let node;

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.emit("codeTextInit", (codeText));

  socket.on("codeTextChange", (newText) => {
    codeText = newText;

    socket.broadcast.emit("codeTextUpdate", codeText);
    console.log(codeText);
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

http.listen(8000, () => {
  console.log("Listening on port 8000");
});