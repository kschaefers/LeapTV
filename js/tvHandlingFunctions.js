function channelUp() {
    if (config.debug) {
        console.log('channel Up');
    } else {
        $.get('http://localhost:8080/?' + config.tv + '=ChUp', function (data) { /* what to do with the data returned */
        })
    }
}

function channelDown() {
    if (config.debug) {
        console.log('channel Down');
    } else {
        $.get('http://localhost:8080/?' + config.tv + '=ChDown', function (data) { /* what to do with the data returned */
        })
    }
}

function volumeUp() {
    if (config.debug) {
        console.log('volume Up');
    } else {
        $.get('http://localhost:8080/?' + config.tv + '=VolUp', function (data) { /* what to do with the data returned */
        })
    }
}

function volumeDown() {
    if (config.debug) {
        console.log('volume Down');
    } else {
        $.get('http://localhost:8080/?' + config.tv + '=VolDown', function (data) { /* what to do with the data returned */
        })
    }
}

function mute() {
    if (config.debug) {
        console.log('mute');
    } else {
        $.get('http://localhost:8080/?' + config.tv + '=Mute', function (data) { /* what to do with the data returned */
        })
    }
}

function power() {

}

function enterNumber() {

}