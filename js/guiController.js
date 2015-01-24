/* gui object used to handle the opening screen and game over
 * screen, along with their associated buttons.
 */

var global = global||this;
var gui = {};
//Difficulty initiated at normal.
game.difficulty = "normal";

/* Changes the character, called when the player clicks on a sprite.
 * in opening menu.
 */
gui.selectChar = function () {
    var charid = this.id;
    $(".charImg").removeClass("selected");
    $("#" + charid).addClass("selected");
    game.charSprite = "images/" + charid + ".png";
}

//Ditto for difficulty in opening menu.
gui.selectDifficulty = function () {
    var diffid = this.id;
    if (diffid != "play") {
        $(".button").removeClass("selected");
        $("#" + diffid).addClass("selected");
        game.difficulty = diffid;
    }
}

/* Called when the player clicks the "Play Again" button from
 * game over screen.  Currently uses the lazy option of simply reloading
 * the page.
 */
gui.reset = function() {
	location.reload();
}

/* Called when the player clicks "Play!"  Initiates the game, hides the
 * opening menu, and calls the Engine function.
 */
gui.startGame = function() {
	game.init();
    $("#openingScreen").css("display", "none");
    Engine(global);
}

/* Called when the player runs out of lives.  Removes canvas and shows
 * the game over screen.
 */
game.over = function() {
	$("canvas").remove();
	$("#gameOverScreen").css("display", "flex");
}

//jQuery functions to handle on-click effects for menus.
$(".charImg").click(gui.selectChar);
$(".button").click(gui.selectDifficulty);
$("#playAgain").click(gui.reset);
$("#play").click(gui.startGame);
