var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");

var gameStatus = require("./stats");
var Game = require("./game");

var app = express();

var isGrid = true;
var grid = null;
var ships = null;
var isPlayer1InitDone = false;
var isPlayer2InitDone = false;


app.get("/play", indexRouter);

app.get("/", (req, res) => {
    res.sendFile("splash.html", { root: "./public" });
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

    /*
    ws.on("message", function incoming(data) {
        if (playerType == "1") {
            if (isGrid) {
                grid = JSON.parse(data);
                isGrid = false;
            } else {
                ships = JSON.parse(data);
                isGrid = true;
                //console.log(grid);
                //console.log(ships);
                isPlayer1InitDone = true;
            }

            if (isPlayer1InitDone) {
                currentGame.setGrid(grid, ships, true);
            }
        } else {
            if (isGrid) {
                grid = JSON.parse(data);
                isGrid = false;
            } else {
                ships = JSON.parse(data);
                isGrid = true;
                isPlayer2InitDone = true;
            }

            if (isPlayer2InitDone) {
                currentGame.setGrid(grid, ships, true);
                console.log(currentGame.p1OwnGrid);
                console.log(currentGame.p2OwnGrid)
            }

        }

        /*
        if (isPlayer1) {
            if (playerType == "1") {
                currentGame.setGrid(grid, ships, true);
            } else {
                currentGame.setGrid(grid, ships, false);
                console.log("P2 grid is " + currentGame.p2OwnGrid);
                j = false;
            }
        }
    });

    /*
   if (!isPlayer1InitDone) {
        currentGame.player1.send("sendGridValues");
        currentGame.player1.send();

        currentGame.player1.on("message", function incoming(data) {
            var isGrid = true;
            if (isGrid) {
                grid = JSON.parse(data);
                isGrid = false;
            } else {
                ships = JSON.parse(data);
                isGrid = true;
                currentGame.setGrid(grid, ships, true);
                isPlayer1InitDone = true;
                console.log("player 1 grid is " + currentGame.p1OwnGrid);
                console.log("player 2 grid is " + currentGame.p2OwnGrid);
            }
        });
    }
    */

    if (currentGame.hasTwoConnectedPlayers()) {

        console.log("2 players connected");
        //currentGame.player1.send("sendGridValues");
        //currentGame.player1.send();

        if (!isPlayer1InitDone) {
            currentGame.player1.send("sendGridValues");
            currentGame.player1.send("null");
            currentGame.player1.send("initOppGrid");
            currentGame.player1.send("null");
            //currentGame.player1.send();

            currentGame.player1.on("message", function incoming(data) {
                //console.log(data);
                if (isGrid) {
                    grid = JSON.parse(data);
                    isGrid = false;
                } else {
                    ships = JSON.parse(data);
                    isGrid = true;
                    currentGame.setGrid(grid, ships, true);
                    isPlayer1InitDone = true;
                }

                if (isPlayer1InitDone) {
                    currentGame.player1.send("updateOwnGrid");
                    currentGame.player1.send(JSON.stringify(currentGame.p1OwnGrid));
                }
            });
        }

        if (!isPlayer2InitDone) {
            currentGame.player2.send("sendGridValues");
            currentGame.player2.send("null");
            currentGame.player2.send("initOppGrid");
            currentGame.player2.send("null");
            //currentGame.player1.send();

            currentGame.player2.on("message", function incoming(data) {
                //console.log(data);
                if (isGrid) {
                    grid = JSON.parse(data);
                    isGrid = false;
                } else {
                    ships = JSON.parse(data);
                    isGrid = true;
                    currentGame.setGrid(grid, ships, false);
                    isPlayer2InitDone = true;
                }

                if (isPlayer2InitDone) {
                    currentGame.player2.send("updateOwnGrid");
                    currentGame.player2.send(JSON.stringify(currentGame.p2OwnGrid));
                }
            });
        }

        if (isPlayer1InitDone && isPlayer2InitDone) {
            console.log("2 players are connected and initiated");

            console.log(currentGame.p1OwnGrid);
            console.log(currentGame.p2OwnGrid);

            currentGame.player1.on("message", function incoming(data) {
                
                //console.log(JSON.parse(data.data));
                /*
                if (currentGame.isPlayer1Turn) {
                    var coordinate = (data.data).split(",").map(function (t) { return parseInt(t) });
                    var y = coordinate[0];
                    var x = coordinate[1];

                    if (currentGame.p2OwnGrid[y][x] == 0) {
                        currentGame.setGridValuesPlayer1(y, x, 1, false);
                        currentGame.setGridValuesPlayer2(y, x, 1, true);
                        currentGame.isPlayer1Turn = false;

                        currentGame.player1.send("updateOppGrid");
                        currentGame.player1.send(currentGame.p1OppGrid);
                        currentGame.player1.send("turnmessage");
                        currentGame.player1.send(false);
                        currentGame.player2.send("updateOwnGrid");
                        currentGame.player2.send(currentGame.p2OwnGrid);
                        currentGame.player2.send("turnmessage");
                        currentGame.player2.send(true);

                    } else if (currentGame.p2OwnGrid[y][x] >= 3 || currentGame.p2OwnGrid[y][x] <= 7) {
                        currentGame.setGridValuesPlayer1(y, x, currentGame.p2OwnGrid[y][x] + 5, false);
                        currentGame.setGridValuesPlayer2(y, x, currentGame.p2OwnGrid[y][x] + 5, true);
                        currentGame.isPlayer1Turn = true;

                        currentGame.player1.send("updateOppGrid");
                        currentGame.player1.send(currentGame.p1OppGrid);
                        currentGame.player2.send("updateOwnGrid");
                        currentGame.player2.send(currentGame.p2OwnGrid);

                    } else {
                        console.log("That was not a valid move, please try again");
                        currentGame.isPlayer1Turn = true;
                    }
                } else {
                    console.log("its not your turn");
                }
            });

            currentGame.player2.on("message", function incoming(data) {
                if (!currentGame.isPlayer1Turn) {
                    var coordinate = (data).split(",").map(function (t) { return parseInt(t) });
                    var y = coordinate[0];
                    var x = coordinate[1];

                    if (currentGame.p1OwnGrid[y][x] == 0) {
                        currentGame.setGridValuesPlayer1(y, x, 1, true);
                        currentGame.setGridValuesPlayer2(y, x, 1, false);
                        currentGame.isPlayer1Turn = true;

                        currentGame.player2.send("updateOppGrid");
                        currentGame.player2.send(currentGame.p2OppGrid);
                        currentGame.player2.send("turnmessage");
                        currentGame.player2.send(false);
                        currentGame.player1.send("updateOwnGrid");
                        currentGame.player1.send(currentGame.p1OwnGrid);
                        currentGame.player1.send("turnmessage");
                        currentGame.player1.send(true);

                    } else if (currentGame.p2OppGrid[y][x] >= 3 || currentGame.p2OwnGrid[y][x] <= 7) {
                        currentGame.setGridValuesPlayer1(y, x, currentGame.p2OwnGrid[y][x] + 5, false);
                        currentGame.setGridValuesPlayer2(y, x, currentGame.p2OwnGrid[y][x] + 5, true);
                        currentGame.isPlayer1Turn = false;

                        currentGame.player2.send("updateOppGrid");
                        currentGame.player2.send(currentGame.p2OppGrid);
                        currentGame.player1.send("updateOwnGrid");
                        currentGame.player1.send(currentGame.p1OwnGrid);

                    } else {
                        console.log("That was not a valid move, please try again");
                        currentGame.isPlayer1Turn = false;
                    }
                } else {
                    console.log("its not your turn");
                }*/
            });
        }
    } else {
        console.log("waiting for another player")
    }
});
server.listen(3000);