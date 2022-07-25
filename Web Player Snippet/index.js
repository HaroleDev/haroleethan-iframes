const playpauseButton = document.querySelector('.play-pause-button');
const videoContainer = document.querySelector('.video-container');
const video = document.querySelector('video');

const currentTime = document.querySelector('.current-time');
const totalTime = document.querySelector('.total-time');
const cuetimeTooltip = document.querySelector('.cuetime-tooltip');
const cuetime = document.querySelector('.cuetime');

const EQswitchToggle = document.querySelector('.eq-switch')
const rangeEQControl = document.querySelectorAll('.dialog .eq-control input');

const captionButton = document.querySelector(".caption-button");
const settingsButton = document.querySelector('.settings-button');
const settingsContextMenu = document.querySelector('.settings-context-menu');
const settingsTooltipContainer = document.querySelector('.settings-tooltip-container');

const eqContainer = document.querySelector('.eq-dialog-container');
const loopItem = document.querySelector('.loop-item');
const eqItem = document.querySelector('.eq-item');
const downloadItem = document.querySelector('.download-item');
const Item = document.querySelector('.item');

const transcriptItem = document.querySelector('.transcript-item');
const transcriptPanel = document.querySelector('.transcript-panel');
const transcriptDiv = document.querySelector('.captions-contents');

const videoPlayer = document.querySelector('.video-player');

const dialog = document.querySelector('.dialog');
const closeDialog = document.querySelector('.close-dialog');

const volumeSliderContainer = document.querySelector('.volume-slider-container');
const volumeContainer = document.querySelector('.volume-container');
const volumeButton = document.querySelector('.volume-button');
const volumeTooltipContainer = document.querySelector('.volume-tooltip-container');

const dialogOverlay = document.querySelector('.dialog-overlay');

const fullscreenButton = document.querySelector('.full-screen-button');
const fullscreenTooltip = document.querySelector('.full-screen-tooltip');
const pipPlayerButton = document.querySelector(".pip-button");

const timelineContainer = document.querySelector(".timeline-container");
const videoControlsContainer = document.querySelector(".video-controls-container");

const snackbarSyncTranscript = document.querySelector('.snackbar-sync-time')

var videoSrc = './hls streams/IMG_1175_H264STREAM.m3u8';
var videoFallbackSrc = '//res.cloudinary.com/harole/video/upload/v1658759272/IMG_1175_H264STREAM_cg5sho.mp4';

window.addEventListener('load', () => {
    videoPlayer.querySelector('.video-name h1').textContent = videoPlayer.querySelector('video').getAttribute('data-video-title');
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
    } else if (Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(document.querySelector('video source'));
    } else if (!Hls.isSupported()) {
        video.src = videoFallbackSrc;
    }
    trackElems = document.querySelectorAll("track");
    for (var i = 0; i < trackElems.length; i++) {
        var currentTrackElem = trackElems[i];
        tracksURLs[i] = currentTrackElem.src;
    }
    tracks = video.textTracks;
});
function handleInputChange(e) {
    let target = e.target;
    if (e.target.type !== 'range') {
        target = rangeEQControl;
    };
    const min = target.min;
    const max = target.max;
    const val = target.value;

    target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
};

//Context Menu
const contextMenu = document.querySelector(".video-context-menu");

function showContextMenu(show = true) {
    show ? contextMenu.classList.add('show') : contextMenu.classList.remove('show');
};

videoContainer.addEventListener('contextmenu', e => {
    e.preventDefault();
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target) && !transcriptPanel.contains(e.target)) {
        settingsButton.classList.remove('pressed');
        settingsContextMenu.classList.remove('pressed');
        settingsTooltipContainer.classList.add('tooltip-right');
        closedDialog()
    }
    showContextMenu();

    contextMenu.style.top = e.y + contextMenu.offsetHeight > window.innerHeight ? window.innerHeight - contextMenu.offsetHeight + 'px' : e.y + 'px';
    contextMenu.style.left = e.x + contextMenu.offsetWidth > window.innerWidth ? window.innerWidth - contextMenu.offsetWidth + 'px' : e.x + 'px';
});

