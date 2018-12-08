var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");

var gameStatus = require("./stats");
var Game = require("./game");

var app = express();

app.get("/play", indexRouter);

app.get("/", (req, res) => {
    res.sendFile("splash.html", {root: "./public"});
});

app.use(express.static(__dirname + "/public"));
var server = http.createServer(app);

const wss = new websocket.Server({ server });

var websockets = {};

var currentGame = new Game(0);
var connectionID = 0;

wss.on("connection", function() {

    let con = ws; 
    con.id = connectionID++;
    let playerType = currentGame.addPlayer(con);
    websockets[con.id] = currentGame;
    
});
server.listen(3000);