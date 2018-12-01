var rows = [A, B, C, D, E, F, G, H, I, J]
var cols = 10;

var gameContainer = document.getElementsById("yourgrid");

    for (var i = 0; i <= rows.length; i++) {
        var tr = document.createElement('tr');

        for (var j = 1; j <= cols; j++) {
            var td = document.createElement('td');
            td.id =  rows[i] + j;
        }
    }