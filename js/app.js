var game = {};
game.charSprite = "images/char-boy.png";
game.running = false;
game.numEnemieseasy = 4;
game.numEnemiesnormal = 5;
game.numEnemieshard = 6;
game.toleranceeasy = 40;
game.tolerancenormal = 50;
game.tolerancehard = 60;
game.tolerance = 0;

//Class for enemies our player must avoid.
var Enemy = function(startside, startrow, speed, index, wait) {
    if (startside == "left") {this.x = -101; this.direction="right";}
    else if (startside == "right") {this.x = 606; this.direction="left";}
    this.row = startrow;
    this.y = (startrow-2)*81
    this.speed = speed;
    this.sprite = 'images/enemy-bug-'+this.direction+'.png';
    this.index = index;
    this.wait = wait;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.wait <= 0) {
        if (this.direction == "left") {
            this.sprite = 'images/enemy-bug-left.png';
            this.x = this.x - dt*this.speed;
        } else if (this.direction == "right") {
            this.sprite = 'images/enemy-bug-right.png';
            this.x = this.x + dt*this.speed;
        }
        //Checks to see if it has killed the player.
        this.checkCollision();
        //This function is blank for regular enemies, but has
        //a value for specific enemy classes who require...
        //well... further updates.
        this.furtherUpdate(dt);
        //If enemy has left the screen, it is removed from
        //the allEnemies array and a new one is added.
        if (this.x < -101 || this.x > 606) {
            game.replaceEnemy(this.index);
        }
    } else {this.wait -= dt;}
}

Enemy.prototype.furtherUpdate = function() {
    //Only has functionality for other classes.
}

// Draw the enemy on the screen.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//Collision detector checks if the enemy is in the same row as the player,
//then checks if they are within the "tolerance."  Tolerance is in the range
//of 50px and depends on difficulty.
Enemy.prototype.checkCollision = function() {
    if (this.row == game.player.ycor) {
        if (Math.abs(this.x - game.player.x) <= game.tolerance) {
            game.player.die();
        }
    }
}

//Other enemy classes o'clock!

//This enemy type stops and goes.  It is assigned a "goTime" and "waitTime"
//at creation that determine how long it will go for before waiting, wait
//before going.
var StopAndGo = function(startside, startrow, speed, index, wait, goTime, waitTime) {
    Enemy.call(this, startside, startrow, speed, index, wait);
    this.goTime = goTime;
    this.waitTime = waitTime;
    this.go = this.goTime;
}

StopAndGo.prototype = Object.create(Enemy.prototype);
StopAndGo.prototype.constructor = StopAndGo;
StopAndGo.prototype.furtherUpdate = function(dt) {
    this.go -= dt;
    if (this.go <= 0) {
        this.go = this.goTime;
        this.wait = this.waitTime;
    }
}

//Creates a new enemy with random properties dependent on
//difficulty.
game.getNewEnemy = function (index) {
    var speed = 0;
    switch (game.difficulty) {
        case "easy": 
            speed = Math.floor(50 + 100*Math.random());
            break;
        case "normal":
            speed = Math.floor(100 + 125*Math.random());
            break;
        case "hard":
            speed = Math.floor(125 + 200*Math.random());
            break;
        default:
            speed = 100;
            break;
    }
    var side = "";
    if (Math.random()>0.5) {side = "left"}
    else {side = "right"}
    var row = Math.floor(2 + 3*Math.random());
    var enemy = new Enemy(side, row, speed, index, 4*Math.random());
    return enemy;
}

//Initializes the array of enemies.  Also sets tolerance for proximity
//to an enemy.
game.initEnemies = function() {
    game.tolerance = game["tolerance"+game.difficulty];
    /*
    var enemies = [];
    var numEnemies = game["numEnemies"+game.difficulty];
    for (var i = 0; i<numEnemies; i++) {
        enemies.push(game.getNewEnemy(i));
    }
    return enemies; */
   var enemies = [];
   var sandg = new StopAndGo("left", 2, 100, 0, 0, 2, 1);
   enemies.push(sandg);
   return enemies;
}

//Used to spawn a new enemy once an old enemy has run off
//the screen.
game.replaceEnemy = function(index) {
    game.allEnemies[index] = game.getNewEnemy(index);
}



//Player class.
var Player = function(charSprite) {
    this.xcor = 3;
    this.ycor = 6;
    this.moving = "still";
    this.sprite = charSprite;
    //The 0 value below is a placeholder; the render function will
    //determine the values based on the xcor and ycor values.
    this.x = 0;
    this.y = 0;
    this.xdisplace = 0;
    this.ydisplace = 0;
    this.speed = 800;
}

//Draw the player object on the screen.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
}

//Update function to track player motion.  Farms out its duty
//to several functions below.
Player.prototype.update = function(dt) {
    if (this.moving != "still") {
        this.updateDisplacement(dt);
    }
    this.getXPos();
    this.getYPos();
}

//Subsidiary functions to update that get the player's position
//in pixels based on its coordinates on the grid.
Player.prototype.getXPos = function() {
    this.x = (this.xcor-1)*101 + this.xdisplace;
}

Player.prototype.getYPos = function() {
    this.y = (this.ycor-2)*83 + this.ydisplace;
}

//This function updates the displacement of the player's sprite
//from the grid, so they can slide from tile to tile rather than
//appearing to engage in short range teleportation.
Player.prototype.updateDisplacement = function(dt) {
    switch (this.moving) {
        //Speed is increased by 25% in the horizontal direction to
        //ensure that the player moves up and down rows as fast
        //as they move side to side along columns.
        case "still": break;
        case "left": this.xdisplace -= this.speed*dt*1.25; break;
        case "right": this.xdisplace += this.speed*dt*1.25; break;
        case "up": this.ydisplace -= this.speed*dt; break;
        case "down": this.ydisplace += this.speed*dt; break;
        default: console.log("default"); break;
    }
    //If the player has finished moving a tile's distance, it's coordinates are
    //updated and the moving and displace variables are reset.
    if (Math.abs(this.xdisplace) >= 101 || Math.abs(this.ydisplace) >= 81) {
        switch (this.moving) {
            case "left": this.xcor -= 1; break;
            case "right": this.xcor += 1; break;
            case "up": this.ycor -= 1; break;
            case "down": this.ycor += 1; break;
            default: break;
        }
        this.moving = "still";
        this.xdisplace = 0;
        this.ydisplace = 0;
    }
}

Player.prototype.die = function() {
    this.xcor = 3;
    this.ycor = 6;
    this.moving = "still";
    this.xdisplace = 0;
    this.ydisplace = 0;
}

//Method that handles keyboard controls.  If the player
//is moving, the input is ignored; else, it instigates motion.
//If this motion would send the player out of bounds, it is
//cancelled.
Player.prototype.handleInput = function(key) {
    if (this.moving == "still") {
        this.moving = key;
        if (key == "left" && this.xcor == 1) {this.moving="still"}
        if (key == "right" && this.xcor == 5) {this.moving="still"}
        if (key == "down" && this.ycor == 6) {this.moving="still"}
        if (key == "up" && this.ycor == 2) {this.moving="still"}
    }
}

// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    if (game.running) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        game.player.handleInput(allowedKeys[e.keyCode]);
    }
});


















