var gameStatus = {
    since : Date.now(),
    gamesStarted: 0,
    shipsSunk: 0,
    missilesFired: 0
};

module.exports = gameStatus;

// for app.js :
app.get("/", (req, res) => {
    res.render("splash.ejs", { gamesStarted: gameStatus.gamesStarted, shipsSunk: gameStatus.shipsSunk, missilisFired: gameStatus.missilesFired });
});

// balloons line 45, 80
var currentGame = new Game(gameStatus.gamesStarted++);