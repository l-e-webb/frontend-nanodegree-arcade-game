/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in app.js).
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);
    ctx.font = "30px Arial";

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information required to update frames
         * appropriately.
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call update/render functions, pass along the time delta to
         * update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame
         * as long as the game is running.  game.running will be set to false
         * by the player.die method, which incites the game.over function to be
         * called at the end of the next frame.
         */
        if (game.running) {
        	win.requestAnimationFrame(main);
        } else {
        	game.over();
        }
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
    }

    /* This function is called by main and itself calls all of the functions 
     * which may need to update entity's data.
     */
    function update(dt) {
        updateEntities(dt);
    }

    /* This is called by the update function and loops through all of the
     * game objects, including enemies, gems, and the player.
     */
    function updateEntities(dt) {
        game.allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        game.allGems.forEach(function(gem) {
            gem.update(dt);
        });
        game.player.update(dt);
    }

    /* This function initially draws the "game level."  When it finished, it
     *  will then call the renderEntities function.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns defined above and, using
         * the rowImages array, draw the correct image for that portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 81 + 25);
            }
        }

        /* The below cluster of functions handles all the rendering of specific game
         * objects.  See comments below for details.
         */
        renderEntities();
        renderScore();
        renderLives();
    }

    // Renders all objects using the GameObject superclass' render method.
    function renderEntities() {
        game.allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        
        game.allGems.forEach(function(gem) {
            gem.render();
        });
        
        game.player.render();
    }
    
    //Draws the current score at the top of the screen.
    function renderScore() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,505,75);
        ctx.fillStyle = "#000000";
        ctx.fillText("Score: " + game.score, 15, 60);
    }
    
    //Displays the player's remaining lives as heart icons in the top right.
    function renderLives() {
        for (var i = 0; i < game.player.lives; i++) {
            ctx.drawImage(Resources.get('images/heart.png'), 493 -(i+1)*25, -10, 50, 85);
        }
    }

    /* The Resources object from resource.js caches all images that we will
     * need for speed and convenience.  When it is done, it will automaticall
     * call functions pushed onto the readyCallbacks array.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug-left.png',
        'images/enemy-bug-right.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/gem-green.png',
        'images/gem-blue.png',
        'images/gem-orange.png',
        'images/heart.png',
        'images/empty.png'
    ]);
    
    //Push init to readyCallbacks array so it is called when Reasources.load finished.
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that it can be used more easily
     * from within app.js.
     */
    global.ctx = ctx;
};
