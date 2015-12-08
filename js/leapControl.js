var leapController;

$(document).ready(function () {
    var lastCommand;

    leapController = new Leap.Controller();

    leapController.on('deviceStopped', function () {

    });

    leapController.on('streamingStopped', function () {

    });

    leapController.connect();

    Leap.loop({enableGestures: true}, function (frame) {
        var newDate = new Date();

        if (!lastCommand || lastCommand < newDate.setSeconds(newDate.getSeconds() - 0.5)) {

            if (frame.gestures.length > 0 && frame.gestures[0].type === 'swipe') {
                if (frame.gestures[0].direction[0] < 0) {
                    // rechts nach links

                    $.get('http://localhost:8080/?samsung=ChUp', function (data, status) {
                    }, 'html');
                } else {
                    // links nach rechts
                    $.get('http://localhost:8080/?samsung=ChDown', function (data, status) {
                    }, 'html');
                }
                lastCommand = new Date();
            } else if (frame.gestures.length > 0 && frame.gestures[0].type === 'screenTap') {

                lastCommand = new Date();
            } else if (frame.gestures.length > 0 && frame.gestures[0].type === 'keyTap') {

                lastCommand = new Date();
            }
        }
    });
})
;