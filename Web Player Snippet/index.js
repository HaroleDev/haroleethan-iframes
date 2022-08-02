var config = {
    startPosition: -1,
};
var hls = new Hls(config);

const playpauseButton = document.querySelector('.play-pause-button');
const playpauseTooltipContainer = document.querySelector('.play-pause-tooltip-container');
const videoContainer = document.querySelector('.video-container');
const video = document.querySelector('.video');

const currentTime = document.querySelector('.current-time');
const totalTime = document.querySelector('.total-time');
const cuetimeTooltip = document.querySelector('.cuetime-tooltip');

const EQswitchToggle = document.querySelector('.eq-switch');
const rangeEQControl = document.querySelectorAll('.dialog .eq-control input');

const captionButton = document.querySelector(".caption-button");
const settingsButton = document.querySelector('.settings-button');
const settingsContextMenu = document.querySelector('.settings-context-menu');
const settingsTooltipContainer = document.querySelector('.settings-tooltip-container');

const contextMenu = document.querySelector(".video-context-menu");
const eqContainer = document.querySelector('.eq-dialog-container');
const loopItem = document.querySelector('.loop-item');
const eqItem = document.querySelector('.eq-item');
const downloadItem = document.querySelector('.download-item');
const Item = document.querySelector('.item');

const transcriptItem = document.querySelector('.transcript-item');
const transcriptPanel = document.querySelector('.transcript-panel');
const transcriptDiv = document.querySelector('.captions-contents');
const snackbarSyncTranscript = document.querySelector('.snackbar-sync-time');

const videoPlayer = document.querySelector('.video-player');

const dialog = document.querySelector('.dialog');
const closeDialog = document.querySelector('.close-dialog');
const closeTranscriptPanel = document.querySelector('.close-transcript-panel');

const volumeSliderContainer = document.querySelector('.volume-slider-container');
const volumeContainer = document.querySelector('.volume-container');
const volumeButton = document.querySelector('.volume-button');
const volumeTooltipContainer = document.querySelector('.volume-tooltip-container');

const dialogOverlay = document.querySelector('.dialog-overlay');

const fullscreenButton = document.querySelector('.full-screen-button');
const fullscreenTooltip = document.querySelector('.full-screen-tooltip');
const pipPlayerButton = document.querySelector(".pip-button");
const pipTooltip = document.querySelector(".pip-tooltip");

const timelineContainer = document.querySelector(".timeline-container");
const timelineInner = document.querySelector(".timeline");

const videoControlsContainer = document.querySelector(".video-controls-container");
const videoControls = document.querySelector(".controls");
const seekingPreview = document.querySelector(".seeking-preview");
const seekingThumbnail = document.querySelector(".seeking-thumbnail");
const videoThumbPreview = document.querySelector(".video-thumb-preview");

const videoHLSSrc = '//res.cloudinary.com/harole/video/upload/sp_auto/v1658759272/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.m3u8';
const videoFallbackSrc = '//link.storjshare.io/jwrbyl67eqxrubohnqibyqwsx75q/harole-video%2F2022%2FSample%20Videos%2FJuly%2022%202022%2FIMG_1175_FALLBACKSTREAM.mp4?wrap=0';
const videoThumbs = '//res.cloudinary.com/harole/image/upload/q_auto:low/v1659426432/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_THUMBNAILS_shmsny.jpg';
const HLSCodec = 'application/x-mpegURL';
const FallbackCodec = 'video/mp4';

function canFullscreen() {
    var check = typeof document.body.requestFullscreen !== 'undefined' ||
        typeof document.body.mozRequestFullScreen !== 'undefined' ||
        typeof document.body.webkitRequestFullscreen !== 'undefined' ||
        typeof document.body.msRequestFullscreen !== 'undefined' ||
        typeof document.body.exitFullscreen !== 'undefined' ||
        typeof document.body.mozCancelFullScreen !== 'undefined' ||
        typeof document.body.webkitExitFullscreen !== 'undefined';
    return check;
};

