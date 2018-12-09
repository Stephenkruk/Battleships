var socket;

function toGame() {
    socket = new WebSocket("ws://localhost:3000");
    socket.onopen = function() {
        socket.send(gridValues);
        socket.send(ships);
    }
    window.location.replace("game.html");
}