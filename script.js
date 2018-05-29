/******************************************************************************************\
TO DO:
    - add extra stars for going over the goal
    - different sound for stars
    - different sound for goal
    - add mute button

    - make sessions prettier
    - make goal div prettier
    - change pop-up div
    
    - figure out how to size everything relative to screen height
    
\******************************************************************************************/

var minutes;
var seconds;
var work = true;
var int;
var total = 0;
var going = false; //to avoid starting, stopping or pausing when timer is running
var paused = false; //to avoid starting when timer is paused
var audio = new Audio('Alarm-tone.mp3');
var minutesWork = $("#work").val();
var minutesBreak = $("#break").val();
var startTime;
var endTime;
var goal;

function goalSetup() {
    goal = $("#goal").val();
    $("#stars").html(
        "<div class='stars'>"+
            "<i class='fa fa-star empty' id= '1'></i> " +
            "<i class='fa fa-star empty' id= '2'></i> " +
            "<i class='fa fa-star empty' id= '3'></i>" +
        "</div>"
    )
}

function start(x) {
    if (!going && !paused) {
        startTime = new Date();
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
        endTime = new Date();
        $("#sessions").prepend(
            '<div class="session">' +
                '<p>Start time: '+ startTime.getHours() + ':' + addZero(startTime.getMinutes()) + 
                '   End time: ' + startTime.getHours() + ':' + addZero(startTime.getMinutes()) + 
                '   Minutes of work: ' + minutesWork + '  Minutes of break: ' + minutesBreak + '</p>' +
            '</div>'
        );
        total += 1
        $("#total").html(total);
        if (total == goal) {
            $("#3").addClass('full');
        } 
        if (total >= goal*2/3) {
            $("#2").addClass('full');
        } 
        if (total >= goal/3) {
            $("#1").addClass('full');
        }
        //These are not else if because if goal is under 3 the first and second star might not get coloured
        //Figure out how to get sound only when you reach a star (maybe a flag?)
        $("body").prepend(
            '<div id="info" class="popIn">' +
                    'Time for a break!' + '<br>' +
                    '<button id="ok" class="ok">Ok!</button>'+
            '</div>'  
        ); 
    } else {
        $("body").prepend(
            '<div id="info" class="popIn">' +
                    'Go back to work!' + '<br>' +
                    '<button id="ok" class="ok">Ok!</button>'+
            '</div>'   
        );         
    }
    $("#ok").on("click", function () {
        audio.pause();
        $("#info").addClass("popOut");
        if (work) {
            start(minutesBreak);
            work = false;
        } else {
            start(minutesWork);
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
        console.log("pauseIn");
    }
    console.log("pauseOut");
}

function resume () {
    console.log("resume");
    paused = false; 
    //timer is no longer paused, 
    //going is set to true inside the start function, because otherwise it won't start
    console.log(decimalMinutes($("#time").html()));
    start(decimalMinutes($("#time").html()));
    $("#pauseDiv").html(
        '<button class="options" onclick="pauseTimer()"><i class="fa fa-pause"></i></button>'
    );
}

function decimalMinutes (x) {
    return minutes + (seconds/60);
}

function stop () {
    if (!paused) {
        clearInterval(int);
        going = false;
        var work = minutesWork*60
        minutes = addZero(Math.floor(work/60));
        seconds = addZero(work % 60);
        $("#time").html(minutes + ":" + seconds);  
    } else {
        resume(); 
        //so that stop will still work when timer is paused in a non-buggy way, the timer needs to be resumed
        clearInterval(int);
        going = false;
        var work = minutesWork.val()*60
        minutes = addZero(Math.floor(work/60));
        seconds = addZero(work % 60);
        $("#time").html(minutes + ":" + seconds);
    }
}

function apply() {
    minutesWork = $("#work").val();
    minutesBreak = $("#break").val();
    $('#setTime').toggle();
    stop();
}