window.addEventListener('load', () => {
    if (!Hls.isSupported()) {
        hls.loadSource(videoHLSSrc);
        hls.attachMedia(video);
        video.querySelector('source').setAttribute('type', HLSCodec);
        //For HLS container
        hls.on(Hls.Events.LEVEL_LOADED, function () {
            loadedMetadata();
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.querySelector('source').setAttribute('src', videoHLSSrc);
        video.querySelector('source').setAttribute('type', HLSCodec);
        video.load();
        video.addEventListener("durationchange", () => {
            updatetime();
        });
    } else {
        video.querySelector('source').setAttribute('src', videoFallbackSrc);
        video.querySelector('source').setAttribute('type', FallbackCodec);
        video.load();
        //For MP4 container
        video.addEventListener("durationchange", () => {
            updatetime();
        });
    };

    eqContainer.querySelectorAll('.eq-slider').forEach(element => {
        element.disabled = true;
        element.value = 0;
    });

    if (!('pictureInPictureEnabled' in document)) {
        pipPlayerButton.classList.add('unsupported');
        pipTooltip.dataset.tooltip = 'Picture in picture is unavailable.';
    };
    if (!canFullscreen) {
        fullscreenButton.classList.add('unsupported');
        fullscreenTooltip.dataset.tooltip = 'Full screen is unavailable.';
    };

    let isMobile = /Mobi/.test(window.navigator.userAgent);
    if (isMobile) {
        volumeTooltipContainer.classList.add('hidden');
    };
});

//Range slider track
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

//Context menu
function showContextMenu(show = true) {
    show ? contextMenu.classList.add('show') : contextMenu.classList.remove('show');
};

videoContainer.addEventListener('contextmenu', e => {
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target) && !transcriptPanel.contains(e.target)) {
        settingsButton.classList.remove('pressed');
        settingsContextMenu.classList.remove('pressed');
        settingsTooltipContainer.classList.add('tooltip-right');
        closedDialog();
    };
    
    if (contextMenu.classList.contains('show')) {
        showContextMenu(show = false);
    } else {
        e.preventDefault();
        contextMenu.style.top = e.y + contextMenu.offsetHeight > window.innerHeight ? window.innerHeight - contextMenu.offsetHeight + 'px' : e.y + 'px';
        contextMenu.style.left = e.x + contextMenu.offsetWidth > window.innerWidth ? window.innerWidth - contextMenu.offsetWidth + 'px' : e.x + 'px';
        showContextMenu();
    };

});

function closeSettingsMenu(e) {
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target)) {
        settingsButton.classList.remove('pressed');
        settingsContextMenu.classList.remove('pressed');
        settingsTooltipContainer.classList.add('tooltip-right');
        closedDialog();
    };
};

videoPlayer.addEventListener('click', e => {
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
    window.open(videoFallbackSrc);
    settingsButton.classList.remove('pressed');
    settingsContextMenu.classList.remove('pressed');
    settingsTooltipContainer.classList.add('tooltip-right');
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
    eqItem.classList.add('unsupported');
};
var sourceNode = context.createMediaElementSource(video);

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
    if (eqContainer.classList.contains('enabled')) {
        eqContainer.classList.remove('enabled')
        eqContainer.querySelectorAll('.eq-slider').forEach(element => {
            element.disabled = true;
            sourceNode.disconnect();
            sourceNode.connect(context.destination);
            filters[filters.length - 1].disconnect();
        });
    } else {
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
    };
});

//Dialog
function closedDialog() {
    if (eqContainer.classList.contains('opened')) {
        eqContainer.classList.remove("opened");
    } else {
        return;
    };
};

dialogOverlay.addEventListener('click', closedDialog);
closeDialog.addEventListener('click', closedDialog);

