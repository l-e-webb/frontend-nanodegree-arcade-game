var game = {};
game.charSprite = "images/char-boy.png";
game.running = false;
game.numEnemieseasy = 4;
game.numEnemiesnormal = 5;
game.numEnemieshard = 5;
game.toleranceeasy = 40;
game.tolerancenormal = 50;
game.tolerancehard = 60;
game.tolerance = 0;
game.numGems = 3;
game.score = 0;


//GameObject class is a master class for enemies, players,
//and gems.
var GameObject = function(x,y,sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
}

GameObject.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


//Class for enemies our player must avoid.
var Enemy = function(startside, startrow, speed, index, wait) {
    if (startside == "left") {var x = -101; var direction="right";}
    else if (startside == "right") {var x = 606; var direction="left";}
    var y = (startrow-1)*81;
    GameObject.call(this, x, y, 'images/enemy-bug-'+direction+'.png');
    this.row = startrow;
    this.direction = direction;
    this.speed = speed;
    this.index = index;
    this.wait = wait;
}
Enemy.prototype = Object.create(GameObject.prototype);
Enemy.prototype.constructor = Enemy;

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

//This enemy type turns towards the player and speeds up if the player
//is on the same row.
var Chaser = function(startside, startrow, speed, index, wait) {
    Enemy.call(this, startside, startrow, speed, index, wait);
    this.baseSpeed = speed;
    this.chasing = false;
}
Chaser.prototype = Object.create(Enemy.prototype);
Chaser.prototype.constructor = Chaser;
Chaser.prototype.furtherUpdate = function(dt) {
    if (this.row == game.player.ycor) {
        if (this.chasing == false) {
            if (this.x < game.player.x) {
                this.direction = "right";
            } else {
                this.direction = "left";
            }
            this.speed = this.baseSpeed*2;
            this.chasing = true;
        }
    } else {
        this.speed = this.baseSpeed;
        this.chasing = false;
    }
}

//This enemy type turns around and goes in the other direction
//periodically.  After maxTime seconds it will stop wandering to
//ensure that it eventually leaves play.
var Wanderer = function(startside, startrow, speed, index, wait, turnTime, maxTime) {
    Enemy.call(this, startside, startrow, speed, index, wait);
    this.turnTime = turnTime;
    this.turn = turnTime*2;
    this.totalTime = 0;
    this.maxTime = maxTime;
}
Wanderer.prototype = Object.create(Enemy.prototype);
Wanderer.prototype.constructor = Wanderer;
Wanderer.prototype.furtherUpdate = function(dt) {
    this.turn -= dt;
    this.totalTime += dt;
    if (this.totalTime >= this.maxTime) {
        //If the enemy has been in play for maxTime seconds
        //the turn variable is set to 50 seconds, long enough
        //for it to leave play even if it is a slow enemy.
        this.turn = 50;
    }
    if (this.turn <= 0) {
        if (this.direction == "right") {
            this.direction = "left";
        } else {
            this.direction = "right";
        }
        this.turn = 0.5*this.turnTime + this.turnTime*Math.random();
    }
}

//Creates a new enemy with random properties dependent on
//difficulty.
game.getNewEnemy = function (index) {
    var enemy;
    var side = "";
    if (Math.random()>0.5) {side = "left"}
    else {side = "right"}
    var row = Math.floor(2 + 3*Math.random());
    var wait = 2*Math.random();
    var type = Math.random();
    switch (game.difficulty) {
        case "easy":
            if (type <= 0.5) {
                speed = Math.floor(50 + 100*Math.random());
                enemy = new Enemy(side, row, speed, index, wait);
            } else if (type > 0.5 && type <= 0.66) {
                speed = Math.floor(50 + 50*Math.random());
                enemy = new Wanderer(side, row, speed, index, wait, 1 + 2*Math.random(), 12);
            } else if (type > 0.66 && type <= 0.83) {
                speed = Math.floor(75 + 100*Math.random());
                enemy = new StopAndGo(side, row, speed, index, wait, 3, 1);
            } else if (type > 0.83) {
                speed = Math.floor(50 + 25*Math.random());
                enemy = new Chaser(side, row, speed, index, wait);
            }
            break;
        case "normal":
            if (type <= 0.4) {
                speed = Math.floor(75 + 100*Math.random());
                enemy = new Enemy(side, row, speed, index, wait);
            } else if (type > 0.4 && type <= 0.6) {
                speed = Math.floor(75 + 75*Math.random());
                enemy = new Wanderer(side, row, speed, index, wait, 1 + 2*Math.random(), 14);
            } else if (type > 0.6 && type <= 0.8) {
                speed = Math.floor(100 + 100*Math.random());
                enemy = new StopAndGo(side, row, speed, index, wait, 1 + 2*Math.random(), 0.5 + 0.5*Math.random());
            } else if (type > 0.8) {
                speed = Math.floor(75 + 75*Math.random());
                enemy = new Chaser(side, row, speed, index, wait);
            }
            break;
        case "hard":
            if (type <= 0.3) {
                speed = Math.floor(100 + 125*Math.random());
                enemy = new Enemy(side, row, speed, index, wait);
            } else if (type > 0.3 && type <= 0.5) {
                speed = Math.floor(100 + 75*Math.random());
                enemy = new Wanderer(side, row, speed, index, wait, 1 + 2*Math.random(), 15);
            } else if (type > 0.5 && type <= 0.7) {
                speed = Math.floor(150 + 50*Math.random());
                enemy = new StopAndGo(side, row, speed, index, wait, 1 + 2*Math.random(), 0.5 + 0.5*Math.random());
            } else if (type > 0.7) {
                speed = Math.floor(100 + 100*Math.random());
                enemy = new Chaser(side, row, speed, index, wait);
            }
            break;
        default:
            speed = Math.floor(100 + 125*Math.random());
            enemy = new Enemy(side, row, speed, index, wait);
            break;
    }
    return enemy;
}

