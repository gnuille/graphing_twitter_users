var express = require("express");
var Twit = require('twit');
var fs = require("fs");
var app = express();
const {
  spawn
} = require('child_process');

var bodyParser = require('body-parser')
var server = require('http').createServer(app);
var io = require('socket.io')(server)

var T = new Twit({
  consumer_key:         'TWrSTRXlEoZDdEQ5CREle61nQ',
  consumer_secret:      'v7q5C2QaB4XwH7QaMfXFSf4NU6jwMFqKQKnxrOE5BAP4UbggHh',
  access_token:         '2455797165-3DT3nuw2DsX6zlHey7GetaYt0tEIWah44FlINGK',
  access_token_secret:  'dTixugq9HJtyxXnzdn4XNkCxuwtkWRLYYOs7rPUkYNiwY',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

app.use(bodyParser.urlencoded({
  extended: false
}))

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

  socket.on("getData", function(user) {
    T.get('search/tweets', { q: user, count: 10 }, function(err, data, response) {
      var tweets = '';
      for (var i=0; i<data.statuses.length; ++i) {
        tweets += '<a class="button button-primary" href="#">'+data.statuses[i].user.screen_name+'</a><br/>'+data.statuses[i].text+'<hr/>'
        if (i == data.statuses.length-1) socket.emit("tweets", tweets);
      }
    })
  })

})
server.listen(3000, function() {
  console.log("Graftim working on localhost:" + 3000)
});