//Transcript Panel
transcriptItem.addEventListener('click', () => {
    loadTranscript(document.getElementById('default-track').getAttribute('srclang'))
    videoPlayer.classList.add("transcript-opened");
});

closeTranscriptPanel.addEventListener('mouseover', () => {
    videoContainer.classList.add('hovered');
    video.classList.remove('inactive');
});

closeTranscriptPanel.addEventListener('mouseleave', () => {
    videoContainer.classList.remove('hovered');
    video.classList.add('inactive');
});

closeTranscriptPanel.addEventListener('click', () => {
    videoPlayer.classList.remove("transcript-opened");
});

//Captions
const captions = video.textTracks[0];
captions.mode = "hidden";

captionButton.addEventListener("click", toggleCaptions);

function toggleCaptions() {
    const isHidden = captions.mode === "hidden";
    captions.mode = isHidden ? "showing" : "hidden";
    videoContainer.classList.toggle("caption", isHidden);
};

//Transcript
var tracks, trackElems, tracksURLs = [];

trackElems = document.querySelectorAll("track");
for (var i = 0; i < trackElems.length; i++) {
    var currentTrackElem = trackElems[i];
    tracksURLs[i] = currentTrackElem.src;
};
tracks = video.textTracks;

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
            };

            if (trackAsHtmlElem.readyState === 2) {
                displayCues(track);
            } else {
                displayCuesAfterTrackLoaded(trackAsHtmlElem, track);
            };
        };
    };
};

function displayCuesAfterTrackLoaded(trackElem, track) {
    trackElem.addEventListener('load', function () {
        displayCues(track);
    });
};
function disableAllTracks() {
    for (var i = 0; i < tracks.length; i++)
        tracks[i].mode = "disabled";
};

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
            };
        } else {
            transcriptText = cue.text;
        };
        var clickableTranscriptText = "<div class=\"cue-container\" id=\"" + cue.startTime + "\"" + " onclick='jumpToTranscript(" + cue.startTime + ");'> <span class=\"cue-time\">" + formatDuration(cue.startTime) + "</span>" + "<span class=\"cues\">" + transcriptText + "</span></div>";
        addToTranscript(clickableTranscriptText);
    };
};

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
};

function removeHTML(text) {
    var div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
};

function jumpToTranscript(time) {
    video.currentTime = time;
    if (!video.paused) {
        video.play();
    } else {
        video.pause();
        timelineInner.style.setProperty("--progress-position", video.currentTime / video.duration);
    };
};

function clearTranscriptDiv() {
    transcriptDiv.innerHTML = "";
};

function addToTranscript(htmlText) {
    transcriptDiv.innerHTML += htmlText;
};

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
};

transcriptPanel.addEventListener('click', e => {
    volumeContainer.classList.remove('scrubbing');
    showContextMenu(show = false);
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target) && !transcriptPanel.contains(e.target)) {
        settingsButton.classList.remove('pressed');
        settingsContextMenu.classList.remove('pressed');
        settingsTooltipContainer.classList.add('tooltip-right');
    };
});

transcriptPanel.addEventListener('contextmenu', e => { closeSettingsMenu(e); });

transcriptPanel.addEventListener('click', e => { closeSettingsMenu(e); });

//Keyboard shortcuts
videoContainer.addEventListener('keydown', e => {
    const tagName = document.activeElement.tagName.toLowerCase();

    if (tagName === 'input') return;
    if (e.getModifierState("Fn") ||
        e.getModifierState("Hyper") ||
        e.getModifierState("OS") ||
        e.getModifierState("Super") ||
        e.getModifierState("Win")) {
        return;
    };
    if (e.getModifierState("Control") +
        e.getModifierState("Alt") +
        e.getModifierState("Meta") > 1) {
        return;
    } else {
        switch (e.key.toLowerCase()) {
            case ' ':
                if (tagName === "button") break;
            case 'k':
                togglePlay();
                break;
            case 'f':
                videoContainer.classList.add('hovered');
                if (fullscreenButton.classList.contains('unsupported')) {
                    break;
                };
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
                if (pipPlayerButton.classList.contains('unsupported')) { break; };
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
                videoContainer.classList.add('hovered');
                activity();
                skip(5);
                break;
        };
    };
});

