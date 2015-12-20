function channelUp() {
    console.log('channel Up');
    if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=ChUp', function (data) { /* what to do with the data returned */
        })
    }
}

function channelDown() {
    console.log('channel Down');
    if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=ChDown', function (data) { /* what to do with the data returned */
        })
    }
}

function volumeUp() {
    console.log('volume Up');
    if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=VolUp', function (data) { /* what to do with the data returned */
        })
    }
}

function volumeDown() {
    console.log('volume Down');
    if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=VolDown', function (data) { /* what to do with the data returned */
        })
    }
}

function mute() {
    console.log('mute');
    if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=Mute', function (data) { /* what to do with the data returned */
        })
    }
}

function power() {
    console.log('power');
    if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=PowerOff', function (data) { /* what to do with the data returned */
        })
    }

}

function enterNumber(number) {
    console.log('enter ' + number);
    if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=' + number, function (data) { /* what to do with the data returned */
        })
    }
}

function pressOK() {
    console.log('OK');
    if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=Enter', function (data) { /* what to do with the data returned */
        })
    }
}

function switchToChannel(number) {
    var numberAsString = number + '';
    if ('' != numberAsString) {
        var numberAsArray = numberAsString.split('');

        $.each(numberAsArray, function (index, value) {
            enterNumber(value);
        });
        pressOK();
    }
}