var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");

var port = 3000;
var app = express();

app.get("/play", indexRouter);

app.get("/", (req, res) => {
    res.sendFile("splash.html", {root: "./public"});
});

app.use(express.static(__dirname + "/public"));
var server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", function() {

});
server.listen(port);