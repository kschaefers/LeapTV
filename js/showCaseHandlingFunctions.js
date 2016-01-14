var powerOff = true,
    startTime = new Date(),
    youtubePlaylist = '9HTEZkTA11Q,L7AxNcg8RXE,s6zR2T9vn2c,0wCC3aLXdOw',
    channelLength = youtubePlaylist.split(',').length
currentChannel = 0;


function channelUp() {
    console.log('channel Up');
    if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=ChUp', function (data) { /* what to do with the data returned */
        });
    } else {
        if (!powerOff) {
            //javascript negative number modulo workaround http://stackoverflow.com/a/4467559
            currentChannel = (((currentChannel + 1) % channelLength ) + channelLength) % channelLength;
            showChannelDisplay();
            player.nextVideo();
            player.seekTo(getCurrentTime(), true);
        }
    }
}

function channelDown() {
    console.log('channel Down');
    if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=ChDown', function (data) { /* what to do with the data returned */
        });
    } else {
        if (!powerOff) {
            //javascript negative number modulo workaround http://stackoverflow.com/a/4467559
            currentChannel = (((currentChannel - 1) % channelLength ) + channelLength) % channelLength;
            showChannelDisplay();
            player.previousVideo();
            player.seekTo(getCurrentTime(), true);
        }
    }
}

function volumeUp() {
    console.log('volume Up');
    if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=VolUp', function (data) { /* what to do with the data returned */
        });
    } else {
        if (!powerOff) {
            if (player.isMuted()) {
                player.unMute();
            }
            player.setVolume(player.getVolume() + 10);
            showVolumeDisplay();
        }
    }
}

function volumeDown() {
    console.log('volume Down');
    if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=VolDown', function (data) { /* what to do with the data returned */
        });
    } else {
        if (!powerOff) {
            if (player.isMuted()) {
                player.unMute();
            }
            player.setVolume(player.getVolume() - 10);
            showVolumeDisplay();
        }
    }
}

function mute() {
    console.log('mute');
    if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=Mute', function (data) { /* what to do with the data returned */
        });
    } else {
        if (!powerOff) {
            if (player.isMuted()) {
                player.unMute();
            } else {
                player.mute();
            }
            showMute();
        }
    }
}

function power() {
    console.log('power');
    if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=PowerOff', function (data) { /* what to do with the data returned */
        });
    } else {
        if (undefined === player) {
            console.log('no internet connection - TV can not be turned on');
        } else {
            if (powerOff) {
                showChannelDisplay();
                $('#TV').fadeTo(2000, 1);
                player.seekTo(getCurrentTime(), true);
                player.playVideo();
            } else {
                $('#TV').fadeTo('fast', 0);
                player.pauseVideo();
            }
        }
        powerOff = !powerOff;
    }

}

function enterNumber(number) {
    console.log('enter ' + number);
        if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=' + number, function (data) { /* what to do with the data returned */
        });
    }
}

function pressOK() {
    console.log('OK');
    if (config.controlTV) {
        $.get('http://localhost:8080/?' + config.tv + '=Enter', function (data) { /* what to do with the data returned */
        });
    }
}

function switchToChannel(number) {
    if (config.controlTV) {
        var numberAsString = number + '';
        if (numberAsString != '') {
            enterNumber(numberAsString[0]);
            window.setTimeout(function () {
                switchToChannel(numberAsString.substring(1, numberAsString.length))
            }, 250)
        } else {
            pressOK();
        }
    } else {
        if (!powerOff) {
            currentChannel = number % channelLength;
            showChannelDisplay();
            player.playVideoAt(currentChannel);
            player.seekTo(getCurrentTime(), true);
        }
    }
}

function getCurrentTime() {
    return (new Date - startTime) / 1000;
}

function showChannelDisplay() {
    var channelDisplay = $('#channelDisplay');
    channelDisplay.html(currentChannel + 1);
    channelDisplay.show().delay(3000).fadeOut();

}
function showVolumeDisplay() {
    var volumeDisplay = $('#volumeDisplay'),
        volume = player.getVolume() / 10, volumeString = '|';
    for (var i = 0; i < 10; i++) {
        if (i > volume) {
            volumeString += "&nbsp;";
        } else {
            volumeString += "-";
        }
    }
    volumeDisplay.html(volumeString + '|');
    volumeDisplay.show();
    window.setTimeout(function () {
        if (!player.isMuted()) {
            volumeDisplay.fadeOut();
        }
    }, 3000);
}

function showMute() {
    if (!player.isMuted()) {
        var volumeDisplay = $('#volumeDisplay');
        volumeDisplay.html('<svg data-kw="volume control8" data-id="15571" class="detail convertSvgInline replaced-svg" xml:space="preserve" style="enable-background:new 0 0 502.664 502.664;" viewBox="0 0 502.664 502.664" y="0px" x="0px" height="100%" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" id="imgView" version="1.1"><g><polygon points="96.637,158.977 96.637,343.687 286.244,495.157 286.244,7.507   "></polygon><rect height="186.846" width="63.914" y="155.698"></rect><path d="M502.664,184.516l-34.082-34.125l-66.826,66.848l-66.869-66.848l-34.125,34.125l66.848,66.848l-66.848,66.783    l34.125,34.125l66.869-66.826l66.826,66.826l34.082-34.125l-66.805-66.783L502.664,184.516z"></path></g></svg>');
        volumeDisplay.show();
    } else {
        showVolumeDisplay();
    }

}