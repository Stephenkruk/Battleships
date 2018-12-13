var game = function(id) {
    this.player1 = null;
    this.player2 = null;
    this.id = id;

    this.isPlayer1Turn = true;
    this.isPlayer1Win = null;

    this.p1OwnGrid = null;
    this.p1OppGrid = [];
    this.ship1 = null;
    this.hitShips1 = 0;

    this.p2OwnGrid = null;
    this.p2OppGrid = [];
    this.ship2 = null;
    this.hitShips2 = 0;

    this.isPlayer1InitDone = false;
    this.isPlayer2InitDone = false;
    this.initDone = false;
    this.isFinished = false;

    this.gameState = "0 JOINT";
}

game.prototype.setGrid = function(grid, ships, isPlayer1) {
    if (isPlayer1) {
        this.p1OwnGrid = grid;

        for (var i = 0; i < 10; i++) {
            this.p1OppGrid[i] = [];
    
            for (var j = 0; j < 10; j++) {
                this.p1OppGrid[i][j] = 0;
            }
        }
        this.ship1 = ships;
    } else {
        this.p2OwnGrid = grid;

        for (var i = 0; i < 10; i++) {
            this.p2OppGrid[i] = [];
    
            for (var j = 0; j < 10; j++) {
                this.p2OppGrid[i][j] = 0;
            }
        }
        this.ship2 = ships;
    }
}

game.prototype.setGridValuesPlayer1 = function(r, c, value, isOwnGrid) {
    if (isOwnGrid) {
        this.p1OwnGrid[r][c] = value;
    } else {
        if (value == 8 || value == 9 || value == 10 || value == 11 || value == 12) {
            this.p1OppGrid[r][c] = 2;
        } else {
        this.p1OppGrid[r][c] = value;
        }
    }
}

game.prototype.setGridValuesPlayer2 = function(r, c, value, isOwnGrid) {
    if (isOwnGrid) {
        this.p2OwnGrid[r][c] = value;
    } else {
        if (value == 8 || value == 9 || value == 10 || value == 11 || value == 12) {
            this.p2OppGrid[r][c] = 2;
        } else {
        this.p2OppGrid[r][c] = value;
        }
    }
}

game.prototype.checkGameWin = function(player) {
    if (player == 1) {
        return (this.hitShips1 == 17);
    } else {
        return (this.hitShips2 == 17);
    }
}

game.prototype.hasTwoConnectedPlayers = function() {
    return (this.gameState == "2 JOINT");
}

game.prototype.addPlayer = function(player) {

    if (this.player1 == null) {
        this.player1 = player;
        this.gameState = "1 JOINT";
    }
    else {
        this.player2 = player;
        this.gameState = "2 JOINT";
    }
}

module.exports = game;