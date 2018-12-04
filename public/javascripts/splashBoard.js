var gridValues = [];
var ships = [];
var currentCoord = 11;
var nextCoord = 22;

//initializes a 2d-array with values 0;
function reset() {
    for (var i = 0; i < 10; i++) {
        gridValues[i] = [];

        for (var j = 0; j < 10; j++) {
            gridValues[i][j] = 0;
        }
    }
}

function updateGrid(typeGrid) {
    var gameBoard = document.getElementById(typeGrid);

    for (var i = 0; i < 10; i++) {
        $("#" + i).remove();
    }

    for (var i = 0; i < 10; i++) {
        var tr = document.createElement("tr");
        gameBoard.appendChild(tr);
        tr.id = i;

        for (var j = 0; j < 10; j++) {  
            var td = document.createElement("td");
            tr.appendChild(td);
            td.id = i + "," + j;
            if (gridValues[i][j] == 0){
                td.className = "cell";
            } else if (gridValues[i][j] == 3) {
                td.className = "cell ship cell-carrier";
            } else if (gridValues[i][j] == 4) {
                td.className = "cell ship cell-battleship";
            } else if (gridValues[i][j] == 5) {
                td.className = "cell ship cell-cruiser";
            } else if (gridValues[i][j] == 6) {
                td.className = "cell ship cell-submarine";
            } else {
                td.className = "cell ship cell-destroyer";
            }
        }
    }
}

function placeRandomShip(length, isVertical, offsetX, offsetY, type) {

    if (isVertical){
        for (var i = 0; i < length; i++) {
            if (offsetY + i > 9 || gridValues[offsetY + i][offsetX] != 0) {
                placeRandomShip(length, isVertical, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), type);
                return;
            }
        }
        for (var i = 0; i < length; i++) { 
            gridValues[offsetY + i][offsetX] = type;
        }
        var name = new Ship(length, {x: offsetX, y:offsetY}, {x: offsetX, y:offsetY+length}, true, 0, type);
        ships.push(name);
    } else {
        for (var i = 0; i < length; i++) {
            if (offsetX + i > 9 || gridValues[offsetY][offsetX + i] != 0) {
                placeRandomShip(length, isVertical, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), type);
                return;
            }   
        }
        for (var i = 0; i < length; i++) {
            gridValues[offsetY][offsetX + i] = type;
        }
        var name = new Ship(length, {x: offsetX, y:offsetY}, {x: offsetX+length, y:offsetY}, true, 0, type);
        ships.push(name);
    }
}

/* 0 = empty field, 1 = miss, 2 = hit, 3 = carrier, 4 = battleship, 5 = cruiser, 6 = submarine, 7 = destroyer */

function randomizer() {
    console.log("randomizer was called");
    reset();
    placeRandomShip(5, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 3);
    placeRandomShip(4, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 4);
    placeRandomShip(3, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 5);
    placeRandomShip(3, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 6);
    placeRandomShip(2, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 7);
    console.log(gridValues);
    updateGrid("startgrid");
    console.log(ships);
}

randomizer();
moveShip(ships[0]);

function moveShip(ship) {

    for (var i = 0; i < ship.getOccupies().length; i++) {
        gridValues[ship.getOccupiesY(i)][ship.getOccupiesX(i)] = 0;
    }
    
    console.log(gridValues);
/*
    console.log(gridValues);

    var currentYX = (currentCoord).toString(10).split("").map(function(t){return parseInt(t)});
    var nextYX = (nextCoord).toString(10).split("").map(function(t){return parseInt(t)});
    var dy = nextYX[0] - currentYX[0];
    var dx = nextYX[1] - currentYX[1];

    console.log(nextYX);
    console.log(currentYX);
    console.log(dy);
    console.log(dx);

    ship.updateShipCoords(ship.getStartX() + dx, ship.getStartY() + dy, ship.getEndX() + dx, ship.getEndY() + dy);

    if (ship.getStartX() == ship.getEndX()) {
        // pushes every coordinate the ship occupies onto the occupies array
        for (var i = ship.getStartY(); i <= ship.getEndY(); i++) {
            gridValues[i][ship.getStartX()] = ship.getType();
        }
    } else {
        for (var i = ship.getStartX(); i <= ship.getEndX(); i++) {
            gridValues[ship.getStartY()][i] = ship.getType();
        }
    }

    console.log(gridValues);*/
}

test();