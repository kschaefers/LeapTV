var leapController;

$(document).ready(function () {
    var lastCommand,
        lastTime5FingersExtended,
        lastTimeFist,
        volumeMode = false,
        palmPositionForVolumeMode;

    leapController = new Leap.Controller();

    leapController.on('deviceStopped', function () {

    });

    leapController.on('streamingStopped', function () {

    });

    leapController.connect();

    Leap.loop({enableGestures: true}, function (frame) {
        var newDate = new Date(),
            newDateMinusHalfSecond = new Date(newDate).setSeconds(newDate.getSeconds() - 0.5),
            numberOfHands = frame.hands.length,
            numberOfFingersExtended = 0;

        if (numberOfHands > 0) {
            frame.pointables.forEach(function (pointable) {
                if (pointable.extended) {
                    numberOfFingersExtended += 1;
                }
            });
        }

        if (numberOfHands === 1 && numberOfFingersExtended === 5 && volumeMode) {
            var delta,
                currentPalmPosition = frame.hands[0].palmPosition[1];
            if (!palmPositionForVolumeMode) {
                palmPositionForVolumeMode = currentPalmPosition;
            } else {
                delta = currentPalmPosition - palmPositionForVolumeMode;
                if (delta > config.sensibilityInVolumeMode) {
                    palmPositionForVolumeMode = currentPalmPosition;
                    volumeUp();
                } else if (delta < config.sensibilityInVolumeMode * -1) {
                    palmPositionForVolumeMode = currentPalmPosition;
                    volumeDown();
                }
            }
        } else {
            volumeMode = false;
        }

        if (!lastCommand || lastCommand < newDateMinusHalfSecond) {

            // one hand detected and all 5 fingers extended
            if (numberOfHands === 1) {
                if (numberOfFingersExtended === 5) {
                    var lastTimeFistHalfSecond = new Date(lastTimeFist).setSeconds(newDate.getSeconds() - 0.5);
                    if (lastTime5FingersExtended && lastTime5FingersExtended > lastTimeFistHalfSecond && lastTimeFist > newDateMinusHalfSecond) {
                        mute();
                        lastCommand = new Date();
                    }
                    lastTime5FingersExtended = new Date();
                } else if (numberOfFingersExtended === 0) {
                    lastTimeFist = new Date();
                }
            }

            //volume Mode
            volumeMode = !!(numberOfHands === 1 && numberOfFingersExtended === 5);

            if (frame.gestures.length > 0 && frame.gestures[0].type === 'swipe') {
                //make sure that the direction was made on the x axis
                if (Math.abs(frame.gestures[0].direction[0]) > Math.abs(frame.gestures[0].direction[1])
                    && Math.abs(frame.gestures[0].direction[0]) > Math.abs(frame.gestures[0].direction[2])) {
                    if (frame.gestures[0].direction[0] < 0) { // rechts nach links
                        channelUp();
                    } else { // links nach rechts
                        channelDown();
                    }
                    lastCommand = new Date();
                }
            }
        }
    });
})
;