function closeSettingsMenu(e) {
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target)) {
        settingsButton.classList.remove('pressed');
        settingsContextMenu.classList.remove('pressed');
        settingsTooltipContainer.classList.add('tooltip-right');
        closedDialog()
    }
}

transcriptPanel.addEventListener('contextmenu', e => {
    closeSettingsMenu(e)
});

transcriptPanel.addEventListener('click', e => {
    closeSettingsMenu(e)
});

videoPlayer.addEventListener('click', (e) => {
    volumeContainer.classList.remove('scrubbing');
    showContextMenu(show = false);
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target) && !transcriptPanel.contains(e.target)) {
        settingsButton.classList.remove('pressed');
        settingsContextMenu.classList.remove('pressed');
        settingsTooltipContainer.classList.add('tooltip-right');
    };
});

transcriptPanel.addEventListener('click', (e) => {
    volumeContainer.classList.remove('scrubbing');
    showContextMenu(show = false);
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target) && !transcriptPanel.contains(e.target)) {
        settingsButton.classList.remove('pressed');
        settingsContextMenu.classList.remove('pressed');
        settingsTooltipContainer.classList.add('tooltip-right');
    };
});

Item.addEventListener('click', () => {
    showContextMenu(show = false);
    settingsButton.classList.remove('pressed');
    settingsContextMenu.classList.remove('pressed');
    settingsTooltipContainer.classList.add('tooltip-right');
});

downloadItem.addEventListener('click', () => {
    window.open(`//res.cloudinary.com/harole/video/upload/fl_attachment/${videoFallbackSrc.substring(videoFallbackSrc.lastIndexOf("/") + 1, videoFallbackSrc.length)}`);
});

//Playback
playpauseButton.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);

document.addEventListener('DOMContentLoaded', () => {
    if (!('pictureInPictureEnabled' in document)) {
        pipPlayerButton.classList.add('hidden');
    }
});

settingsButton.addEventListener('click', () => {
    settingsButton.classList.toggle('pressed');
    settingsContextMenu.classList.toggle('pressed');
    settingsTooltipContainer.classList.toggle('tooltip-right');
});

//AudioContext
var ctx = (window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext);
if (ctx) {
    var context = new ctx();
} else {
    alert('Web Audio API is not supported.');
    eqItem.classList.add('unsupported');
}
var sourceNode = context.createMediaElementSource(document.querySelector('video'));

//EQ
var filters = [];

[30, 60, 125, 250, 500, 800, 1000, 2000, 4000, 8000, 16000].map(function (freq, i) {
    var eq = context.createBiquadFilter();
    eq.frequency.value = freq;
    eq.type = "peaking";
    eq.gain.value = 0;
    filters.push(eq);
    sourceNode.connect(filters[0]);
    for (var i = 0; i < filters.length - 1; i++) {
        filters[i].connect(filters[i + 1]);
    };
});

filters[filters.length - 1].connect(context.destination);

function changeGain(sliderValue, nbFilter) {
    var value = parseFloat(sliderValue);
    filters[nbFilter].gain.value = value;
};

//EQ dialog
eqItem.addEventListener('click', () => {
    eqContainer.classList.add("opened");
});

EQswitchToggle.addEventListener('click', () => {
    if (!eqContainer.classList.contains('enabled')) {
        eqContainer.classList.add('enabled');
        eqContainer.querySelectorAll('.eq-slider').forEach(element => {
            element.disabled = false;
            rangeEQControl.forEach(input => {
                input.addEventListener('input', handleInputChange);
            });
            sourceNode.disconnect();
            sourceNode.connect(filters[0]);
            filters[filters.length - 1].connect(context.destination);
        });
    } else {
        eqContainer.classList.remove('enabled')
        eqContainer.querySelectorAll('.eq-slider').forEach(element => {
            element.disabled = true;
            sourceNode.disconnect();
            sourceNode.connect(context.destination);
            filters[filters.length - 1].disconnect();
        });
    };
});

