var rows = 10;
var cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function initGrid(typeId, typeGrid){
    var gameBoard = document.getElementById(typeGrid);

    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        gameBoard.appendChild(tr);
        tr.id = i+1;

        for (var j = 0; j < cols.length; j++) {  
            var td = document.createElement("td");
            tr.appendChild(td);
            td.id =  typeId + cols[i] + (j + 1);
            td.className = "cell-empty";
        }
    }
}

initGrid("y", "yourgrid");
initGrid("o", "oppgrid");
