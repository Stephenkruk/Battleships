//hardcoded for testing purposes
var grid = [
    [0, 1, 2, 3+5, 4+5, 5+5, 6+5, 7+5, 0, 0],
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

function updateGrid(typeGrid, gridValues){
    var gameBoard = document.getElementById(typeGrid);

    for (var i = 0; i < 10; i++) {
        var tr = document.createElement("tr");
        gameBoard.appendChild(tr);
        tr.id = i;

        for (var j = 0; j < 10; j++) {  
            var td = document.createElement("td");
            tr.appendChild(td);
            td.id = i + "," + j;
            //based on the values of the cell coordinate, give a class to the cell
            if (gridValues[i][j] == 0){
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
        }
    }
}

updateGrid("yourgrid", grid);