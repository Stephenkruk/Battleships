var gridValues = [];
var ships = [];
var clickedShip;
var publicState = 0;
var currentCoord;
var nextCoord;

/*
Contains all functions that update either the grid or the gridArray
*/

// reset or initiates a the gridValues array with values 0;
function resetArray() {
    gridValues.splice(0, gridValues.length);
    ships = [];
    for (var i = 0; i < 10; i++) {
        gridValues[i] = [];

        for (var j = 0; j < 10; j++) {
            gridValues[i][j] = 0;
        }
    }
    //empties the ships array
    ships.splice(0, ships.length)
    currentCoord = null;
    nextCoord = null;
}

function updateGrid() {
    // removes existing grid (so it can be updated)
    var element = document.getElementById("startgrid");
    if (element) {
        element.innerHTML = null;
    }

    var grid = document.getElementById("startgrid");
    grid.className = 'grid';

    // create a new table
    for (var r = 0; r < 10; r++) {
        var tr = grid.appendChild(document.createElement('tr'));

        for (var c = 0; c < 10; c++) {
            var cell = tr.appendChild(document.createElement("td"));
            cell.id = r + "," + c;

            cell.onclick = function (event) {
                if (gridValues[r][c] != 0) {
                    clickedShip = ships[gridValues[r][c] - 3];
                    console.log("Current coordinate is: " + currentCoord);
                    console.log("Next coordinate is: " + nextCoord);
                }
                console.log(event.srcElement.id);
                preMoveShip(event.srcElement.id);
            };

            // based on the values of the cell coordinate, give a class to the cell
            // 0 = empty field, 1 = miss, 2 = hit, 3 = carrier, 4 = battleship, 5 = cruiser, 6 = submarine, 7 = destroyer
            if (gridValues[r][c] == 0) {
                cell.className = "cell";
            } else if (gridValues[r][c] == 3) {
                cell.className = "cell ship cell-carrier";
            } else if (gridValues[r][c] == 4) {
                cell.className = "cell ship cell-battleship";
            } else if (gridValues[r][c] == 5) {
                cell.className = "cell ship cell-cruiser";
            } else if (gridValues[r][c] == 6) {
                cell.className = "cell ship cell-submarine";
            } else {
                cell.className = "cell ship cell-destroyer";
            }
        }
    }
}

// Updates the gridArray with the current occupied values of the specified ship
function updateShip(ship, startX, startY, endX, endY) {
    if (!checkPlacement(ship, startX, startY, endX, endY)) {
        // message needs to be added here
        return;
    }

    //reset old values of the ship to zero
    for (var i = 0; i < ship.getOccupies().length; i++) {
        gridValues[ship.getOccupiesY(i)][ship.getOccupiesX(i)] = 0;
    }

    //update the coordinates and the occupies array of the ship
    ship.updateShipCoords(startX, startY, endX, endY);

    //change the values in the 2d-array
    if (startX == endX) {
        //changes the values to the value of the ship
        for (var i = startY; i <= endY; i++) {
            gridValues[i][startX] = ship.getType();
        }
    } else {
        for (var i = startX; i <= ship.getEndX(); i++) {
            gridValues[startY][i] = ship.getType();
        }
    }
}

// returns false if placement is not valid
// returns true if placement is valid
function checkPlacement(ship, startX, startY, endX, endY) {
    if (startX == endX) {
        // if the ship's startY or endY is out of bounds, inform the player that a ship can't be placed here.
        // You don't need to test the x-values since a vertical ship can't be placed out of bounds in the x-axis
        if (startY < 0 || endY > 9) {
            console.log("You can't place a ship there");
            return false;
        }
        //check if all the values inbetween the start- and end-coordinate are free
        for (var i = startY; i <= endY; i++) {
            if (gridValues[i][startX] == ship.getType()) {

            } else if (gridValues[i][startX] != 0) {
                console.log("You can't place a ship there");
                return false;
            }
        }
    } else {
        //if the ship's startX or endX is out of bounds, inform the player that a ship can't be placed here.
        //You don't need to test the y-values since a horizontal ship can't be placed out of bounds in the y-axis
        if (startX < 0 || endX > 9) {
            console.log("You can't place a ship there");
            return false;
        }
        //check if all the values inbetween the start- and end-coordinate are free
        for (var i = startX; i <= endX; i++) {
            if (gridValues[startY][i] == ship.getType()) {

            } else if (gridValues[startY][i] != 0) {
                console.log("You can't place a ship there");
                return false;
            }
        }
    }
    return true;
}

