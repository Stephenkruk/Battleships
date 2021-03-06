/*
what needs to be passed between server and client

server to client:
the 2d-array
a call to call messages or events (e.g. sound to blow up ships, saying its not your turn)

client to server:
a coordinate of opp grid
exit button

client functions:
recieve value
recieve opp value
update opp grid
*/
var storedGrid = localStorage.getItem("storageGrid");
var storedShips = localStorage.getItem("storageShips");
var tempGrid
var identifier;
var gameEnd = false;
var isData = false;
var socket = new WebSocket("ws://localhost:3000");


function sendGridValues() {
    socket.send(storedGrid);
    socket.send(storedShips);
}

socket.onmessage = function(data) {
    if (isData) {
        //call all functions
        if (identifier == "updateOwnGrid") {
            tempGrid = JSON.parse(data.data);
            updateGrid("yourgrid", tempGrid);
        } else if (identifier == "updateOppGrid") {
            tempGrid = JSON.parse(data.data);
            updateGrid("oppgrid", tempGrid);
        } else if (identifier == "sendGridValues") {
            sendGridValues();
        } else if (identifier == "initOppGrid") {
            initOppGrid(true);
        } else if (identifier == "turn") {
            turn(JSON.parse(data.data));
        } else if (identifier == "message"){
            document.getElementById("notification").innerHTML = JSON.parse(data.data);
        } else if (identifier == "setGameEnd") {
            gameEnd = true;
            document.getElementsByClassName("leavebutton")[0].innerHTML = "Play Again";
        } else if (identifier == "emptyOppGrid"){
            initOppGrid(false);
        } else if (identifier == "playHit") {
            var audio = new Audio('hit.wav');
            audio.play();
            console.log("soundplayed");
        } else if (identifier == "playMiss") {
            var audio = new Audio('splash.wav');
            audio.play();
            console.log("soundplayed");
        }

        isData = false;
    }
    identifier = data.data;
    isData = true;
}

function initOppGrid(addOnclick) {
    var gameBoard = document.getElementById("oppgrid");

    gameBoard.innerHTML = null;

    for (var i = 0; i < 10; i++) {
        var tr = document.createElement("tr")
        gameBoard.appendChild(tr);

        for (var j = 0; j < 10; j++) {

            var td = document.createElement("td");
            tr.appendChild(td);
            td.id = i + "," + j;
            if (addOnclick) {
                td.onclick = function (event) {
                    sendCoordinate(event.srcElement.id);
                };
            }
            td.className = "cell";
        }
    }
}

function updateGrid(grid, gridValues) {

    var element;
    element = document.getElementById(grid);
    if (element) {
        element.innerHTML = null;
    }

    var gameBoard = document.getElementById(grid);

    for (var i = 0; i < 10; i++) {
        var tr = document.createElement("tr");
        gameBoard.appendChild(tr);
        tr.id = i;

        for (var j = 0; j < 10; j++) {
            var td = document.createElement("td");
            tr.appendChild(td);
            td.id = i + "," + j;

            //based on the values of the cell coordinate, give a class to the cell
            if (gridValues[i][j] == 0) {
                td.className = "cell";
            } else if (gridValues[i][j] == 1) {
                td.className = "cell miss";
            } else if (gridValues[i][j] == 2) {
                td.className = "cell hit"
            } else if (gridValues[i][j] == 3) {
                td.className = "cell ship cell-carrier";
            } else if (gridValues[i][j] == 4) {
                td.className = "cell ship cell-battleship";
            } else if (gridValues[i][j] == 5) {
                td.className = "cell ship cell-cruiser";
            } else if (gridValues[i][j] == 6) {
                td.className = "cell ship cell-submarine";
            } else if (gridValues[i][j] == 7) {
                td.className = "cell ship cell-destroyer";
            } else if (gridValues[i][j] == 8) {
                td.className = "cell ship cell-carrier hit";
            } else if (gridValues[i][j] == 9) {
                td.className = "cell ship cell-battleship hit";
            } else if (gridValues[i][j] == 10) {
                td.className = "cell ship cell-cruiser hit";
            } else if (gridValues[i][j] == 11) {
                td.className = "cell ship cell-submarine hit";
            } else if (gridValues[i][j] == 12) {
                td.className = "cell ship cell-destroyer hit";
            }

            if (grid == "oppgrid" && !gameEnd) {
                td.onclick = function (event) {
                    sendCoordinate(event.srcElement.id);
                };
            }
        }
    }
}

function sendCoordinate(coord) {
    var coordinate = (coord).split(",").map(function (t) { return parseInt(t) });
    socket.send(JSON.stringify(coordinate));
    console.log("player sent coordinate:");
    console.log(coordinate);
}

function turn(isYourTurn) {
    if (isYourTurn) {
        console.log("its your turn!");
    }
}

function leaveGame() {
    document.location.href = "/";
}

function fullscreen() {
    var el = document.getElementById("body");
     // use necessary prefixed versions
    el.webkitRequestFullscreen();
    el.mozRequestFullScreen();
    el.msRequestFullscreen();

    // finally the standard version
    el.requestFullscreen();
  }
