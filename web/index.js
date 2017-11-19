var express = require("express");
var fs = require("fs");
var app = express();
const {
  spawn
} = require('child_process');

var bodyParser = require('body-parser')
var server = require('http').createServer(app);
var io = require('socket.io')(server)

app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'))
io.on("connection", function(socket) {
  socket.on("fetch", function(user, lvls) {
    console.log("user: %s nlevels: %s",user,lvls)
    const fetcher = spawn('python', ['getUsers.py', user, lvls]);
    fetcher.on('close', (code) => {
      console.log("closed")
      socket.emit("data-ready")
    });
  })

})
server.listen(3000, function() {
  console.log("App listening on port: " + 3000)
});
