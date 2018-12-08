var game = function(id) {
    this.player1 = null;
    this.player2 = null;
    this.id = id;
    this.grid1 = null;
    this.ship1 = null;
    this.hitShips1 = 0;
    this.grid2 = null;
    this.ship2 = null;
    this.hitShips2 = 0;
    this.gameState = "0 JOINT";
}

game.prototype.setGrid = function(grid, ships, isPlayer1) {
    if (isPlayer1) {
        this.grid1 = grid;
        this.ship1 = ships;
    } else {
        this.grid2 = grid;
        this.ship2 = ships;
    }
}

game.prototype.setGridValues = function(r, c, value, isGrid1) {
    if (isGrid1) {
        this.grid1[r][c] = value;
    } else {
        this.grid2[r][c] = value;
    }
}

game.prototype.hasTwoConnectedPlayers = function() {
    return (this.gameState == "2 JOINT");
}

game.prototype.addPlayer = function(player) {

    if (this.player1 == null) {
        this.player1 = player;
        this.gameState = "1 JOINT";
        console.log("player 1 is " + player);
        return "1";
    }
    else {
        this.player2 = player;
        this.gameState = "2 JOINT";
        console.log("player 2 is " + player);
        return "2";
    }
}

module.exports = game;