class Ship {
    /*  length = lenghth of the ship
        start  = starting coordinate
        end    = ending coordinate
        live   = true if ship live ("afloat"), false if ship sunk
    */
    constructor(length, start, end, live, hits, type) {
        this.length = length;
        this.start = start;
        this.end = end;
        this.live = live;
        this.hits = hits;
        this.type = type;
        // makes an array of all occupied coordinates (hit, x, y)
        var occupies = [];
        this.occupies = occupies;

        // if start and end x are equal only y values have to be "calculated"
        if (this.start.x == this.end.x) {
            // pushes every coordinate the ship occupies onto the occupies array
            for (var i = this.start.y; i <= this.end.y; i++) {
                this.occupies.push({hit: false, x: this.start.x, y: i})
            }
        } else {
            for (var i = this.start.x; i <= this.end.x; i++) {
                this.occupies.push({hit: false, x: i, y: this.start.y})
            }
        }
    }

    getOccupies(){
        return this.occupies;
    }

    getOccupiesX(i){
        return this.occupies[i].x;
    }

    getOccupiesY(i){
        return this.occupies[i].y;
    }

    getType(){
        return this.type;
    }

    getStartX() {return this.start.x}
    getStartY() {return this.start.y}
    getEndX() {return this.end.x}
    getEndY() {return this.end.y}

    // sets start coordinates for the ship
    setStart(x, y) {
        this.start.x = x;
        this.start.y = y;
    }

    // sets end coordinates for the ship
    setEnd(x, y) {
        this.end.x = x;
        this.end.y = y;
    }

    setStartX(x) {this.start.x = x;}
    setStartY(y) {this.start.y = y;}
    setEndX(x) {this.end.x = x;}
    setEndY(y) {this.end.y = y;}

    // returns if false if ship sunk
    getLive() {
        return this.live;
    }
    
    updateShipCoords(startX, startY, endX, endY) {
        this.setStart(startX, startY);
        this.setEnd(endX, endY);
        var j = 0;

        if (this.start.x == this.end.x) {
            // refreshes every coordinate in the occupies array
            for (var i = this.start.y; i <= this.end.y; i++) {
                this.occupies[j] = {hit: false, x: this.start.x, y: i};
                j++;
            }
        } else {
            for (var i = this.start.x; i <= this.end.x; i++) {
                this.occupies[j] = {hit: false, x: i, y: this.start.y};
                j++;
            }
        }
    }

    // checks if the ship is hit by checking if the ship occupies the hit coordinate
    hitCheck(target) {
        var index;
        var hit = false;
        // cycles through each element in occupies
        this.occupies.forEach(function(element) {
            // if the x and y values of an element match the x and y of the target hit is set to true
            if (element.x == target.x && element.y == target.y) {
                hit = true;
            }
        });
            this.occupies[index].hit = hit;
            if (hit = true) {
                this.hits++;
            }
    }

    liveCheck() {
        if (this.hits == this.length) {
            this.live = false;
        }
    }
}