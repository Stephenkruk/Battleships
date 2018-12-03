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

function updateGrid(typeGrid) {
    var gameBoard = document.getElementById(typeGrid);

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
                td.className = "cell cell-carrier";
            } else if (gridValues[i][j] == 4) {
                td.className = "cell cell-battleship";
            } else if (gridValues[i][j] == 5) {
                td.className = "cell cell-cruiser";
            } else if (gridValues[i][j] == 6) {
                td.className = "cell cell-submarine";
            } else {
                td.className = "cell cell-destroyer";
            }
        }
    }
}

function deleteGrid() {
    for (var i = 0; i < 10; i++) {
        $("#" + i).remove();
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
    deleteGrid();
    updateGrid("startgrid");
    console.log("randomizer was called");
    console.log(gridValues);
}

randomizer();

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