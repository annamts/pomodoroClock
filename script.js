/******************************************************************************************\
TO DO:
    - add mute button
    - Sure you want to stop?

    - fix options div
    - add the sessions
    - change pop-up div
    - make apply button prettier

    - figure out how to size everything relative to screen height
    
\******************************************************************************************/

var minutes;
var seconds;
var work = true;
var int;
var total = 0;
var going = false; //to avoid starting, stopping or pausing when timer is running
var paused = false; //to avoid starting when timer is paused
var audio = new Audio('huawei-ripple.mp3');


function start(x) {
    if (!going && !paused) {
        var left = x*60;
        minutes = addZero(Math.floor(left/60));
        seconds = addZero(left % 60);
        var difference = 0;
        var now = performance.now() - 1000;
        $("#time").html(minutes + ":" + seconds);
        int = setInterval (function () {
                going = true;
                difference = 1000 - performance.now() + now;
                now = performance.now();
                left -= 1;
                minutes = addZero(Math.floor(left/60));
                seconds = addZero(left % 60);
                $("#time").html(minutes + ":" + seconds);
                if (left < 0) {
                    clearInterval(int);
                    going = false;
                    $("#time").html("00:00");
                    info();
                }
            }, 1000 + difference)
    }
}

function addZero (x) {
    //Adds a zero to the left if x is a single digit
    if (String(x).length < 2) {
        return "0" + x;
    } else {
        return x;
    }
}

function info() {
    audio.play();
    if (work) {
        total += 1
        $("#total").html(total);
        $("body").prepend(
            '<div id="info" class="popIn">' +
                    'Time for a break!' +
                    '<button id="ok">Ok!</button>'+
            '</div>'  
        ); 
    } else {
        $("body").prepend(
            '<div id="info" class="popIn">' +
                    'Go back to work!' +
                    '<button id="ok">Ok!</button>'+
            '</div>'   
        );         
    }
    $("#ok").on("click", function () {
        audio.pause();
        $("#info").addClass("popOut");
        if (work) {
            start($("#break").val());
            work = false;
        } else {
            start($("#work").val());
            work = true;
        }
        setTimeout(removeInfo, 300);
    });    
}

function removeInfo() {
    $("#info").remove();
}


function pauseTimer () {
    if (going) {
        going = false;
        paused = true;
        clearInterval(int);
        $("#time").html(minutes + ":" + seconds);
        $("#pauseDiv").html(
            '<button class="options" onclick="resume()"><i class="fa fa-play"></i></button>'
        );
    }
}

function resume () {
    paused = false;
    start(decimalMinutes($("#time").html()));
    $("#pauseDiv").html(
        '<button class="options" onclick="pauseTimer()"><i class="fa fa-pause"></i></button>'
    );
}

function decimalMinutes (x) {
    return minutes + (seconds/60);
}

function stop () {
    if (going) {
        clearInterval(int);
        going = false;
        total = 0;
        $("#total").html(total);
        var work = $("#work").val()*60
        minutes = addZero(Math.floor(work/60));
        seconds = addZero(work % 60);
        $("#time").html(minutes + ":" + seconds);  
    }
}

