const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

let codeText = "";

app.use(express.static("public"));

// app.get("", (req, res) => {
//   res.send("Hello");
// });

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.emit("codeTextInit", (codeText));

  socket.on("codeTextChange", (newText) => {
    codeText = newText;

    socket.broadcast.emit("codeTextUpdate", codeText);
    console.log(codeText);
  });
});

http.listen(8000, () => {
  console.log("Listening on port 8000");
});