// Enemies our player must avoid
var Enemy = function(startx, starty, direction, speed) {
    this.x = startx;
    this.y = starty;
    this.speed = speed;
    this.direction = direction;
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.direction == "left") {
    	this.x = this.x - dt*this.speed;
    } else if (this.direction == "right") {
    	this.x = this.x + dt*this.speed;
    }
    if (this.x <= -101 || this.x >= 606;) {
    	this.reset();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/*Other enemy classes go here
 * 
 * 
 * 
 */

//Player object.
var Player = function() {
	this.xcor = 3;
	this.ycor = 6;
	this.moving = "still";
}

//Method that handles keyboard controls.
Player.prototype.handleInput = function() {
	
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
