//hardcoded for testing purposes

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

var grid = [
    [0, 1, 2, 3 + 5, 4 + 5, 5 + 5, 6 + 5, 7 + 5, 0, 0],
    [0, 0, 3, 3, 3, 3, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 5, 5, 5, 0],
    [0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 6, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 6, 0, 0, 0, 0, 0, 7, 7, 0],
    [0, 6, 0, 0, 0, 0, 0, 0, 0, 0],
]

var oppgrid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

function initOppGrid() {
    var gameBoard = document.getElementById("oppgrid");

    for (var i = 0; i < 10; i++) {
        var tr = document.createElement("tr")
        gameBoard.appendChild(tr);

        for (var j = 0; j < 10; j++) {

            var td = document.createElement("td");
            tr.appendChild(td);
            td.id = i + "," + j;
            td.onclick = function (event) {
                sendCoordinate(event.srcElement.id);
            };
            td.className = "cell";
        }
    }
}

function updateGrid(grid, gridValues) {
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

            if (grid == "oppgrid" && gridValues[i][j] == 0) {
                td.onclick = function (event) {
                    sendCoordinate(event.srcElement.id);
                };
            }
        }
    }
}

updateGrid("yourgrid", grid);
initOppGrid();

function sendCoordinate(coord) {
    console.log("you pressed " + coord);
}

function recieveValue(gridValues, coordinate, value, isYourGrid) {
    var coordinate = (coord).split(",").map(function (t) { return parseInt(t) });

    if (isYourGrid) {
        gridValues[coordinate[0]][coordinate[1]] = value;
        updateGrid("yourgrid", gridValues);
    } else {
        gridValues[coordinate[0]][coordinate[1]] = values;
        updateGrid("oppgrid", gridValues)
    }
}