//Loop function
function loopVideo() {
    if (!loopItem.classList.contains("enabled")) {
        video.loop = true;
        loopItem.classList.add("enabled");
    } else {
        video.loop = false;
        loopItem.classList.remove("enabled");
    };
};

loopItem.addEventListener('click', loopVideo);

//Skip time
function skip(duration) {
    video.currentTime += duration;
};

//Time divider animation
function spinnerDivider() {
    const spinners = ['/', '–', '\\', '|'];
    let index = 0;
    var interval = setInterval(() => {
        if (video.paused) clearInterval(interval);
        let line = spinners[index];
        if (line == undefined) {
            index = 0;
            line = spinners[index];
        };
        index = index > spinners.length ? 0 : index + 1;
        document.querySelector('.divider-time').textContent = `${line}`;
    }, 600);
};

//Activity check
let timeout = null;
function activity() {
    clearTimeout(timeout);
    currentTime.textContent = formatDuration(video.currentTime);
    video.classList.remove('inactive');
    videoControlsContainer.classList.remove('inactive');
    videoContainer.classList.add('hovered');
    if (videoContainer.classList.contains("hovered")) {
        if (video.paused) {
            return;
        } else if (!video.paused) {
            timeout = setTimeout(function () {
                videoContainer.classList.remove('hovered');
                videoControlsContainer.classList.add('inactive');
                video.classList.add('inactive');
            }, 3000);
        };
    };
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
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msRequestFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            };
            fullscreenTooltip.dataset.tooltip = 'Full screen' + ' (f)';
        };
    };
};

