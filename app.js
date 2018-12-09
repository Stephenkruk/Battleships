var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");

var gameStatus = require("./stats");
var Game = require("./game");

var app = express();

var i = true;
var j = false;
var grid = null;
var ships = null;

app.get("/play", indexRouter);

app.get("/", (req, res) => {
    res.sendFile("splash.html", {root: "./public"});
});

app.use(express.static(__dirname + "/public"));
var server = http.createServer(app);

const wss = new websocket.Server({ server });

var websockets = {};

var currentGame = new Game(gameStatus.gamesInitialized++);
var connectionID = 0;

wss.on("connection", function connection(ws) {

    let con = ws;
    con.id = connectionID++;
    //console.log("con.id is " + con.id);
    let playerType = currentGame.addPlayer(con);
    //console.log("playertype is " + playerType);
    websockets[con.id] = currentGame;
    //console.log(currentGame);

    ws.on("message", function incoming(data) {
        if (i) {
            grid = data;
            i = false;
        } else {
            ships = data;
            i = true;
            j = true;
        }

        if (j) {
            if (playerType == "1") {
                currentGame.setGrid(grid, ships, true);
            } else {
                currentGame.setGrid(grid, ships, false);
                j = false;
            }
        }
    });
});
server.listen(3000);