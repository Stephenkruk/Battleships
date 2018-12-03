var gridValues = [];

//initializes a 2d-array with values 0;
for (var i = 0; i < 10; i++) {
    gridValues[i] = [];

    for (var j = 0; j < 10; j++) {
        gridValues[i][j] = 0;
    }
}

function placeRandomShip(length, isVertical, offsetX, offsetY){

    if (isVertical){
        for (var i = 0; i < length; i++) {
            if (offsetY + i > 9|| gridValues[offsetY][offsetX + i] == 1 ) {
                placeRandomShip(length, isVertical, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10));
                return;
            }
        }
        for (var i = 0; i < length; i++) { 
            gridValues[offsetX][offsetY + i] = 1;
        }
    } else {
        for (var i = 0; i < length; i++) {
            if (offsetX + i > 9|| gridValues[offsetY + i][offsetX] == 1 ) {
                placeRandomShip(length, isVertical, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10));
                return;
            }   
        }
        for (var i = 0; i < length; i++) {
            gridValues[offsetY + i][offsetX] = 1;
        }
    }
}

//place Aircraftcarrier
placeRandomShip(5, Math.random() >= 0.5, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10));

console.log(gridValues);



//initialize gameboard
/**
var gameBoard = document.getElementById("startgrid");

for (var i = 0; i < 10; i++) {
    var tr = document.createElement("tr");
    gameBoard.appendChild(tr);
    tr.id = i;

    for (var j = 0; j < 10; j++) {  
        var td = document.createElement("td");
        tr.appendChild(td);
        td.id = i + "," + j;
        td.className = "cell-empty";
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
*/