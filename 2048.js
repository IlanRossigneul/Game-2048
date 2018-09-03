(function ($) {

    $.fn.game2048 = function() {
    
        var xLength = 4;
        var yLength = 4;
        var size = 115;
        var speed = 100;
        var points = 0;
        var highscore = localStorage.getItem("highscore");
        var gameOver = false;
        var moves = 0;

        // Add a title to index.html
        $('head').append('<title>My 2048 Game Jquery only, by Ilan ROSSIGNEUL COHEN</title>');
        // Add icon to tab browser
        $('head').append('<link rel="icon" href="game2048.png">');
        // Injection of style.css
        $('head').append('<link rel="stylesheet" href="style.css" type="text/css"/>');
        
        // New game
        function startGame() {

            initContainer();
            addValue();
            addValue();
        }

        // Init
        function initContainer() {

            if(highscore !== null) {
                if (points > highscore) {
                    localStorage.setItem("highscore", points);      
                }
            } else {
                localStorage.setItem("highscore", points);
            }
            // Create a div title
            $('body').append('<div class = "titlecontainer"><h1 class="title">2048</h1></div>');
            // Create a div container for scores
            $('body').append('<div id = "scorecontainer"></div>');
            // Create a div score container
            $('#scorecontainer').append('<div class = "scorecontainer">Score : '+ points + '</div>');
            // Create a div highscore container
            $('#scorecontainer').append('<div class = "hscorecontainer">Best : '+ highscore + '</div>');
            // Create a div moves container
            $('#scorecontainer').append('<div class = "movescontainer">Moves : '+ moves + '</div>');
            // Create a div reset container
            $('body').append('<div class = "resetcontainer"><button class="button">New Game</button><div class="switch"><input id="toggle1" class="checkbox" type="checkbox"><label for="toggle1">Hard Mode</label></div>');
            // Create a div endgame
            $('body').append('<div class = "endgame"></div>');
            // Create 16 div in a div container
            $('body').append('<div class = "gridcontainer"></div>');
            for (var i = 0; i < xLength; i++) {
                for (var j = 0; j < yLength; j++) {
                    $('.gridcontainer').append('<div class = "grid empty" data-line = "' + i + '" data-column = "' + j + '"></div>');
                }
            }
            $('body').append('<div class="tips"><b><u>How to play:</u></b> Use your arrow keys or ZQSD keys to move the tiles.</div><div class="tips">When two tiles with the same number touch, they merge into one!</div>');
        };

        // Add a new tile with a random value (2 or 4)
        function addValue() {

            var grid = $('.empty').length;
            var randTile = Math.floor(Math.random() * grid);
            var tile = $('.empty').eq(randTile);
            var randValue = Math.floor(Math.random() * Math.floor(10));
            var value;
 
            $(tile).removeClass('empty').addClass('full');
            if (randValue <= 8) {
                value = 2;
            } else {
                value = 4;
            }
            $(tile).addClass('tile-' + value).html(value).delay(speed).fadeIn(speed);
        }

        // Function for keyup TOP/RIGHT/DOWN/LEFT or Z/D/S/Q
        $(document).on("keyup", "html", function(key) {
             
            var hasMoved = false;
            $('.grid').finish();
            switch (key.keyCode) {
                case 38:
                case 90:
                    // Up
                    for (var x = 0; x < xLength; x++) {
                        var y = 0;
                        var j = 0;
                        var merged = false;
                        while ($('.grid[data-line=' + j + '][data-column=' + x + ']').hasClass('empty')) {
                            j++;
                        }
                        if (j == xLength) {
                            y = xLength;
                        } else {
                            if (j > 0) {
                                hasMoved = true;
                            }
                            $('.grid[data-line=' + y + '][data-column=' + x + ']').html($('.grid[data-line=' + j + '][data-column=' + x + ']').html()).data('line', j);
                            animateShiftY(j, x, y);
                            j++;
                        }
                        for (j; j < yLength; j++) {
                            if ($('.grid[data-line=' + j + '][data-column=' + x + ']').hasClass('full')){
                                var valuejx = $('.grid[data-line=' + j + '][data-column=' + x + ']').html();
                                var valueyx = $('.grid[data-line=' + y + '][data-column=' + x + ']').html();
                                if (valuejx == valueyx && merged == false) {
                                    $('.grid[data-line=' + y + '][data-column=' + x + ']').html(Number(valueyx) + Number(valuejx)).data('line', j);
                                    animateMergeY(j, y, x);
                                    merged = true;
                                    hasMoved = true;
                                } else {
                                    y++;
                                    $('.grid[data-line=' + y + '][data-column=' + x + ']').html(Number(valuejx)).data('line', j);
                                    animateShiftY(j, x, y);
                                    merged = false;
                                    if (j != y)
                                        hasMoved = true;
                                }
                            }
                        }
                        y++;
                        for (y; y < yLength; y++) {
                            $('.grid[data-line=' + y + '][data-column=' + x + ']').html('');
                        }
                    }
                    break;
                case 39:
                case 68:
                    // Right
                    for (var y = 0; y < yLength; y++) {
                        var x = xLength - 1;
                        var i = xLength - 1;
                        var merged = false;
                        while ($('.grid[data-line=' + y + '][data-column=' + i + ']').hasClass('empty')) {
                            i--;
                        }
                        if (i == -1) {
                            x = -1;
                        } else {
                            if (i < 3) {
                                hasMoved = true;
                            }
                            $('.grid[data-line=' + y + '][data-column=' + x + ']').html($('.grid[data-line=' + y + '][data-column=' + i + ']').html()).data('column', i);
                            animateShiftX(i, x, y);
                            i--;
                        }
                        for (i; i > -1; i--) {
                            if ($('.grid[data-line=' + y + '][data-column=' + i + ']').hasClass('full')) {
                                var valueyi = $('.grid[data-line=' + y + '][data-column=' + i + ']').html();
                                var valueyx = $('.grid[data-line=' + y + '][data-column=' + x + ']').html();
                                if (valueyi == valueyx && merged == false) {
                                    $('.grid[data-line=' + y + '][data-column=' + x + ']').html(Number(valueyx) + Number(valueyi)).data('column', i);
                                    animateMergeX(i, y, x);
                                    merged = true;
                                    hasMoved = true;
                                } else {
                                    x--;
                                    $('.grid[data-line=' + y + '][data-column=' + x + ']').html(Number(valueyi)).data('column', i);
                                    animateShiftX(i, x, y);
                                    merged = false;
                                    if (i != x) {
                                        hasMoved = true;
                                    }
                                }
                            }
                        }
                        x--;
                        for (x; x > -1; x--) {
                            $('.grid[data-line=' + y + '][data-column=' + x + ']').html('');
                        }
                    }
                    break;
                case 40:
                case 83:
                    // Down
                    for (var x = 0; x < xLength; x++) {
                        var y = yLength - 1;
                        var j = yLength - 1;
                        var merged = false;
                        while ($('.grid[data-line=' + j + '][data-column=' + x + ']').hasClass('empty')) {
                            j--;
                        }
                        if (j == -1) {
                            y = -1;
                        } else {
                            if (j < 3) {
                                hasMoved = true;
                            }
                            $('.grid[data-line=' + y + '][data-column=' + x + ']').html($('.grid[data-line=' + j + '][data-column=' + x + ']').html()).data('line', j);
                            animateShiftY(j, x, y);
                            j--;
                        }
                        for (j; j > -1; j--) {
                            if ($('.grid[data-line=' + j + '][data-column=' + x + ']').hasClass('full')) {
                                var valuejx = $('.grid[data-line=' + j + '][data-column=' + x + ']').html();
                                var valueyx = $('.grid[data-line=' + y + '][data-column=' + x + ']').html();
                                if (valuejx == valueyx && merged == false) {
                                    $('.grid[data-line=' + y + '][data-column=' + x + ']').html(Number(valueyx) + Number(valuejx)).data('line', j);
                                    animateMergeY(j, y, x);
                                    merged = true;
                                    hasMoved = true;
                                } else {
                                    y--;
                                    $('.grid[data-line=' + y + '][data-column=' + x + ']').html(Number(valuejx)).data('line', j);
                                    animateShiftY(j, x, y);
                                    merged = false;
                                    if (j != y) {
                                        hasMoved = true;
                                    }
                                }
                            }
                        }
                        y--;
                        for (y; y > -1; y--) {
                            $('.grid[data-line=' + y + '][data-column=' + x + ']').html('');
                        }
                    }
                    break;
                case 37:
                case 81:
                    // Left
                    for (var y = 0; y < yLength; y++) {
                        var x = 0;
                        var i = 0;
                        var merged = false;
                        while ($('.grid[data-line=' + y + '][data-column=' + i + ']').hasClass('empty')) {
                            i++;
                        }
                        if (i == xLength) {
                            x = xLength;
                        } else {
                            if (i != 0) {
                                hasMoved = true;
                            }
                            $('.grid[data-line=' + y + '][data-column=' + x + ']').html($('.grid[data-line=' + y + '][data-column=' + i + ']').html()).data('column', i);
                            animateShiftX(i, x, y);
                            i++;
                        }
                        for (i; i < xLength; i++) {
                            if ($('.grid[data-line=' + y + '][data-column=' + i + ']').hasClass('full')) {
                                var valueyi = $('.grid[data-line=' + y + '][data-column=' + i + ']').html();
                                var valueyx = $('.grid[data-line=' + y + '][data-column=' + x + ']').html();
                                if (valueyi == valueyx && merged == false) {
                                    $('.grid[data-line=' + y + '][data-column=' + x + ']').html(Number(valueyx) + Number(valueyi)).data('column', i);
                                    animateMergeX(i, y, x);
                                    merged = true;
                                    hasMoved = true;
                                } else {
                                    x++;
                                    $('.grid[data-line=' + y + '][data-column=' + x + ']').html(Number(valueyi)).data('column', i);
                                    animateShiftX(i, x, y);
                                    merged = false;
                                    if (i != x) {
                                        hasMoved = true;
                                    }
                                }
                            }
                        }
                        x++;
                        for (x; x < xLength; x++) {
                            $('.grid[data-line=' + y + '][data-column=' + x + ']').html('');
                        }
                    }
                    break;
            }
            if (hasMoved == true) {
                moves +=1;
                $('.movescontainer').html("Moves : " + moves);
                if ($('.checkbox').is(':checked')) {
                    if (points < 1000) {
                        addValue();
                    } else if (points < 10000) {
                        addValue();
                        addValue();
                    } else {
                        addValue();
                        addValue();
                        addValue();
                    }
                } else {
                    addValue();
                }
                checkMove();
            }
        });

        // Function animates tiles shifting left & right
        function animateShiftX(i, x, y) {

            var valueyi = $('.grid[data-line=' + y + '][data-column=' + i + ']').html();
            $('.grid[data-line=' + y + '][data-column=' + i + ']').animate({
                'marginLeft': '= 0px'
            }, speed).removeClass('full').removeClass('tile-' + valueyi).addClass('empty');
            $('.grid[data-line=' + y + '][data-column=' + x + ']').animate({
                'marginLeft': '=' + size * (i - x ) + 'px'
            }, speed).removeClass('empty').addClass('full').addClass('tile-' + valueyi);
        }

        // Function animates tiles merging to left & right
        function animateMergeX(i, y, x) {

            var valueyi = $('.grid[data-line=' + y + '][data-column=' + i + ']').html();
            $('.grid[data-line=' + y + '][data-column=' + x + ']').removeClass('tile-' + valueyi).addClass('tile-' + valueyi * 2);
            $('.grid[data-line=' + y + '][data-column=' + i + ']').removeClass('full').removeClass('tile-' + valueyi).addClass('empty').animate({
                'marginLeft': '=' + size * (i - x) + 'px'
            }, speed, function () {

                postAnimate(x, y, valueyi * 2);
            });
        }

        // Function animates tiles shifting up & down
        function animateShiftY(j, x, y) {

            var valuejx = $('.grid[data-line=' + j + '][data-column=' + x + ']').html();
            $('.grid[data-line=' + j + '][data-column=' + x + ']').animate({
                'marginTop': '= 0px'
            }, speed).removeClass('full').removeClass('tile-' + valuejx).addClass('empty');
            $('.grid[data-line=' + y + '][data-column=' + x + ']').animate({
                'marginTop': '=' + size * (j - y ) + 'px'
            }, speed).removeClass('empty').addClass('full').addClass('tile-' + valuejx);
        }
        
        // Function animates tiles merging to up & down
        function animateMergeY(j, y, x) {

            var valuejx = $('.grid[data-line=' + j + '][data-column=' + x + ']').html();
            $('.grid[data-line=' + y + '][data-column=' + x + ']').removeClass('tile-' + valuejx).addClass('tile-' + valuejx * 2);
            $('.grid[data-line=' + j + '][data-column=' + x + ']').removeClass('full').removeClass('tile-' + valuejx).addClass('empty').animate({
                'marginLeft': '=' + size * (j - y) + 'px'
            }, speed, function () {

                postAnimate(x, y, valuejx * 2);
            });
        }

        // Function updates merged tiles
        function postAnimate(x, y, valueTile) {

            var tileMerged = $('.grid[data-line=' + y + '][data-column=' + x + ']');
            var pointsAdded = $('.grid[data-line=' + y + '][data-column=' + x + ']').html();
            tileMerged.animate({
                "marginLeft": "-=" + 10 + "px",
                    "marginTop": "-=" + 10 + "px",
                    "padding": "+=" + 10 + "px"
            }, speed / 2);
            tileMerged.animate({
                "marginLeft": "+=" + 10 + "px",
                    "marginTop": "+=" + 10 + "px",
                    "padding": "-=" + 10 + "px"
            }, speed / 2);
            pointsDisplay(pointsAdded);
            if (Number(valueTile) == 2048) {
                gameOver = true;
                $('.endgame').html("<p>WELL DONE, bro !<br><b>Your Score: " + points + " in " + moves + " moves</b></p>");
                $('.endgame').animate({
                    top: "200px"
                }, 600);
                $('.container,.points').animate({
                    opacity: "0.4"
                }, 600);
            }
        }

        // Adds the new points to the total and displays them
        function pointsDisplay(a) {

            points += Number(a);
            $('.scorecontainer').html("Score : " + points);
            if(highscore !== null) {
                if (points > highscore) {
                    localStorage.setItem("highscore", points); 
                    highscore = points;
                    $('.hscorecontainer').html("Best : " + highscore);    
                }
            } else {
                localStorage.setItem("highscore", points);
            }
        }

        // Function to check if player can make a move
        function checkMove() {

            var emptytile = 0;
            var move = 0;
            for (var x = 0; x < xLength; x++) {
                for (var y = 0; y < yLength; y++) {
                    if ($('.grid[data-line=' + y + '][data-column=' + x + ']').hasClass('empty')) {
                        emptytile += 1;
                    }
                }
            }
            if (emptytile == 0) {
                for (var x = 0; x < xLength; x++) {
                    var i = x + 1;
                    for (var y = 0; y < yLength; y++) {
                        var j = y + 1;
                        var valueyi = $('.grid[data-line=' + y + '][data-column=' + i + ']').html();
                        var valuejx = $('.grid[data-line=' + j + '][data-column=' + x + ']').html();
                        var valueyx = $('.grid[data-line=' + y + '][data-column=' + x + ']').html();
                        if (Number(valueyx) == Number(valueyi) || Number(valueyx) == Number(valuejx)) {
                            move += 1;
                        }
                    }
                }
                if (move == 0) {
                    $('.grid').finish();
                    endGame();
                }
            }
        }

        // Function that display end game for player
        function endGame() {
            
            gameOver = true;
            $('.endgame').html("<p>GAME OVER ! Sucker !<br><b>Your Score: " + points + " in " + moves + " moves</b></p>");
            $('.endgame').animate({
                top: "200px"
            }, 600);
            $('.container,.points').animate({
                opacity: "0.4"
            }, 600);
        }

        //Controls the reset button
        $(document).on("click", ".button", function() {
            
            if (gameOver === true) {
                $('.endgame').animate({
                    top: "-160px"
                }, 600, function (){
                    $('.endgame').html("");
                });
                $('.container,.points').animate({
                    opacity: "1"
                }, 600);
                gameOver = false;
            }
            for (var i = 0; i < xLength; i++) {
                for (var j = 0; j < yLength; j++) {
                    $('.grid[data-line=' + j + '][data-column=' + i + ']').html('').removeAttr("style").removeClass().addClass('grid empty');
                }
            }
            points = 0;
            moves = 0;
            $('.scorecontainer').html("Score : " + points);
            $('.movescontainer').html("Moves : " + moves);
            addValue();
            addValue();
        });

        startGame();
    };
})(jQuery);

$(document).ready(function () {

    $().game2048();
});