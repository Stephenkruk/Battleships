var gridValues = [];

//initializes a 2d-array with values 0;
function reset() {
    for (var i = 0; i < 10; i++) {
        gridValues[i] = [];

        for (var j = 0; j < 10; j++) {
            gridValues[i][j] = 0;
        }
    }
}

reset();

function placeRandomShip(length, isVertical, offsetX, offsetY, type) {

    if (isVertical){
        for (var i = 0; i < length; i++) {
            if (offsetY + i > 9|| gridValues[offsetY + i][offsetX] != 0) {
                placeRandomShip(length, isVertical, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), type);
                return;
            }
        }
        for (var i = 0; i < length; i++) { 
            gridValues[offsetY + i][offsetX] = type;
        }
    } else {
        for (var i = 0; i < length; i++) {
            if (offsetX + i > 9|| gridValues[offsetY][offsetX + i] != 0) {
                placeRandomShip(length, isVertical, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), type);
                return;
            }   
        }
        for (var i = 0; i < length; i++) {
            gridValues[offsetY][offsetX + i] = type;
        }
    }
}

/*
0 = empty field
1 = miss
2 = hit
3 = carrier
4 = battleship
5 = cruiser
6 = submarine
7 = destroyer
*/

function randomizer() {
    reset();
    placeRandomShip(5, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 3);
    placeRandomShip(4, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 4);
    placeRandomShip(3, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 5);
    placeRandomShip(3, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 6);
    placeRandomShip(2, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), 7);
console.log("randomizer was called");
}

console.log(gridValues);

var gameBoard = document.getElementById("startgrid");

for (var i = 0; i < 10; i++) {
    var tr = document.createElement("tr");
    gameBoard.appendChild(tr);
    tr.id = i;

    for (var j = 0; j < 10; j++) {  
        var td = document.createElement("td");
        tr.appendChild(td);
        td.id = i + "," + j;
        if (gridValues[i][j] == 1){
            td.className = "cell cell-filled";
        } else {
            td.className = "cell";
        }
    }
}

document.getElementById("carrier").addEventListener("click", function(){
    var clicked = false;
    var carrier = document.getElementById("carrier");

    if (clicked) {
        carrier.className = "";
        clicked = false;
    } else {
        carrier.className = "selected";
        clicked = true;
    }
});