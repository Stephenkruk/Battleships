class Ship {
    /*  length = lenghth of the ship
        start  = starting coordinate
        end    = ending coordinate
        live   = true if ship live ("afloat"), false if ship sunk
    */
    constructor(length, start, end, live, hits) {
        this.length = length;
        this.live = true;
        this.hits = 0;
    
        // makes an array of all occupied coordinates (hit, x, y)
        this.occupies = [];
        // if start and end x are equal only y values have to be "calculated"
        if (this.start.x == this.end.x) {
            // pushes every coordinate the ship occupies onto the occupies array
            for (var i = this.start.y; i <= this.end.y; i++) {
                this.occupies.push({hit: false, x: this.start.x, y: i})
            }
        } else {
            for (var i = this.start.x; i<= this.end.x; i++) {
                this.occupies.push({hit: false, x: i, y: this.start.y})
            }
        }
    }

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

    // checks if the ship is hit by checking if the ship occupies the hit coordinate
    hitCheck(target) {
        var index;
        var hit = false;
        // cycles through each element in occupies
        this.occupies.forEach(function(element) {
            // if the x and y values of an element match the x and y of the target hit is te to true
            if (element.x == target.x && element.y == target.y) {
                hit = true;
            }
        });
            this.occupies[index].hit = true;
            this.hits++;
    }

    liveCheck() {
        if (this.hits == this.length) {
            this.live = false;
        }
    }
}