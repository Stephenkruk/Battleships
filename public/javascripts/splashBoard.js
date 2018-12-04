var gridValues = [];
var ships = [];
//still hardcoded, needs to be interactive
var currentCoord = "0,0";
var nextCoord = "0,0";

//initializes a 2d-array with values 0;
function reset() {
    for (var i = 0; i < 10; i++) {
        gridValues[i] = [];

        for (var j = 0; j < 10; j++) {
            gridValues[i][j] = 0;
        }
    }
    //empties the final array
    ships.splice(0,ships.length)
}

function updateGrid(typeGrid) {
    //get the board you want to update
    var gameBoard = document.getElementById(typeGrid);

    //remove the old table rows
    for (var i = 0; i < 10; i++) {
        $("#" + i).remove();
    }

    //create a new table
    for (var i = 0; i < 10; i++) {
        //append a new row with id 0-9
        var tr = document.createElement("tr");
        gameBoard.appendChild(tr);
        tr.id = i;

        for (var j = 0; j < 10; j++) {
            //append a new cell in each row
            var td = document.createElement("td");
            tr.appendChild(td);
            td.id = i + "," + j;
            //based on the values of the cell coordinate, give a class to the cell
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
    //check if the function is vertical
    if (isVertical){
        for (var i = 0; i < length; i++) {
            //if the offsets are out of bounds or the coordinate is taken by another ship, try again with another placement
            if (offsetY + i > 9 || gridValues[offsetY + i][offsetX] != 0) {
                placeRandomShip(length, isVertical, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), type);
                return;
            }
        }
        for (var i = 0; i < length; i++) { 
            //set the gridValues to the type
            gridValues[offsetY + i][offsetX] = type;
        }
        //create a new ship object with the right coordinates and push in into the array of ships
        var name = new Ship(length, {x: offsetX, y:offsetY}, {x: offsetX, y:offsetY + length}, true, 0, type);
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
        var name = new Ship(length, {x: offsetX, y:offsetY}, {x: offsetX + length, y:offsetY}, true, 0, type);
        ships.push(name);
    }
}

/* 0 = empty field, 1 = miss, 2 = hit, 3 = carrier, 4 = battleship, 5 = cruiser, 6 = submarine, 7 = destroyer */

function randomizer() {
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

function moveShip(ship) {

    //calculate the difference between currentCoord and nextCoord
    var currentYX = (currentCoord).split(",").map(function(t){return parseInt(t)});
    var nextYX = (nextCoord).split(",").map(function(t){return parseInt(t)});
    var dy = nextYX[0] - currentYX[0];
    var dx = nextYX[1] - currentYX[1];

    //check if the new values are free for a ship to be placed on
    if (ship.getStartX() == ship.getEndX()) {
        //if the ship's startY or endY is out of bounds, inform the player that a ship can't be placed here.
        //You don't need to test the x-values since a vertical ship can't be placed out of bounds in the x-axis
        if (ship.getStartY() + dy < 0 || ship.getEndY() + dy > 9) {
            console.log("You can't place a ship there");
            return;
        }
        //check if all the values inbetween the start- and end-coordinate are free
        for (var i = ship.getStartY() + dy; i < ship.getEndY() + dy; i++) {
            if (gridValues[i][ship.getStartX() + dx] != 0) {
                console.log("You can't place a ship there");
                return;  
            }
        }
    } else {
        //if the ship's startX or endX is out of bounds, inform the player that a ship can't be placed here.
        //You don't need to test the y-values since a horizontal ship can't be placed out of bounds in the y-axis
        if (ship.getStartX() + dx < 0 || ship.getEndX() + dx > 9) {
            console.log("You can't place a ship there");
            return;
        }
        //check if all the values inbetween the start- and end-coordinate are free
        for (var i = ship.getStartX() + dx; i < ship.getEndX() + dx; i++) {
            if (gridValues[ship.getStartY() + dy][i] != 0) {
                console.log("You can't place a ship there");
                return;  
            }
        }
    }

    //reset old values of the ship to zero
    for (var i = 0; i < ship.getOccupies().length; i++) {
        gridValues[ship.getOccupiesY(i)][ship.getOccupiesX(i)] = 0;
    }

    //update the coordinates and the occupies array of the ship
    ship.updateShipCoords(ship.getStartX() + dx, ship.getStartY() + dy, ship.getEndX() + dx, ship.getEndY() + dy);

    //change the values in the 2d-array
    if (ship.getStartX() == ship.getEndX()) {
        //changes the values to the value of the ship
        for (var i = ship.getStartY(); i < ship.getEndY(); i++) {
            gridValues[i][ship.getStartX()] = ship.getType();
        }
    } else {
        for (var i = ship.getStartX(); i < ship.getEndX(); i++) {
            gridValues[ship.getStartY()][i] = ship.getType();
        }
    }
    //update the grid to show the change to the user
    updateGrid("startgrid");
}

document.getElementById("readybutton").addEventListener("click", function() {
    moveShip(ships[0]);
});