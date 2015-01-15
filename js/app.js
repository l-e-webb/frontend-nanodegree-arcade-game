// Enemies our player must avoid
var Enemy = function(startside, startrow, direction, speed) {
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

//Function is called to initialize enemies and when they leave
//the game area so that new enemies can be spawned.
Enemy.prototype.reset = function() {
    
}

// Draw the enemy on the screen.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/*Other enemy classes go here
 * 
 * 
 * 
 */

var intiEnemies = function() {
    return [];
}

//Player object.
var Player = function(charSprite) {
	this.xcor = 3;
	this.ycor = 6;
	this.moving = "still";
	this.sprite = "images/" + charSprite + ".png";
	//The 0 value below is a placeholder; the render function will
	//determine the values based on the xcor and ycor values.
	this.x = 0;
	this.y = 0;
}

//Draw the player object on the screen.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
}

Player.prototype.update = function() {
    this.x = this.getXPos();
    this.y = this.getYPos();
}

//Subsidiary functions to update that get the player's position
//in pixels based on its coordinates on the grid.
Player.prototype.getXPos = function() {
    
}

Player.prototype.getYPos = function() {
    
}

//Method that handles keyboard controls.
Player.prototype.handleInput = function(key) {
	
}


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

var startGame = function() {
    global var player = new Player(game.charSprite);
    global var allEnemies = initEnemies(); 
    Engine.init();
}


