//Dialog
function closedDialog() {
    if (eqContainer.classList.contains('opened')) {
        eqContainer.classList.remove("opened");
    };
};

dialogOverlay.addEventListener('click', closedDialog);
closeDialog.addEventListener('click', closedDialog);

//Transcript
transcriptItem.addEventListener('click', () => {
    loadTranscript(document.getElementById('default-track').getAttribute('srclang'))
    videoPlayer.classList.add("transcript-opened");
});

transcriptPanel.querySelector('.close-transcript-panel').addEventListener('click', () => {
    videoPlayer.classList.remove("transcript-opened");
});

//Loop function
function loopVideo() {
    if (!loopItem.classList.contains("enabled")) {
        video.loop = true;
        loopItem.classList.add("enabled");
    } else {
        video.loop = false;
        loopItem.classList.remove("enabled");
    }
}

loopItem.addEventListener('click', loopVideo);

//Transcript
var tracks, trackElems, tracksURLs = [];

function loadTranscript(lang) {
    clearTranscriptDiv();
    disableAllTracks();
    document.querySelector(".transcript-language").textContent = video.querySelector('track').getAttribute('label')
    for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        var trackAsHtmlElem = trackElems[i];

        if ((track.language === lang) && (track.kind !== "chapters")) {
            if (videoContainer.classList.contains("caption")) {
                track.mode = "showing";
            } else {
                track.mode = "hidden";
            }
            if (trackAsHtmlElem.readyState === 2) {
                displayCues(track);
            } else {
                displayCuesAfterTrackLoaded(trackAsHtmlElem, track);
            }
        }
    }
}

function displayCuesAfterTrackLoaded(trackElem, track) {
    trackElem.addEventListener('load', function () {
        displayCues(track);
    });
}
function disableAllTracks() {
    for (var i = 0; i < tracks.length; i++)
        tracks[i].mode = "disabled";
}

function displayCues(track) {
    var cues = track.cues;

    for (var i = 0, len = cues.length; i < len; i++) {
        var cue = cues[i];
        addCueListeners(cue);
        var voices = getVoices(cue.text);
        var transcriptText = "";
        if (voices.length > 0) {
            for (var j = 0; j < voices.length; j++) {
                transcriptText += voices[j].voice + ': ' + removeHTML(voices[j].text);
            }
        } else {
            transcriptText = cue.text;
        }
        var clickableTranscriptText = "<div class=\"cue-container\" id=\"" + cue.startTime + "\"" + " onclick='jumpToTranscript(" + cue.startTime + ");'> <span class=\"cue-time\">" + formatDuration(cue.startTime) + "</span>" + "<span class=\"cues\">" + transcriptText + "</span></div>";
        addToTranscript(clickableTranscriptText);
    }
}

function getVoices(speech) {
    var voices = [];
    var pos = speech.indexOf('<v');
    while (pos != -1) {
        endVoice = speech.indexOf('>');
        var voice = speech.substring(pos + 2, endVoice).trim();
        var endSpeech = speech.indexOf('</v>');
        var text = speech.substring(endVoice + 1, endSpeech);
        voices.push({
            'voice': voice,
            'text': text
        });
        speech = speech.substring(endSpeech + 4);
        pos = speech.indexOf('<v');
    };
    return voices;
}

function removeHTML(text) {
    var div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
}

function jumpToTranscript(time) {
    video.currentTime = time;
    if (!video.paused) {
        video.play();
    } else {
        video.pause();
    };
}

function clearTranscriptDiv() {
    transcriptDiv.innerHTML = "";
}

function addToTranscript(htmlText) {
    transcriptDiv.innerHTML += htmlText;
}