async function togglePIPPlayerMode() {
    try {
        if (document.pictureInPictureEnabled && !video.disablePictureInPicture) {
            if (videoContainer.classList.contains("pip-player") && !video.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                await video.requestPictureInPicture();
            };
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
    if (videoContainer.classList.contains("pip-player")) {
        videoContainer.classList.remove("pip-player");
        fullscreenTooltip.dataset.tooltip = 'Full screen' + ' (f)';
    } else {
        videoContainer.classList.add("pip-player");
        fullscreenTooltip.dataset.tooltip = 'Full screen is unavailable.';
    };
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
    isVolumeScrubbing = (e.buttons && 1) === 1;
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
function seekingPreviewPosition(e) {
    const seek = seekingPreview.getBoundingClientRect();
    seekingPreview.style.setProperty("--thumbnail-seek-position", e.x + seek.left < seek.width ? seekingPreview.offsetLeft + 'px' : e.x + seek.width > videoContainer.offsetWidth + 48 + 12 ? seekingPreview.offsetLeft + 'px' : e.x + 'px');
}


timelineInner.addEventListener("mousemove", e => {
    handleTimelineUpdate(e);
    seekingPreview.classList.add('hovered');
    videoControls.classList.add('hidden');
    seekingPreviewPosition(e);
});

timelineInner.addEventListener("mouseleave", () => {
    seekingPreview.classList.remove('hovered');
    videoControls.classList.remove('hidden');
})

timelineInner.addEventListener("mousedown", e => {
    toggleScrubbing(e);
});

document.addEventListener("mouseup", e => {
    if (isScrubbing) {
        toggleScrubbing(e);
        seekingPreview.classList.add('loading');
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
    const rect = timelineInner.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    isScrubbing = (e.buttons & 1) === 1;
    seekingPreviewPosition(e);
    videoContainer.classList.add("scrubbing", isScrubbing);
    if (isScrubbing) {
        wasPaused = video.paused;
        video.pause();
    } else {
        video.currentTime = percent * video.duration;
        if (!wasPaused) video.play();
    };

    handleTimelineUpdate(e);
};

video.addEventListener('seeked', () => {
    videoContainer.classList.remove("scrubbing");
    seekingPreview.classList.remove('loading');
})

function handleTimelineUpdate(e) {
    const rect = timelineInner.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    var thumbPosition = Math.floor(percent * video.duration) / Math.floor(video.duration) * 100 
    seekingThumbnail.style.backgroundPositionY = `${thumbPosition}%`;

    seekingPreviewPosition(e);
    timelineInner.style.setProperty("--preview-position", percent);
    cuetimeTooltip.textContent = formatDuration(percent * video.duration);
    if (isScrubbing) {
        e.preventDefault();
        videoThumbPreview.style.backgroundImage = `url('${videoThumbs}')`;
        videoThumbPreview.style.backgroundPositionY = `${thumbPosition}%`;
        seekingPreviewPosition(e);
        timelineInner.style.setProperty("--progress-position", percent);
        cuetimeTooltip.textContent = formatDuration(percent * video.duration);
        currentTime.textContent = formatDuration(percent * video.duration);
    };
};

//Load and update data
function loadedMetadata() {
    totalTime.textContent = formatDuration(video.duration);
    currentTime.textContent = formatDuration(video.currentTime);
};

video.addEventListener('loadstart', () => {
    videoPlayer.classList.add('loading');
});

video.addEventListener('loadedmetadata', () => {
    videoPlayer.classList.remove('loading');
    seekingPreview.classList.remove('loading');
    seekingThumbnail.style.backgroundImage = `url('${videoThumbs}')`;
    videoContainer.style.setProperty("--aspect-ratio-size", video.videoWidth / video.videoHeight);
    videoContainer.style.setProperty("--aspect-ratio-size-inverse", video.videoHeight / video.videoWidth);
    loadedMetadata();
});

video.addEventListener('canplay', () => {
    if (video.buffered.length > 0)
        timelineInner.style.setProperty('--buffered-position', (1 / video.duration) * video.buffered.end(0));
});

video.addEventListener("timeupdate", () => {
    if (videoContainer.classList.contains('hovered')) {
        updatetime();
        currentTime.textContent = formatDuration(video.currentTime);
    } else {
        return;
    };

    if (video.currentTime === video.duration) {
        videoContainer.classList.add('ended');
        timelineInner.style.setProperty("--progress-position", 1);
    } else {
        videoContainer.classList.remove('ended');
    };
});

video.addEventListener("progress", () => {
    if (video.buffered.length > 0)
        timelineInner.style.setProperty('--buffered-position', (1 / video.duration) * video.buffered.end(0));
});

async function updatetime() {
    const percent = video.currentTime / video.duration;
    if (!video.paused) {
        timelineInner.style.setProperty('--buffered-position', (1 / video.duration) * video.buffered.end(0));
        timelineInner.style.setProperty("--progress-position", percent);
    };
    const reqId = requestAnimationFrame(updatetime);
    return reqId;
};

const leading0Formatter = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });

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

//Playback
playpauseButton.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);

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
    playpauseTooltipContainer.dataset.tooltip = 'Pause' + ' (k)';
    spinnerDivider();
    if (Hls.isSupported() && video.currentTime === 0)
        hls.startLoad();
    videoContainer.addEventListener("mousemove", activity);
    videoContainer.addEventListener('mouseleave', () => {
        videoContainer.classList.remove('hovered');
        video.classList.add('inactive');
    });
    videoContainer.classList.remove('paused');
});

video.addEventListener("pause", () => {
    playpauseTooltipContainer.dataset.tooltip = 'Play' + ' (k)';
    video.classList.remove('inactive');
    clearTimeout(timeout);
    videoContainer.classList.add('paused');
});

video.addEventListener('ended', () => {
    videoContainer.classList.add('ended');
});
