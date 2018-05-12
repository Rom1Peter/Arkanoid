(function(){
    'use strict';
    var hs = 0
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    var x_position = canvas.width / 2;
    var speed = 400;
    var y_position = canvas.height / 2;
    var x_dir = 1;
    var y_dir = 1;
    var x_bar = 520;
    var y_bar = canvas.height - 80;
    var grd = context.createRadialGradient(75,50,25,5,60,100);
    var grd1 = context.createRadialGradient(75,50,25,5,60,100);
    var score = 0;
    var lastLoopTime = new Date();
    var deltaTime = 0;
    var numberbrique = 0;
    var i = 0
    var colors = [
        "transparent",
        "RED",
        "YELLOW",
        "green",
    ];
    var highscore = localStorage.getItem("highscore");

    grd.addColorStop(0,"#cd7f32");
    grd.addColorStop(0.5,"silver");
    grd.addColorStop(1,"gold");
    grd1.addColorStop(1,"#cc0033");
    grd1.addColorStop(0,"#2b0303");

    context.fillStyle = 'red';
    context.fillText("High Score : " + highscore, 30, 440);

    function writeHighscore(score){
        if (score > highscore) {
            highscore = score;
            localStorage.setItem("highscore", score);
        }
    }

    function drawRectangle(x, y, width, height, color){
        context.fillStyle = color;
        context.fillRect(x,y,width,height);
    }


    function intersectRect(r1x, r1y, r1width, r1height, r2x, r2y, r2width, r2height) {
         var ret = !(r2x > (r1x + r1width) || (r2x + r2width) < r1x || r2y > (r1y + r1height) || (r2y + r2height) < r1y);

        return ret;
    }

    var tabBrique = [];

    var ball_width = 20;
    var ball_height = 20;

    var brick_width = 55;
    var brick_height = 20;

    var numberBrick =  Math.round(canvas.width / brick_width);
    for (var x = 0; x < numberBrick; x++){
        tabBrique[x] = [];
        for (var y = 0; y < 2; y++){
            var rand = Math.round(Math.random() * colors.length);
            tabBrique[x][y] = rand;

            if (rand != 0)
                numberbrique++;
        }
    }
    console.warn(numberbrique);

    context.font = "20pt Calibri,Geneva,Arial";

    function draw() {
        deltaTime =  (new Date().getTime() - lastLoopTime.getTime()) / 1000;

        // Clear le jeu
        context.clearRect(0, 0, canvas.width, canvas.height);

        // dessine la balle
        drawRectangle(x_position, y_position, ball_width, ball_height, "gold");

        // collision entre la balle et la barre
        if (intersectRect(x_bar, y_bar, 130, 40, x_position, y_position, ball_width, ball_height)) {
            y_dir = -1;
            x_dir = -(((x_bar - x_position) / 130) + 0.5) * 2;
        }

        // Limite de la balle
        if (x_position >= (canvas.width - 20)){
            x_dir = -1;
        } else if (x_position < 0) {
            x_dir = 1;
        }
        if (y_position >= (canvas.height - 20)){

            context.fillStyle = grd1;
            context.fillText("Vous avez perdu",canvas.width -600,canvas.height / 2);
            return;
        } else if (y_position < 0){
            y_dir = 1;
        }
        context.fillStyle = "rgb("+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+","+Math.floor;
        // collision balle brique

        for (var i=0; i < tabBrique.length; i++) {
            for (var y = 0; y < tabBrique[i].length; y++){
                if (tabBrique[i][y] != 0) {
                    var x_brick = i * (brick_width + 1);
                    var y_brick = y * (brick_height + 1);

                    var collide = intersectRect(x_brick, y_brick, brick_width, brick_height, x_position, y_position, ball_width, ball_height);

                    if (collide) {
                        // alert(score);
                        tabBrique[i][y] -= 1;
                        if (tabBrique[i][y] <= 0) {
                            score = score + 10;
                            numberbrique--;
                        }
                        y_dir = 1;
                    } else {
                        drawRectangle(x_brick, y_brick, brick_width, brick_height, colors[tabBrique[i][y]]);
                    }
                }

            }

        }

        // Verifier si on a gagne
        if (numberbrique == 0) {
            context.fillStyle = grd;
            context.fillText("Vous avez gagne",canvas.width -600,canvas.height / 2);
            writeHighscore(score);
            return;
        }

        // Dessiner la barre
        drawRectangle(x_bar, y_bar, 130, 15 , "red");

        // Affiche le score
        context.font = '20pt Calibri,Geneva,Arial';
        context.fillStyle = 'white';
        context.fillText("Score : " + score, 10, 440);

        context.fillStyle = 'white';
        context.fillText("High Score : " + highscore, 800, 440);

        // Bouger la balle
        x_position += speed*x_dir * deltaTime;
        y_position += speed*y_dir * deltaTime;

        // Refraichir le jeu
        lastLoopTime = new Date();
        setTimeout(draw, 1000/120);
    }

    window.addEventListener("keypress", function (e) {

        // On incremente ou decremente le X de la barre
        if (e.code == "KeyA") {
            x_bar += -50;
        }
        else if (e.code == "KeyD") {
            x_bar += 50;
        }
        if (e.code == "KeyR") {
            location.reload();
        }

        // Verifier que la barre ne depasse
        if (x_bar >= (canvas.width - 130)){
            x_bar = canvas.width - 130;
        } else if (x_bar < 0) {
            x_bar = 0;
        }

    });

    setTimeout(draw, 0);
})();
