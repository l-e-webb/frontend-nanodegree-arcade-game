var gui = {};
var game = {};
game.charSprite = "images/char-boy.png";
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

$(".charImg").click(gui.selectChar);
$(".button").click(gui.selectDifficulty);
$("#play").click(startGame);