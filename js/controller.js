var leapController;

$(document).ready(function () {
    var prevNumberOfHands = null,
        muted = false,
        powerOff = false,
        volumeMode = false,
        enterNumberMode = false,
        enterNumberModeLastRegistered,
        numberMode_initiatorHandId,
        enterNumberMode_maxNumberRegistered = 0,
        enterNumberMode_numberEntered = 0,
        posLastVolumeSwitch,
        no_swipe_up = 0,
        no_swipe_down = 0,
        lastTimeOneHandZeroFingers,
        lastTimeOneHandAllFingers,
        lastTimeTwoHandsTogether,
        lastTimeTwoHandsApart;

    leapController = new Leap.Controller();

    leapController.connect();

    Leap.loop({enableGestures: true}, function (frame) {
        var no_hands = frame.hands.length,
            no_fingersExtended = 0,
            newDateMinusHalfSecond = new Date(),
            newDateMinusOneSecond = new Date(),
            newDateMinusTreeSeconds = new Date();

        newDateMinusHalfSecond.setSeconds(newDateMinusHalfSecond.getSeconds() - 0.5);
        newDateMinusOneSecond.setSeconds(newDateMinusOneSecond.getSeconds() - 1);
        newDateMinusTreeSeconds.setSeconds(newDateMinusTreeSeconds.getSeconds() - 3);

        frame.fingers.forEach(function (finger) {
            if (finger.extended) {
                no_fingersExtended++;
            }
        });

        if (enterNumberMode && enterNumberModeLastRegistered > newDateMinusTreeSeconds) {
            if (0 === no_hands) {
                if (enterNumberMode_maxNumberRegistered > 0) {
                    enterNumberMode_numberEntered += enterNumberMode_maxNumberRegistered;
                    enterNumberMode_maxNumberRegistered = 0;
                    console.log('current number: ', enterNumberMode_numberEntered);
                }
            } else if (0 < no_hands && frame.hands[0].id !== numberMode_initiatorHandId) {
                if (frame.gestures.length > 0 && frame.gestures[0].type === 'circle' && frame.gestures[0].radius > 90) {
                    switchToChannel(enterNumberMode_numberEntered);
                    enterNumberMode = false;
                    enterNumberMode_numberEntered = 0;
                } else {
                    enterNumberMode_maxNumberRegistered = enterNumberMode_maxNumberRegistered < no_fingersExtended ? no_fingersExtended : enterNumberMode_maxNumberRegistered;
                }
                enterNumberModeLastRegistered = new Date();
            }
        } else if (enterNumberMode) {
            if (0 != enterNumberMode_numberEntered) {
                switchToChannel(enterNumberMode_numberEntered);
                enterNumberMode_numberEntered = 0;
            }
            enterNumberMode = false;
        } else if (!!prevNumberOfHands && 0 === no_hands) {
            if (!volumeMode) {
                if (muted){//} && lastTimeOneHandAllFingers >= newDateMinusOneSecond) {
                    mute();
                } else if (powerOff && lastTimeTwoHandsApart >= newDateMinusOneSecond) {
                    power();
                } else if (no_swipe_up > no_swipe_down) {
                    channelUp();
                } else if (no_swipe_down > no_swipe_up) {
                    channelDown();
                }
            }

            if (volumeMode) {
                console.log('volume mode stopped');
            }
            no_swipe_up = 0;
            no_swipe_down = 0;
            lastTimeOneHandZeroFingers = null;
            lastTimeOneHandAllFingers = null;
            muted = false;
            powerOff = false;
            volumeMode = false;
            enterNumberMode = false;
        } else if (0 < no_hands) {
            // still in action
            if (1 === no_hands) {
                // keyTap gesture
                if (frame.gestures.length > 0 && frame.gestures[0].type === 'keyTap' || volumeMode) {
                    if (frame.gestures.length > 0 && frame.gestures[0].type === 'keyTap' && volumeMode) {
                        volumeMode = false;
                        console.log('volume mode stopped');
                    } else {
                        if (frame.gestures.length > 0 && frame.gestures[0].type === 'keyTap') {
                            console.log('volume mode started');
                        }
                        volumeMode = true;
                        var currentPalmPosition = frame.hands[0].palmPosition[1];
                        if (!posLastVolumeSwitch) {
                            posLastVolumeSwitch = currentPalmPosition;
                        } else {
                            delta = currentPalmPosition - posLastVolumeSwitch;
                            if (delta > config.sensibilityInVolumeMode) {
                                posLastVolumeSwitch = currentPalmPosition;
                                volumeUp();
                            } else if (delta < -config.sensibilityInVolumeMode) {
                                posLastVolumeSwitch = currentPalmPosition;
                                volumeDown();
                            }
                        }
                    }
                }

                // swipe gesture
                if (frame.gestures.length > 0 && frame.gestures[0].type === 'swipe') {
                    if (Math.abs(frame.gestures[0].direction[0]) > (Math.abs(frame.gestures[0].direction[1] * 2))
                        && Math.abs(frame.gestures[0].direction[0]) > (Math.abs(frame.gestures[0].direction[2] * 2))) {
                        if (frame.gestures[0].direction[0] < 0) {
                            no_swipe_up++;
                        } else {
                            no_swipe_down++;
                        }
                    }
                }

                if (frame.gestures.length > 0 && frame.gestures[0].type === 'circle' && frame.gestures[0].radius > 90
                    && ((enterNumberModeLastRegistered < newDateMinusOneSecond) || !enterNumberModeLastRegistered)) {
                    enterNumberMode = true;
                    enterNumberModeLastRegistered = new Date();
                    numberMode_initiatorHandId = frame.hands[0].id;
                    console.log('numberMode started');
                }

                // fist
                if (0 === no_fingersExtended) {
                    if (lastTimeOneHandAllFingers > newDateMinusHalfSecond) {
                        lastTimeOneHandZeroFingers = new Date();
                    }
                }

                // all fingers outstreched
                if (5 === no_fingersExtended) {
                    if (lastTimeOneHandZeroFingers > newDateMinusHalfSecond) {
                        muted = true;
                    } else {
                        lastTimeOneHandAllFingers = new Date();
                        muted = false;
                    }
                }
            } else if (2 === no_hands) {
                var posHand1 = frame.hands[0].palmPosition[0],
                    posHand2 = frame.hands[1].palmPosition[0],
                    delta = Math.abs(posHand1 - posHand2);

                if (40 >= delta && lastTimeTwoHandsApart > newDateMinusHalfSecond) { // hands together
                    lastTimeTwoHandsTogether = new Date();
                } else if (100 < delta) {
                    if (lastTimeTwoHandsTogether > newDateMinusHalfSecond) {
                        powerOff = true;
                    } else {
                        lastTimeTwoHandsApart = new Date();
                        powerOff = false;
                    }
                }
            }
        }
        prevNumberOfHands = no_hands;
    });
});