function addCueListeners(cue) {
    cue.onenter = function () {
        var transcriptText = document.getElementById(this.startTime);
        transcriptText.classList.add("current");
        transcriptText.parentNode.scrollTop = transcriptText.offsetTop - transcriptText.parentNode.offsetTop;
    };
    cue.onexit = function () {
        var transcriptText = document.getElementById(this.startTime);
        transcriptText.classList.remove("current");
    };
}

//Keyboard shortcuts
document.addEventListener('keydown', e => {
    const tagName = document.activeElement.tagName.toLowerCase();

    if (tagName === 'input') return;
    if (e.getModifierState("Fn") ||
        e.getModifierState("Hyper") ||
        e.getModifierState("OS") ||
        e.getModifierState("Super") ||
        e.getModifierState("Win")) {
        return;
    }
    if (e.getModifierState("Control") +
        e.getModifierState("Alt") +
        e.getModifierState("Meta") > 1) {
        return;
    } else {
        switch (e.key.toLowerCase()) {
            case ' ':
                if (tagName === "button") return;
            case 'k':
                togglePlay();
                break;
            case 'f':
                videoContainer.classList.add('hovered');
                activity();
                toggleFullScreen();
                break;
            case 'c':
                videoContainer.classList.add('hovered');
                activity();
                toggleCaptions();
                break;
            case 'i':
                videoContainer.classList.add('hovered');
                activity();
                togglePIPPlayerMode();
                break;
            case 'm':
                videoContainer.classList.add('hovered');
                activity();
                toggleVolume();
                break;
            case 'arrowleft': case 'j':
                videoContainer.classList.add('hovered');
                activity();
                skip(-5);
                break;
            case 'arrowright': case 'l':
                videoContainer.classList.add('hovered')
                activity();
                skip(5);
                break
        };
    }
});

//Skip time
function skip(duration) {
    video.currentTime += duration;
};

function spinnerDivider() {
    const spinners = ['/', '–', '\\', '|']
    let index = 0
    var interval = setInterval(() => {
        let line = spinners[index]
        if (line == undefined) {
            index = 0
            line = spinners[index]
        }
        index = index > spinners.length ? 0 : index + 1
        document.querySelector('.divider-time').textContent = `${line}`;
        if (video.paused) clearInterval(interval)
    }, 600)
}

//Activity check
let timeout = null;
function activity() {
    clearTimeout(timeout);
    video.classList.remove('inactive');
    videoContainer.classList.add('hovered');
    if (videoContainer.classList.contains("hovered")) {
        timeout = setTimeout(function () {
            videoContainer.classList.remove('hovered');
            video.classList.add('inactive');
        }, 2000);
    }
};

//Full screen and picture-in-picture
fullscreenButton.addEventListener('click', toggleFullScreen);

function toggleFullScreen() {
    if (document.fullscreenElement == null) {
        if (videoPlayer.mozRequestFullScreen) {
            videoPlayer.mozRequestFullScreen();
        } else if (videoPlayer.webkitRequestFullScreen) {
            videoPlayer.webkitRequestFullScreen();
        } else if (videoPlayer.msRequestFullScreen) {
            videoPlayer.msRequestFullscreen();
        } else if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        };
    fullscreenTooltip.dataset.tooltip = 'Exit full screen' + ' (f)';
    } else {
        if (document.mozFullScreenElement || document.webkitIsFullScreen || document.msRequestFullscreen || document.requestFullscreen) {
            if (document.requestFullscreen) {
                document.exitFullscreen();
                fullscreenTooltip.dataset.tooltip = 'Full screen' + ' (f)';
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
                fullscreenTooltip.dataset.tooltip = 'Full screen' + ' (f)';
            } else if (document.msRequestFullscreen) {
                document.msExitFullscreen();
                fullscreenTooltip.dataset.tooltip = 'Full screen' + ' (f)';
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
                fullscreenTooltip.dataset.tooltip = 'Full screen' + ' (f)';
            };
        };
    };
};

