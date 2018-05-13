/*********************************************\
TO DO:
    - stop button doesn't always work
    - pause button is a bit buggy
    - what if you stop while timer is paused?
    
\*********************************************/

var minutes;
var seconds;
var work = true;
var int;
var total = 0;
var going = false;

function start(x) {
    if (!going) {
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
    if (String(x).length < 2) {
        return "0" + x;
    } else {
        return x;
    }
}

function info() {
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
    clearInterval(int);
    $("#time").html(minutes + ":" + seconds);
    $("body").prepend(
        '<div id="info" class="popIn">' +
            'Pomodoro is paused'+
            '<button id="keepGoing">Keep going!</button>'+
        '</div>'  
    );
    $("#keepGoing").on("click", function () {
        $("#info").addClass("popOut");
        going = false;
        start(decimalMinutes($("#time").html()));
        setTimeout(removeInfo, 300);
    });
}

function decimalMinutes (x) {
    return minutes + (seconds/60);
}

function stop () {
    clearInterval(int);
    going = false;
    console.log(int);
    $("#time").html("00:00");
    total = 0;
    $("#total").html(total);
}