//Initializes the array of enemies.  Also sets tolerance for proximity
//to an enemy.
game.initEnemies = function() {
    game.tolerance = game["tolerance"+game.difficulty];
    var enemies = [];
    var numEnemies = game["numEnemies"+game.difficulty];
    for (var i = 0; i<numEnemies; i++) {
        enemies.push(game.getNewEnemy(i));
    }
    return enemies;
}

//Used to spawn a new enemy once an old enemy has run off
//the screen.
game.replaceEnemy = function(index) {
    game.allEnemies[index] = game.getNewEnemy(index);
}



//Gem class for objects that appear on the screen that players can
//grab for points.
var Gem = function(xcor, ycor, type, spawnTime, index) {
    var x = (xcor-1)*101;
    var y = (ycor-1)*83;
    GameObject.call(this, x, y, 'images/empty.png');
    this.xcor = xcor;
    this.ycor = ycor;
    this.type = type;
    this.index = index;
    this.spawnTime = spawnTime;
    if (type == "green") {
        this.existTime = 6;
    } else if (type == "blue") {
        this.existTime = 5;
    } else if (type == "orange") {
        this.existTime = 4;
    }
    this.realSprite = 'images/gem-' + type + '.png';
}
Gem.prototype = Object.create(GameObject.prototype);
Gem.prototype.constructor = Gem;


Gem.prototype.update = function(dt) {
    if (this.spawnTime > 0) {
        this.spawnTime -= dt;
    } else {
        this.existTime -= dt;
        if (this.existTime <= 0) {
            game.replaceGem(this.index);
        } else {
            this.sprite = this.realSprite;
            this.detectCollision();
        }
    }
}

Gem.prototype.detectCollision = function() {
    if (this.ycor == game.player.ycor && this.xcor == game.player.xcor) {
        this.getScored();
    }
}

Gem.prototype.getScored = function() {
    if (this.type == "green") {
        game.score += 200;
    } else if (this.type == "blue") {
        game.score += 500;
    } else if (this.type == "orange") {
        game.score += 1000;
    }
    game.replaceGem(this.index);
}

game.initGems = function() {
    var gems = [];
    for (var i = 0; i < game.numGems; i++) {
        gems.push(game.getNewGem(i));
    }
    return gems;
}

game.getNewGem = function(index) {
    var typeGen = Math.random();
    if (typeGen <= 0.5) {
        var type = "green";
    } else if (typeGen > 0.5 && typeGen <= 0.83) {
        var type = "blue";
    } else if (typeGen > 0.83) {
        var type = "orange";
    } else {var type = "green";}
    var ycor = Math.floor(2 + 3*Math.random());
    var xcor = Math.floor(1 + 5*Math.random());
    var spawnTime =  15*Math.random();
    var gem = new Gem(xcor, ycor, type, spawnTime, index);
    return gem;
}

game.replaceGem = function(index) {
    game.allGems[index] = game.getNewGem(index);
}


//Player class.
var Player = function(charSprite) {
    GameObject.call(this, 0, 0, charSprite);
    this.xcor = 3;
    this.ycor = 6;
    this.moving = "still";
    this.xdisplace = 0;
    this.ydisplace = 0;
    this.speed = 800;
}
Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;

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
    this.y = (this.ycor-1)*81 + this.ydisplace;
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
    game.score -= 500;
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


















