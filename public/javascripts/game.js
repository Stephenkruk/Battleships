function initGrid(typeId, typeGrid){
    var gameBoard = document.getElementById(typeGrid);

    for (var i = 0; i < 10; i++) {
        var tr = document.createElement("tr");
        gameBoard.appendChild(tr);
        tr.id = i;

        for (var j = 0; j < 10; j++) {  
            var td = document.createElement("td");
            tr.appendChild(td);
            td.id =  typeId + i + "," + j;
            td.className = "cell-empty "+ typeId + "-cell-empty ";
        }
    }
}

initGrid("y", "yourgrid");
initGrid("o", "oppgrid");

document.getElementById("oppgrid").addEventListener("click", function(){

});