/*
Contains all functions that move ships around the grid
*/

function preMoveShip(coord) {
    var coordinate = (coord).split(",").map(function (t) { return parseInt(t) });

    if (currentCoord != null) {
        if (gridValues[coordinate[0]][coordinate[1]] == 0 || gridValues[coordinate[0]][coordinate[1]] == clickedShip.type) {
            nextCoord = coordinate;
            moveShip(clickedShip);
            currentCoord = null;
            nextCoord = null;
        } else {
            console.log("that is not a valid coordinate");
        }
    } else {
        //code setting a new coordinate
        if (gridValues[coordinate[0]][coordinate[0]] == 0) {
            console.log("an empty coord is clicked");
        } else {
            currentCoord = coordinate;
            console.log("a new ship coord is clicked");
            nextCoord = null;
        }
    }

}

// if called with localState = 1, moves the ship from current to next coordinate
// if called with localState = 0, sets clickedShip, state, currentCoord to right values and updates state to 1;
function moveShip(ship) {
    // calculate the difference between currentCoord and nextCoord
    var dy = nextCoord[0] - currentCoord[0];
    var dx = nextCoord[1] - currentCoord[1];
    // calculate new coordinates
    var startX = ship.getStartX() + dx;
    var startY = ship.getStartY() + dy;
    var endX = ship.getEndX() + dx;
    var endY = ship.getEndY() + dy;

    // check if these are valid coordinates
    if (!checkPlacement(ship, startX, startY, endX, endY)) {
        return;
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
        for (var i = ship.getStartY(); i <= ship.getEndY(); i++) {
            gridValues[i][ship.getStartX()] = ship.getType();
        }
    } else {
        for (var i = ship.getStartX(); i <= ship.getEndX(); i++) {
            gridValues[ship.getStartY()][i] = ship.getType();
        }
    }
    //update the grid to show the change to the user
    updateGrid();

    //reset the values of the coordinates and the public state
    currentCoord = null;
    nextCoord = null;
}

// rotates the selected/clicked ship clockwise
function rotateShip() {
    // ship to be rotated is last clicked ship
    ship = clickedShip;
    var startX = ship.start.x;
    var startY = ship.start.y;
    var endX = ship.end.x;
    var endY = ship.end.y;
    var length = ship.length;

    // if ship is vertical
    if (endX == startX) {
        newStartX = startX - 1 + length;
        endX = newStartX;
        endY = startY;

        // check if ship would be placed outside of the board
        if (startY < 0 || startX < 0 || endX < 0 || endY < 0) {
            // message needs to be added here
            return;
        }
        updateShip(ship, startX, startY, endX, endY);
        updateGrid();

    } else {
        // if ship is horizontal WORKING
        newStartY = startY - 1 + length;
        endY = newStartY;
        endX = startX;

        // check if ship would be placed outside of the board
        if (startY < 0 || startX < 0 || endX < 0 || endY < 0) {
            // message needs to be added here
            console.log("ship can't be rotated out of bounds");
            console.log("start(x,y): (", startX + ", " + startY + ")");
            console.log("end(x,y): (", endX + ", " + endY + ")");
            return;
        }
        updateShip(ship, startX, startY, endX, endY);
        updateGrid();
    }
}

/*
Contains all randomize functions
*/

function placeRandomShip(length, isVertical, offsetX, offsetY, type) {
    //check if the function is vertical
    if (isVertical) {
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
        var name = new Ship(length, { x: offsetX, y: offsetY }, { x: offsetX, y: offsetY + length - 1 }, true, 0, type);
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
        var name = new Ship(length, { x: offsetX, y: offsetY }, { x: offsetX + length - 1, y: offsetY }, true, 0, type);
        ships.push(name);
    }

}

function randomize() {
    resetArray();
    placeRandomShip(5, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 3);
    placeRandomShip(4, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 4);
    placeRandomShip(3, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 5);
    placeRandomShip(3, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 6);
    placeRandomShip(2, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 7);
    console.log(ships);
    updateGrid();
}

// randomize the grid when the page is opened;
randomize();