var config = {
    startPosition: -1,
};
var hls = new Hls(config);

const playpauseButton = document.querySelector('.play-pause-button');
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
const seekingPreview = document.querySelector(".seeking-preview");
const seekingThumbnail = document.querySelector(".seeking-thumbnail");

const videoHLSSrc = '//res.cloudinary.com/harole/video/upload/sp_auto/v1658759272/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.m3u8';
const videoFallbackSrc = '//link.storjshare.io/jwrbyl67eqxrubohnqibyqwsx75q/harole-video%2F2022%2FSample%20Videos%2FJuly%2022%202022%2FIMG_1175_FALLBACKSTREAM.mp4?wrap=0';
const videoThumbs = '//link.storjshare.io/jvlmy6tcvabz5ka4kuwwy66yr6qq/harole-video%2F2022%2FSample%20Videos%2FJuly%2022%202022%2FIMG_1175_THUMBNAILS.png?wrap=0';
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

function mobileCheck() {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
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
            timelineContainer.style.setProperty("--aspect-ratio-size", video.videoWidth / video.videoHeight);
        });
    } else {
        video.querySelector('source').setAttribute('src', videoFallbackSrc);
        video.querySelector('source').setAttribute('type', FallbackCodec);
        video.load();
        //For MP4 container
        video.addEventListener("durationchange", () => {
            updatetime();
            timelineContainer.style.setProperty("--aspect-ratio-size", video.videoWidth / video.videoHeight);
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
    if (mobileCheck === true) {
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
    e.preventDefault();
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target) && !transcriptPanel.contains(e.target)) {
        settingsButton.classList.remove('pressed');
        settingsContextMenu.classList.remove('pressed');
        settingsTooltipContainer.classList.add('tooltip-right');
        closedDialog();
    };
    showContextMenu();

    contextMenu.style.top = e.y + contextMenu.offsetHeight > window.innerHeight ? window.innerHeight - contextMenu.offsetHeight + 'px' : e.y + 'px';
    contextMenu.style.left = e.x + contextMenu.offsetWidth > window.innerWidth ? window.innerWidth - contextMenu.offsetWidth + 'px' : e.x + 'px';
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
timelineInner.addEventListener("mousemove", e => {
    handleTimelineUpdate(e);
    seekingPreview.classList.add('hovered');
});

timelineInner.addEventListener("mouseleave", () => {
    seekingPreview.classList.remove('hovered');
})

timelineInner.addEventListener("mousedown", e => {
    toggleScrubbing(e);
});

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
    const rect = timelineInner.getBoundingClientRect();
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
    const rect = timelineInner.getBoundingClientRect();
    const seek = seekingPreview.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    var thumbPosition = Math.floor(percent * video.duration) * (64 * 2);
    seekingThumbnail.style.backgroundPosition = '-' + 0 + 'px -' + thumbPosition + 'px';

    seekingPreview.style.setProperty("--thumbnail-seek-position", e.x + seek.left < seek.width - 10 ? seekingPreview.offsetLeft + 'px' : e.x + seek.width > videoContainer.offsetWidth + 48 + 16 ? seekingPreview.offsetLeft + 'px' : e.x + 'px');
    timelineInner.style.setProperty("--preview-position", percent);
    cuetimeTooltip.textContent = formatDuration(percent * video.duration);
    if (isScrubbing) {
        e.preventDefault();
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
    seekingThumbnail.style.backgroundImage = `url('${videoThumbs}')`;
});

video.addEventListener('loadedmetadata', () => {
    videoPlayer.classList.remove('loading');
    seekingPreview.classList.remove('loading');
    timelineContainer.style.setProperty("--aspect-ratio-size", video.videoWidth / video.videoHeight);
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
    playpauseButton.dataset.tooltip = 'Pause' + ' (k)';
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
    playpauseButton.dataset.tooltip = 'Play' + ' (k)';
    video.classList.remove('inactive');
    clearTimeout(timeout);
    videoContainer.classList.add('paused');
});

video.addEventListener('ended', () => {
    videoContainer.classList.add('ended');
});