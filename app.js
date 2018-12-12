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

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/play", indexRouter);

app.get("/", (req, res) => {
    res.render("splash.ejs", { gamesInitialized: gameStatus.gamesInitialized, shotsHit: gameStatus.shotsHit, shotsFired: gameStatus.shotsFired });
});

var server = http.createServer(app);

const wss = new websocket.Server({ server });

var newGame = new Game(gameStatus.gamesInitialized++);
var connectionID = 0;

wss.on("connection", function connection(ws) {

    let con = ws;
    con.id = connectionID++;
    newGame.addPlayer(con);
    //websockets[con.id] = newGame;
    var currentGame = newGame;

    if (newGame.hasTwoConnectedPlayers()) {
        newGame = new Game(gameStatus.gamesInitialized++);
    }

    if (currentGame.hasTwoConnectedPlayers() && !currentGame.initDone) {

        if (!currentGame.isPlayer1InitDone) {
            currentGame.player1.send("initOppGrid");
            currentGame.player1.send("null");
            currentGame.player1.send("sendGridValues");
            currentGame.player1.send("null");
        }
        
        if (!currentGame.isPlayer2InitDone) {
            currentGame.player2.send("initOppGrid");
            currentGame.player2.send("null");
            currentGame.player2.send("sendGridValues");
            currentGame.player2.send("null");
        }

        currentGame.player1.on("message", function incoming(data) {
            if (!currentGame.initDone) {
                if (isGrid) {
                    grid = JSON.parse(data);
                    isGrid = false;
                } else {
                    ships = JSON.parse(data);
                    isGrid = true;
                    currentGame.setGrid(grid, ships, true);
                    currentGame.isPlayer1InitDone = true;
                }

                if (currentGame.isPlayer1InitDone) {
                    console.log("player 1 initilization is accessed");
                    currentGame.player1.send("updateOwnGrid");
                    currentGame.player1.send(JSON.stringify(currentGame.p1OwnGrid));
                    checkInit();
                }
            }
        });

        currentGame.player2.on("message", function incoming(data) {
            if (!currentGame.initDone) {
                if (isGrid) {
                    grid = JSON.parse(data);
                    isGrid = false;
                } else {
                    ships = JSON.parse(data);
                    isGrid = true;
                    currentGame.setGrid(grid, ships, false);
                    currentGame.isPlayer2InitDone = true;
                }

                if (currentGame.isPlayer2InitDone) {
                    console.log("player 2 initilization is accessed");
                    currentGame.player2.send("updateOwnGrid");
                    currentGame.player2.send(JSON.stringify(currentGame.p2OwnGrid));
                    checkInit();
                }
            }
        });
    }

    function checkInit() {
        if (currentGame.hasTwoConnectedPlayers()) {
            if (currentGame.isPlayer1InitDone && currentGame.isPlayer2InitDone) {
                console.log(currentGame.isPlayer1InitDone);
                console.log(currentGame.isPlayer2InitDone);
                currentGame.initDone = true;
            }
        }
    }

    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame.player1.on("message", function incoming(data) {
            if (currentGame.isPlayer1InitDone && currentGame.isPlayer2InitDone) {
                if (!currentGame.isFinished){
                    if (currentGame.isPlayer1Turn) {
                        var coordinate = JSON.parse(data);
                        var y = coordinate[0];
                        var x = coordinate[1];

                        var currentVal = currentGame.p2OwnGrid[y][x];

                        if (currentVal == 0) {
                            currentGame.setGridValuesPlayer1(y, x, 1, false);
                            currentGame.setGridValuesPlayer2(y, x, 1, true);
                            currentGame.isPlayer1Turn = false;
                            gameStatus.shotsFired++;

                            //update p1OppGrid miss, update p2OwnGrid miss
                            currentGame.player1.send("updateOppGrid");
                            currentGame.player1.send(JSON.stringify(currentGame.p1OppGrid));
                            currentGame.player2.send("updateOwnGrid");
                            currentGame.player2.send(JSON.stringify(currentGame.p2OwnGrid));
                            //turn to player 2
                            currentGame.player2.send("turnmessage");
                            currentGame.player2.send(JSON.stringify(true));

                        } else if (currentVal >= 3 && currentVal <= 7) {
                            currentGame.setGridValuesPlayer1(y, x, currentVal + 5, false);
                            currentGame.setGridValuesPlayer2(y, x, currentVal + 5, true);
                            currentGame.isPlayer1Turn = true;
                            currentGame.hitShips1++;
                            gameStatus.shotsFired++;
                            gameStatus.shotsHit++;

                            if (currentGame.checkGameWin(1)) {
                                console.log("player 1 has won the game!");
                                currentGame.isFinished = true;
                            }

                            //update p1OppGrid Hit, update p2OwnGrid hit
                            currentGame.player1.send("updateOppGrid");
                            currentGame.player1.send(JSON.stringify(currentGame.p1OppGrid));
                            currentGame.player2.send("updateOwnGrid");
                            currentGame.player2.send(JSON.stringify(currentGame.p2OwnGrid));
                            //turn to player 1
                            currentGame.player1.send("turnmessage");
                            currentGame.player1.send(JSON.stringify(true));

                        } else {
                            console.log("That was not a valid move, please try again");
                            currentGame.isPlayer1Turn = true;
                        }
                    } else {
                        console.log("its player 2's turn");
                    }
                } else {
                    console.log("the game has been completed, no further moves can be made");
                }
            }
        });

        currentGame.player2.on("message", function incoming(data) {
            if (currentGame.isPlayer1InitDone && currentGame.isPlayer2InitDone) {
                if (!currentGame.isFinished) {
                    if (!currentGame.isPlayer1Turn) {
                        var coordinate = JSON.parse(data);
                        var y = coordinate[0];
                        var x = coordinate[1];

                        var currentVal = currentGame.p1OwnGrid[y][x];

                        if (currentVal == 0) {
                            currentGame.setGridValuesPlayer1(y, x, 1, true);
                            currentGame.setGridValuesPlayer2(y, x, 1, false);
                            currentGame.isPlayer1Turn = true;
                            gameStatus.shotsFired++;

                            //update p2OppGrid miss, update p1OwnGrid miss
                            currentGame.player2.send("updateOppGrid");
                            currentGame.player2.send(JSON.stringify(currentGame.p2OppGrid));
                            currentGame.player1.send("updateOwnGrid");
                            currentGame.player1.send(JSON.stringify(currentGame.p1OwnGrid));
                            //turn to player 1
                            currentGame.player1.send("turnmessage");
                            currentGame.player1.send(JSON.stringify(true));

                        } else if (currentVal >= 3 || currentVal <= 7) {
                            currentGame.setGridValuesPlayer1(y, x, currentVal + 5, true);
                            currentGame.setGridValuesPlayer2(y, x, currentVal + 5, false);
                            currentGame.isPlayer1Turn = false;
                            currentGame.hitShips2++;
                            gameStatus.shotsFired++;
                            gameStatus.shotsHit++;

                            if (currentGame.checkGameWin(2)) {
                                console.log("player 2 has won the game!");
                                currentGame.isFinished = true;
                            }

                            //update p2OppGrid Hit, update p1OwnGrid hit
                            currentGame.player2.send("updateOppGrid");
                            currentGame.player2.send(JSON.stringify(currentGame.p2OppGrid));
                            currentGame.player1.send("updateOwnGrid");
                            currentGame.player1.send(JSON.stringify(currentGame.p1OwnGrid));
                            //give turn to player 2
                            currentGame.player2.send("turnmessage");
                            currentGame.player2.send(JSON.stringify(true));

                        } else {
                            console.log("That was not a valid move, please try again");
                            currentGame.isPlayer1Turn = false;
                        }
                    } else {
                        console.log("its player 1's turn");
                    }
                } else {
                    console.log("the game has been completed, no further moves can be made");
                }
            }
        });
    }

});
server.listen(3000);
