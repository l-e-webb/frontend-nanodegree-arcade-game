var global = global||this;
var gui = {};
game.difficulty = "normal";

gui.selectChar = function () {
    var charid = this.id;
    $(".charImg").removeClass("selected");
    $("#" + charid).addClass("selected");
    game.charSprite = "images/" + charid + ".png";
}

gui.selectDifficulty = function () {
    var diffid = this.id;
    if (diffid != "play") {
        $(".button").removeClass("selected");
        $("#" + diffid).addClass("selected");
        game.difficulty = diffid;
    }
}

var startGame = function() {    
    game.player = new Player(game.charSprite);
    game.allEnemies = initEnemies();
    Engine(global);
    $(".main").remove();
    game.running = true;
}


$(".charImg").click(gui.selectChar);
$(".button").click(gui.selectDifficulty);
$(".play-button").click(startGame);