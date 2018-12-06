function checkPlacement(ship, startX, startY, endX, endY) {
    if (startX == endX) {
        // if the ship's startY or endY is out of bounds, inform the player that a ship can't be placed here.
        // You don't need to test the x-values since a vertical ship can't be placed out of bounds in the x-axis
        if (startY < 0 || endY> 9) {
            console.log("You can't place a ship there");
            return false;
        }
        //check if all the values inbetween the start- and end-coordinate are free
        for (var i = startY; i <= endY; i++) {
            if (gridValues[i][startX] == ship.getType()) {

            } else if (gridValues[i][startX] != 0) {
                console.log("You can't place a ship there");
                return false;
            }
        }
        } else {
        //if the ship's startX or endX is out of bounds, inform the player that a ship can't be placed here.
        //You don't need to test the y-values since a horizontal ship can't be placed out of bounds in the y-axis
        if (startX < 0 || endX > 9) {
            console.log("You can't place a ship there");
            return false;
        }
        //check if all the values inbetween the start- and end-coordinate are free
        for (var i = startX; i <= endX; i++) {
            if (gridValues[startY][i] == ship.getType()) {

            } else if (gridValues[startY][i] != 0) {
                console.log("You can't place a ship there");
                return false;
            } else { }
        }
    }
}