async function togglePIPPlayerMode() {
    try {
        if (videoContainer.classList.contains("pip-player")) {
            videoContainer.classList.add("pip-player");
            await document.exitPictureInPicture();
        } else {
            videoContainer.classList.remove("pip-player");
            await video.requestPictureInPicture();
        };
    } catch (error) {
        console.error(error);
    };
};

function fullScreenToggleChange() {
    videoContainer.classList.toggle("full-screen", document.fullscreenElement);
};

document.addEventListener("fullscreenchange", fullScreenToggleChange);
document.addEventListener("mozfullscreenchange", fullScreenToggleChange);
document.addEventListener("webkitfullscreenchange", fullScreenToggleChange);
document.addEventListener("msfullscreenchange", fullScreenToggleChange);

function togglePIPClass() {
    videoContainer.classList.toggle("pip-player");
};

video.addEventListener("enterpictureinpicture", togglePIPClass);
video.addEventListener("leavepictureinpicture", togglePIPClass);

pipPlayerButton.addEventListener('click', togglePIPPlayerMode);

//Volume control
let isVolumeScrubbing = false;
volumeSliderContainer.addEventListener('mousemove', handleVolumeUpdate);
volumeSliderContainer.addEventListener("mousedown", volumeUpdate);
function volumeUpdate(e) {
    const rect = volumeSliderContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    isVolumeScrubbing = (e.buttons & 1) === 1;
    volumeContainer.classList.add('scrubbing');
    if (isVolumeScrubbing) {
        video.volume = percent;
        video.muted = percent === 0;
        volumeSliderContainer.style.setProperty('--volume-position', percent);
    };
    handleVolumeUpdate(e);
};

function handleVolumeUpdate(e) {
    const rect = volumeSliderContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    if (isVolumeScrubbing) {
        e.preventDefault();
        video.volume = percent;
        video.muted = percent === 0;
        volumeSliderContainer.style.setProperty('--volume-position', percent);
    };
};

volumeButton.addEventListener("click", toggleVolume);

function toggleVolume() {
    video.muted = !video.muted;
    if (video.muted) {
        volumeTooltipContainer.dataset.tooltip = 'Unmute' + ' (m)';
    } else {
        volumeTooltipContainer.dataset.tooltip = 'Mute' + ' (m)';
    };
};

video.addEventListener("volumechange", () => {
    let volumeLevel;
    if (video.muted || video.volume === 0) {
        volumeLevel = "mute";
        volumeTooltipContainer.dataset.tooltip = 'Unmute' + ' (m)';
    } else if (video.volume >= 0.6) {
        volumeLevel = "full";
    } else if (video.volume >= 0.3) {
        volumeLevel = "mid";
    } else {
        volumeLevel = "low";
        volumeTooltipContainer.dataset.tooltip = 'Mute' + ' (m)';
    };
    videoContainer.dataset.volumeLevel = volumeLevel;
});

//Timeline
timelineContainer.addEventListener("mousemove", handleTimelineUpdate);
timelineContainer.addEventListener("mousedown", toggleScrubbing);

document.addEventListener("mouseup", e => {
    if (isScrubbing) {
        toggleScrubbing(e);
    } if (isVolumeScrubbing) {
        volumeUpdate(e);
    };
});

document.addEventListener("mousemove", e => {
    if (isScrubbing) {
        handleTimelineUpdate(e);
    } if (isVolumeScrubbing) {
        handleVolumeUpdate(e);
        volumeContainer.classList.add('scrubbing');
    };
});

let isScrubbing = false;
let wasPaused;
function toggleScrubbing(e) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    isScrubbing = (e.buttons & 1) === 1;
    videoContainer.classList.toggle("scrubbing", isScrubbing);
    if (isScrubbing) {
        wasPaused = video.paused;
        video.pause();
    } else {
        video.currentTime = percent * video.duration;
        if (!wasPaused) video.play();
    };

    handleTimelineUpdate(e);
};

