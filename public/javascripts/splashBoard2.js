var gridValues = [];
var ships = [];
//still hardcoded, needs to be interactive
var clickedShip;
var state = 0;
var currentCoord;
var nextCoord;

//initializes a 2d-array with values 0;
function reset() {
    gridValues.splice(0,gridValues.length);
    ships = [];
    for (var i = 0; i < 10; i++) {
        gridValues[i] = [];

        for (var j = 0; j < 10; j++) {
            gridValues[i][j] = 0;
        }
    }
    //empties the final array
    ships.splice(0,ships.length)
}

// makes a clickable grid     
function clickableGrid(callback, typeGrid){

    // removes existing grid (so it can be replaced)
    var element;
    element = document.getElementById(typeGrid);
    if (element){
        element.innerHTML = null;
    }

    var grid = document.getElementById(typeGrid);
    grid.className = 'grid';
    
    // create a new table
    for (var r = 0; r < 10; ++r){
        var tr = grid.appendChild(document.createElement('tr'));
        for (var c = 0; c < 10; ++c){
           // adds an eventlistener to all cells
            var cell = tr.appendChild(document.createElement('td'));
            cell.addEventListener('click',(function(r,c){
                return function(){
                    callback(r,c);
                }
            })(r,c),false);

            cell.id = r + "," + c;
            //based on the values of the cell coordinate, give a class to the cell
            if (gridValues[r][c] == 0){
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
    return grid;
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
        var name = new Ship(length, {x: offsetX, y:offsetY}, {x: offsetX, y:offsetY + length - 1}, true, 0, type);
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
        var name = new Ship(length, {x: offsetX, y:offsetY}, {x: offsetX + length - 1, y:offsetY}, true, 0, type);
        ships.push(name);
    }

}

/* 0 = empty field, 1 = miss, 2 = hit, 3 = carrier, 4 = battleship, 5 = cruiser, 6 = submarine, 7 = destroyer */
// if state = 1, place random ships
// if state = 0 only execute updateBoard function
function randomizer(randomOrNotRandom) {
    if (state){
    for(i = 0; i < 10; i++){
        gridValues[i] = 0;
    }
    reset();
    placeRandomShip(5, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 3);
    placeRandomShip(4, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 4);
    placeRandomShip(3, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 5);
    placeRandomShip(3, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 6);
    placeRandomShip(2, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 7);
}
    // call the moveShip function with the correct parameters
    var gameBoard = clickableGrid(function(row, col){
        console.log("You clicked on coordinate: (" + row +"," + col + ")");
        if (!state){
        ships.forEach(function(ship){
            ship.occupies.forEach(function(element) {
                if (element.x == col && element.y == row){
                    clickedShip = ship;
                    console.log("the clicked ship: ", clickedShip);
                }
            });
        });
    }
         // if no ship was clicked call moveShip with state 1 and a next coordinate (the coordinate that was clicked)
         if(state) {
            next = [];
            next[0] = row;
            next[1] = col;
            moveShip(clickedShip, 1, 0, next)
        } 
        // if a Ship was clicked call moveShip with that ship, state 0, a current/start coordinate
        if (!state) {
            console.log("right if clickedship")
            current = [];
            current[0] = row;
            current[1] = col;
            moveShip(clickedShip, 0, current, 0);
            return;
        }
       
    }, "startgrid");
}

// call the randomizer to initialize the gameBoard;
randomizer(1);


function moveShip(ship, state, current, next) {
    console.log("moveShip was called with state: " + state);
    if (!state){
        clickedShip = ship;
        console.log("Ship that was clicked: ", clickedShip);
        console.log(state);
        state = 1;
        currentCoord = current;
        console.log("currentCoord: " + currentCoord);
        return;
    }
    if (state) {
    nextCoord = next
    console.log("nextCoord", nextCoord);
    state = 0;
    }

    //calculate the difference between currentCoord and nextCoord
    var currentYX = (currentCoord).split(",").map(function(t){return parseInt(t)});
    var nextYX = (nextCoord).split(",").map(function(t){return parseInt(t)});
    var dy = nextYX[0] - currentYX[0];
    var dx = nextYX[1] - currentYX[1];

    console.log(currentYX);
    console.log(nextYX);
    console.log(dx);
    console.log(dy);

    //check if the new values are free for a ship to be placed on
    if (ship.getStartX() == ship.getEndX()) {
        //if the ship's startY or endY is out of bounds, inform the player that a ship can't be placed here.
        //You don't need to test the x-values since a vertical ship can't be placed out of bounds in the x-axis
        if (ship.getStartY() + dy < 0 || ship.getEndY() + dy > 9) {
            console.log("You can't place a ship there");
            return;
        }
        //check if all the values inbetween the start- and end-coordinate are free
        for (var i = ship.getStartY() + dy; i <= ship.getEndY() + dy; i++) {
            if (gridValues[i][ship.getStartX() + dx] == ship.getType()) {

            } else if (gridValues[i][ship.getStartX() + dx] != 0) {
                    console.log("You can't place a ship there");
                    return; 
            } else {}
        }
    } else {
        //if the ship's startX or endX is out of bounds, inform the player that a ship can't be placed here.
        //You don't need to test the y-values since a horizontal ship can't be placed out of bounds in the y-axis
        if (ship.getStartX() + dx < 0 || ship.getEndX() + dx > 9) {
            console.log("You can't place a ship there");
            return;
        }
        //check if all the values inbetween the start- and end-coordinate are free
        for (var i = ship.getStartX() + dx; i <= ship.getEndX() + dx; i++) {
            if (gridValues[ship.getStartY() + dy][i] == ship.getType()) {

            } else if (gridValues[ship.getStartY() + dy][i] != 0) {
                    console.log("You can't place a ship there");
                    return; 
            } else {}
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
        for (var i = ship.getStartY(); i <= ship.getEndY(); i++) {
            gridValues[i][ship.getStartX()] = ship.getType();
        }
    } else {
        for (var i = ship.getStartX(); i <= ship.getEndX(); i++) {
            gridValues[ship.getStartY()][i] = ship.getType();
        }
    }
    //update the grid to show the change to the user
    randomizer(0);
}

document.getElementById("readybutton").addEventListener("click", function() {
    moveShip(ships[0]);
});