function handleTimelineUpdate(e) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    timelineContainer.style.setProperty("--preview-position", percent);
    if (isScrubbing) {
        e.preventDefault();
        timelineContainer.style.setProperty("--progress-position", percent);
        cuetimeTooltip.textContent = formatDuration(percent * video.duration);
        currentTime.textContent = formatDuration(percent * video.duration);
    };
};

function updateCueTimeTooltip(e) {
    const skipTo = (e.offsetX / e.target.clientWidth) * parseInt(e.target.getAttribute('max'));
    cuetimeTooltip.textContent = formatDuration(skipTo);
};

cuetime.addEventListener('mousemove', updateCueTimeTooltip);

//Load and update data
function loadedMetadata() {
    totalTime.textContent = formatDuration(video.duration);
    currentTime.textContent = formatDuration(video.currentTime);
    cuetime.setAttribute('max', video.duration + 1);
};

video.addEventListener("loadedmetadata", loadedMetadata);

video.addEventListener('loadstart', () => {
    videoPlayer.classList.add('loading');
});

video.addEventListener('canplay', () => {
    videoPlayer.classList.remove('loading');
});

video.addEventListener('canplaythrough', () => {
    if (video.duration) {
        timelineContainer.style.setProperty('--buffered-position', (1 / video.duration) * video.buffered.end(0));
    };
});

video.addEventListener("timeupdate", () => {
    currentTime.textContent = formatDuration(video.currentTime);
    updatetime();
    if (video.currentTime === video.duration) {
        videoContainer.classList.add('ended');
        timelineContainer.style.setProperty("--progress-position", 1);
    } else {
        videoContainer.classList.remove('ended');
    };
});

video.addEventListener("durationchange", () => {
    updatetime();
});

video.addEventListener("progress", () => {
    if (video.duration) {
        timelineContainer.style.setProperty('--buffered-position', (1 / video.duration) * video.buffered.end(0));
    };
});

function updatetime() {
    const percent = video.currentTime / video.duration;
    if (!video.paused) {
        if (video.duration) {
            timelineContainer.style.setProperty('--buffered-position', (1 / video.duration) * video.buffered.end(0));
        };
        timelineContainer.style.setProperty("--progress-position", percent);
    };
    reqId = requestAnimationFrame(updatetime);
};

const leading0Formatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
});

function formatDuration(time) {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    if (hours === 0) {
        return `${minutes}:${leading0Formatter.format(seconds)}`;
    } else {
        return `${hours}:${leading0Formatter.format(minutes)}:${leading0Formatter.format(seconds)}`;
    };
};

//Captions
const captions = video.textTracks[0];
captions.mode = "hidden";

captionButton.addEventListener("click", toggleCaptions);

function toggleCaptions() {
    const isHidden = captions.mode === "hidden";
    captions.mode = isHidden ? "showing" : "hidden";
    videoContainer.classList.toggle("caption", isHidden);
};

//Playback
function togglePlay() {
    if (video.currentTime === video.duration && video.paused) {
        if (contextMenu.classList.contains("show")) {
            return;
        } if (settingsContextMenu.classList.contains("pressed")) {
            return;
        };
        videoContainer.classList.remove('ended');
        video.currentTime = 0;
    };
    if (context.state === 'suspended') {
        context.resume();
    };
    video.paused ? video.play() : video.pause();
};

video.addEventListener("play", () => {
    spinnerDivider();
    videoContainer.addEventListener("mousemove", activity);
    videoContainer.addEventListener('mouseleave', () => {
        videoContainer.classList.remove('hovered');
        video.classList.add('inactive');
    });
    videoContainer.classList.remove('paused');
});

video.addEventListener("pause", () => {
    video.classList.remove('inactive');
    clearTimeout(timeout);
    videoContainer.classList.add('paused');
});

video.addEventListener('ended', () => {
    videoContainer.classList.add('ended');
});