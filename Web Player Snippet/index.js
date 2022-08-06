const videoMetadata = {
    video_thumbs: "//res.cloudinary.com/harole/image/upload/q_auto:low/v1659426432/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_THUMBNAILS_shmsny.jpg",
    video_poster: "//res.cloudinary.com/harole/video/upload/c_fill,h_720,q_auto:eco,w_1280/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    //HLS_src: "//res.cloudinary.com/harole/video/upload/sp_auto/v1658759272/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.m3u8",
    HLS_codec: "application/x-mpegURL",
    Fallback_src: "//link.storjshare.io/jwrbyl67eqxrubohnqibyqwsx75q/harole-video%2F2022%2FSample%20Videos%2FJuly%2022%202022%2FIMG_1175_FALLBACKSTREAM.mp4?wrap=0",
    Fallback_codec: "video/mp4",
    video_FPS: "59.940",

    video_Viewport: "1280",
};

const mediaSessionMetadata = {
    thumb_512: "//res.cloudinary.com/harole/video/upload/c_fill,q_auto:eco,w_512,h_512/v1659426432/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    thumb_256: "//res.cloudinary.com/harole/video/upload/c_fill,q_auto:eco,w_384,h_384/v1659426432/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    thumb_256: "//res.cloudinary.com/harole/video/upload/c_fill,q_auto:eco,w_256,h_256/v1659426432/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    thumb_192: "//res.cloudinary.com/harole/video/upload/c_fill,q_auto:eco,w_192,h_192/v1659426432/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    thumb_128: "//res.cloudinary.com/harole/video/upload/c_fill,q_auto:eco,w_128,h_128/v1659426432/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    thumb_96: "//res.cloudinary.com/harole/video/upload/c_fill,q_auto:eco,w_96,h_96/v1659426432/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    type: "image/jpeg",
};

var config = {
    startPosition: -1,
};
var hls = new Hls(config);

const playpauseButton = document.querySelector(".play-pause-button");
const playpauseTooltipContainer = document.querySelector(".play-pause-tooltip-container");
const videoContainer = document.querySelector(".video-container");
const videoPoster = document.querySelector(".video-poster");
const video = document.querySelector(".video");

const currentTime = document.querySelector(".current-time");
const totalTime = document.querySelector(".total-time");
const cuetimeTooltip = document.querySelector(".cuetime-tooltip");

const EQswitchToggle = document.querySelector(".eq-switch");
const rangeEQControl = document.querySelectorAll(".dialog .eq-control input");

const captionButton = document.querySelector(".caption-button");
const settingsButton = document.querySelector(".settings-button");
const settingsContextMenu = document.querySelector(".settings-context-menu");
const settingsTooltipContainer = document.querySelector(".settings-tooltip-container");

const contextMenu = document.querySelector(".video-context-menu");
const eqContainer = document.querySelector(".eq-dialog-container");
const loopItem = document.querySelector(".loop-item");
const eqItem = document.querySelector(".eq-item");
const downloadItem = document.querySelector(".download-item");
const Item = document.querySelector(".item");

const transcriptItem = document.querySelector(".transcript-item");
const transcriptPanel = document.querySelector(".transcript-panel");
const transcriptDiv = document.querySelector(".captions-contents");
const snackbarSyncTranscript = document.querySelector(".snackbar-sync-time");

const videoPlayer = document.querySelector(".video-player");

const dialog = document.querySelector(".dialog");
const closeDialog = document.querySelector(".close-dialog");
const closeTranscriptPanel = document.querySelector(".close-transcript-panel");

const volumeSliderContainer = document.querySelector(".volume-slider-container");
const volumeContainer = document.querySelector(".volume-container");
const volumeButton = document.querySelector(".volume-button");
const volumeTooltipContainer = document.querySelector(".volume-tooltip-container");

const dialogOverlay = document.querySelector(".dialog-overlay");

const fullscreenButton = document.querySelector(".full-screen-button");
const fullscreenTooltip = document.querySelector(".full-screen-tooltip");
const pipPlayerButton = document.querySelector(".pip-button");
const pipTooltip = document.querySelector(".pip-tooltip");

const timelineContainer = document.querySelector(".timeline-container");
const timelineInner = document.querySelector(".timeline");

const videoControlsContainer = document.querySelector(".video-controls-container");
const videoControls = document.querySelector(".controls");
const seekingPreview = document.querySelector(".seeking-preview");
const seekingThumbnail = document.querySelector(".seeking-thumbnail");
const videoThumbPreview = document.querySelector(".video-thumb-preview");

function canFullscreen() {
    var check = typeof document.body.requestFullscreen !== "undefined" ||
        typeof document.body.mozRequestFullScreen !== "undefined" ||
        typeof document.body.webkitRequestFullscreen !== "undefined" ||
        typeof document.body.msRequestFullscreen !== "undefined" ||
        typeof document.body.exitFullscreen !== "undefined" ||
        typeof document.body.mozCancelFullScreen !== "undefined" ||
        typeof document.body.webkitExitFullscreen !== "undefined";
    return check;
};

window.addEventListener("load", function () {
    document.body.classList.remove('preload');
}, { once: true });

window.addEventListener("DOMContentLoaded", () => {
    videoPoster.src = videoMetadata.video_poster;

    /*if (!Hls.isSupported()) {
        hls.loadSource(videoMetadata.HLS_src);
        hls.attachMedia(video);
        video.querySelector("source").setAttribute("type", videoMetadata.HLS_codec);
        //For HLS container
        hls.on(Hls.Events.LEVEL_LOADED, function () {
            loadedMetadata();
        });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.querySelector("source").setAttribute("src", videoMetadata.HLS_src);
        video.querySelector("source").setAttribute("type", videoMetadata.HLS_codec);
        video.load();
        video.addEventListener("durationchange", updatetime);
    } else {
        video.querySelector("source").setAttribute("src", videoMetadata.Fallback_src);
        video.querySelector("source").setAttribute("type", videoMetadata.Fallback_codec);
        video.load();
        //For MP4 container
        video.addEventListener("durationchange", updatetime);
    };*/

    video.querySelector("source").setAttribute("src", videoMetadata.Fallback_src);
    video.querySelector("source").setAttribute("type", videoMetadata.Fallback_codec);

    video.load();

    video.addEventListener("durationchange", updatetime);

    eqContainer.querySelectorAll(".eq-slider").forEach(element => {
        element.disabled = true;
        element.value = 0;
    });

    if (!("pictureInPictureEnabled" in document)) {
        pipPlayerButton.classList.add("unsupported");
        pipTooltip.dataset.tooltip = "Picture in picture is unavailable";
    };
    if (!canFullscreen) {
        fullscreenButton.classList.add("unsupported");
        fullscreenTooltip.dataset.tooltip = "Full screen is unavailable";
    };

    //Disable features for mobile users
    let isMobile = /Mobi/.test(window.navigator.userAgent);
    if (isMobile) {
        volumeTooltipContainer.classList.add("hidden");
    };
});

//Range slider track
function handleInputChange(e) {
    let target = e.target;
    if (e.target.type !== "range") {
        target = rangeEQControl;
    };
    const min = target.min;
    const max = target.max;
    const val = target.value;

    target.style.backgroundSize = (val - min) * 100 / (max - min) + "% 100%";
};

//Context menu
function showContextMenu(show = true) {
    show ? contextMenu.classList.add("show") : contextMenu.classList.remove("show");
};

videoContainer.addEventListener("contextmenu", e => {
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target) && !transcriptPanel.contains(e.target)) {
        settingsButton.classList.remove("pressed");
        settingsContextMenu.classList.remove("pressed");
        settingsTooltipContainer.classList.add("tooltip-right");
        closedDialog();
    };

    const { clientX: mouseX, clientY: mouseY } = e;

    if (contextMenu.classList.contains("show")) {
        showContextMenu(false);
    } else {
        e.preventDefault();
        const { normalizedX, normalizedY } = ctxmenuPosition(mouseX, mouseY);
        contextMenu.style.top = `${normalizedY}px`;
        contextMenu.style.left = `${normalizedX}px`;
        showContextMenu();
    };
});

function ctxmenuPosition(mouseX, mouseY) {
    const scope = document.querySelector("body");
    let { left: scopeOffsetX, top: scopeOffsetY, } = scope.getBoundingClientRect();

    scopeOffsetX = scopeOffsetX < 0 ? 0 : scopeOffsetX;
    scopeOffsetY = scopeOffsetY < 0 ? 0 : scopeOffsetY;

    const scopeX = mouseX - scopeOffsetX;
    const scopeY = mouseY - scopeOffsetY;

    let normalizedX = mouseX;
    let normalizedY = mouseY;

    if (scopeX + contextMenu.clientWidth > scope.clientWidth) {
        normalizedX = scopeOffsetX + scope.clientWidth - contextMenu.clientWidth;
    }

    if (scopeY + contextMenu.clientHeight > scope.clientHeight) {
        normalizedY = scopeOffsetY + scope.clientHeight - contextMenu.clientHeight;
    }

    return { normalizedX, normalizedY };
};

function closeSettingsMenu(e) {
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target)) {
        settingsButton.classList.remove("pressed");
        settingsContextMenu.classList.remove("pressed");
        settingsTooltipContainer.classList.add("tooltip-right");
        closedDialog();
    };
};

document.addEventListener("click", e => {
    volumeContainer.classList.remove("scrubbing");
    showContextMenu(false);
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target) && !transcriptPanel.contains(e.target)) {
        settingsButton.classList.remove("pressed");
        settingsContextMenu.classList.remove("pressed");
        settingsTooltipContainer.classList.add("tooltip-right");
    };
});

Item.addEventListener("click", () => {
    showContextMenu(false);
    settingsButton.classList.remove("pressed");
    settingsContextMenu.classList.remove("pressed");
    settingsTooltipContainer.classList.add("tooltip-right");
});

downloadItem.addEventListener("click", () => {
    window.open(videoMetadata.Fallback_src);
    settingsButton.classList.remove("pressed");
    settingsContextMenu.classList.remove("pressed");
    settingsTooltipContainer.classList.add("tooltip-right");
});

settingsButton.addEventListener("click", () => {
    settingsButton.classList.toggle("pressed");
    settingsContextMenu.classList.toggle("pressed");
    settingsTooltipContainer.classList.toggle("tooltip-right");
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
    eqItem.classList.add("unsupported");
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
eqItem.addEventListener("click", () => eqContainer.classList.add("opened"));

EQswitchToggle.addEventListener("click", () => {
    if (eqContainer.classList.contains("enabled")) {
        eqContainer.classList.remove("enabled")
        eqContainer.querySelectorAll(".eq-slider").forEach(element => {
            element.disabled = true;
            sourceNode.disconnect();
            sourceNode.connect(context.destination);
            filters[filters.length - 1].disconnect();
        });
    } else {
        eqContainer.classList.add("enabled");
        eqContainer.querySelectorAll(".eq-slider").forEach(element => {
            element.disabled = false;
            rangeEQControl.forEach(input => {
                input.addEventListener("input", handleInputChange);
            });
            sourceNode.disconnect();
            sourceNode.connect(filters[0]);
            filters[filters.length - 1].connect(context.destination);
        });
    };
});

//Dialog
function closedDialog() {
    if (eqContainer.classList.contains("opened")) {
        eqContainer.classList.remove("opened");
    } else {
        return;
    };
};

dialogOverlay.addEventListener("click", closedDialog);
closeDialog.addEventListener("click", closedDialog);

//Transcript Panel
transcriptItem.addEventListener("click", () => {
    loadTranscript(document.getElementById("default-track").getAttribute("srclang"))
    videoPlayer.classList.add("transcript-opened");
});

closeTranscriptPanel.addEventListener("pointerover", () => {
    videoContainer.classList.add("hovered");
    video.classList.remove("inactive");
    closeTranscriptPanel.addEventListener("pointerleave", () => {
        videoContainer.classList.remove("hovered");
        video.classList.add("inactive");
    });
});

closeTranscriptPanel.addEventListener("click", () => {
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
    document.querySelector(".transcript-language").textContent = video.querySelector("track").getAttribute("label")
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
    trackElem.addEventListener("load", function () {
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
                transcriptText += voices[j].voice + ": " + removeHTML(voices[j].text);
            };
        } else {
            transcriptText = cue.text;
        };
        var clickableTranscriptText = `<div class="cue-container" id="${cue.startTime}" onclick="jumpToTranscript(${cue.startTime});"> <span class="cue-time">${formatDuration(cue.startTime)}</span> <span class="cues">${transcriptText}</span> </div>`;
        addToTranscript(clickableTranscriptText);
    };
};

function getVoices(speech) {
    var voices = [];
    var pos = speech.indexOf("<v");
    while (pos != -1) {
        endVoice = speech.indexOf(">");
        var voice = speech.substring(pos + 2, endVoice).trim();
        var endSpeech = speech.indexOf("</v>");
        var text = speech.substring(endVoice + 1, endSpeech);
        voices.push({
            "voice": voice,
            "text": text
        });
        speech = speech.substring(endSpeech + 4);
        pos = speech.indexOf("<v");
    };
    return voices;
};

function removeHTML(text) {
    var div = document.createElement("div");
    div.innerHTML = text;
    return div.textContent || div.innerText || "";
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
    cue.addEventListener('enter', function () {
        var transcriptText = document.getElementById(this.startTime);
        transcriptText.classList.add("current");
        transcriptText.parentNode.scrollTop = transcriptText.offsetTop - transcriptText.parentNode.offsetTop;
    });
    cue.addEventListener('exit', function () {
        var transcriptText = document.getElementById(this.startTime);
        transcriptText.classList.remove("current");
    });
};

transcriptPanel.addEventListener("click", e => {
    volumeContainer.classList.remove("scrubbing");
    showContextMenu(show = false);
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target) && !transcriptPanel.contains(e.target)) {
        settingsButton.classList.remove("pressed");
        settingsContextMenu.classList.remove("pressed");
        settingsTooltipContainer.classList.add("tooltip-right");
    };
});

transcriptPanel.addEventListener("contextmenu", e => closeSettingsMenu(e));

transcriptPanel.addEventListener("click", e => closeSettingsMenu(e));

//Keyboard shortcuts
videoPlayer.addEventListener("keydown", e => {
    const tagName = document.activeElement.tagName.toLowerCase();

    if (tagName === "input") return;
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
            case "":
                if (tagName === "button") break;
            case "0":
                videoContainer.classList.add("hovered");
                activity();
                skipPercent(0);
                break;
            case "1":
                videoContainer.classList.add("hovered");
                activity();
                skipPercent(0.1);
                break;
            case "2":
                videoContainer.classList.add("hovered");
                activity();
                skipPercent(0.2);
                break;
            case "3":
                videoContainer.classList.add("hovered");
                activity();
                skipPercent(0.3);
                break;
            case "4":
                videoContainer.classList.add("hovered");
                activity();
                skipPercent(0.4);
                break;
            case "5":
                videoContainer.classList.add("hovered");
                activity();
                skipPercent(0.5);
                break;
            case "6":
                videoContainer.classList.add("hovered");
                activity();
                skipPercent(0.6);
                break;
            case "7":
                videoContainer.classList.add("hovered");
                activity();
                skipPercent(0.7);
                break;
            case "8":
                videoContainer.classList.add("hovered");
                activity();
                skipPercent(0.8);
                break;
            case "9":
                videoContainer.classList.add("hovered");
                activity();
                skipPercent(0.9);
                break;
            case "k": case " ":
                videoContainer.classList.add("hovered");
                activity();
                togglePlay();
                break;
            case "f":
                videoContainer.classList.add("hovered");
                if (fullscreenButton.classList.contains("unsupported")) {
                    break;
                };
                activity();
                toggleFullScreen();
                break;
            case "c":
                videoContainer.classList.add("hovered");
                activity();
                toggleCaptions();
                break;
            case "i":
                videoContainer.classList.add("hovered");
                if (pipPlayerButton.classList.contains("unsupported")) { break; };
                activity();
                togglePIPPlayerMode();
                break;
            case "m":
                videoContainer.classList.add("hovered");
                activity();
                toggleVolume();
                break;
            case "arrowleft":
                videoContainer.classList.add("hovered");
                activity();
                skip(-5);
                break;
            case "j":
                videoContainer.classList.add("hovered");
                activity();
                skip(-10);
                break;
            case "arrowright":
                videoContainer.classList.add("hovered");
                activity();
                skip(5);
                break;
            case "l":
                videoContainer.classList.add("hovered");
                activity();
                skip(10);
                break;
            case ",":
                videoContainer.classList.add("hovered");
                activity();
                frameSeeking(`-${videoMetadata.video_FPS}`);
                break;
            case ".":
                videoContainer.classList.add("hovered");
                activity();
                frameSeeking(videoMetadata.video_FPS);
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

loopItem.addEventListener("click", loopVideo);

//Skip time
function skip(duration) {
    video.currentTime += duration;
    const percent = video.currentTime / video.duration;
    timelineInner.style.setProperty("--progress-position", percent);
};

function skipPercent(number) {
    video.currentTime = video.duration * number;
    const percent = video.currentTime / video.duration;
    timelineInner.style.setProperty("--progress-position", percent);
};

function frameSeeking(fps) {
    video.currentTime += 1 / fps;
    console.log(video.currentTime)
    const percent = video.currentTime / video.duration;
    timelineInner.style.setProperty("--progress-position", percent);
};

//Time divider animation
function spinnerDivider() {
    const spinners = ["/", "–", "\\", "|"];
    let index = 0;
    var interval = setInterval(() => {
        if (videoContainer.classList.contains("paused") && video.paused) clearInterval(interval);
        let line = spinners[index];
        if (line == undefined) {
            index = 0;
            line = spinners[index];
        };
        index = index > spinners.length ? 0 : index + 1;
        document.querySelector(".divider-time").textContent = `${line}`;
    }, 600);
};

//Activity check
let timeout = null;
function activity() {
    clearTimeout(timeout);
    currentTime.textContent = formatDuration(video.currentTime);
    video.classList.remove("inactive");
    videoControlsContainer.classList.remove("inactive");
    videoContainer.classList.add("hovered");
    if (videoContainer.classList.contains("hovered")) {
        if (video.paused) {
            return;
        } else if (!video.paused) {
            timeout = setTimeout(function () {
                videoContainer.classList.remove("hovered");
                videoControlsContainer.classList.add("inactive");
                video.classList.add("inactive");
            }, 3000);
        };
    };
};

//Full screen and picture-in-picture
fullscreenButton.addEventListener("click", toggleFullScreen);

function toggleFullScreen() {
    if (document.fullscreenElement == null) {
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        } else {
            if (videoPlayer.webkitRequestFullScreen) videoPlayer.webkitRequestFullScreen();
            if (videoPlayer.mozRequestFullScreen) videoPlayer.mozRequestFullScreen();
            if (videoPlayer.msRequestFullScreen) videoPlayer.msRequestFullscreen();
        }
        fullscreenTooltip.dataset.tooltip = "Exit full screen" + " (f)";
    } else {
        if (document.mozFullScreenElement || document.webkitIsFullScreen || document.msRequestFullscreen || document.requestFullscreen) {
            if (document.requestFullscreen) document.exitFullscreen();
            if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
            if (document.mozCancelFullScreen) document.mozCancelFullScreen();
            if (document.msRequestFullscreen) document.msExitFullscreen();
            fullscreenTooltip.dataset.tooltip = "Full screen" + " (f)";
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
    videoPlayer.classList.toggle("full-screen", document.fullscreenElement);
};

document.addEventListener("fullscreenchange", fullScreenToggleChange);
document.addEventListener("mozfullscreenchange", fullScreenToggleChange);
document.addEventListener("webkitfullscreenchange", fullScreenToggleChange);
document.addEventListener("msfullscreenchange", fullScreenToggleChange);

function togglePIPClass() {
    if (videoContainer.classList.contains("pip-player")) {
        videoContainer.classList.remove("pip-player");
        fullscreenTooltip.dataset.tooltip = "Full screen" + " (f)";
        if (!video.paused)
            video.play();
    } else {
        videoContainer.classList.add("pip-player");
        fullscreenTooltip.dataset.tooltip = "Full screen is unavailable";
    };
};

video.addEventListener("enterpictureinpicture", togglePIPClass);
video.addEventListener("leavepictureinpicture", togglePIPClass);

pipPlayerButton.addEventListener("click", togglePIPPlayerMode);

//Volume control
let isVolumeScrubbing = false;
volumeSliderContainer.addEventListener("pointerdown", e => {
    volumeSliderContainer.setPointerCapture(e.pointerId);
    if (e.button === 0)
        volumeSliderContainer.addEventListener("pointermove", e => {
            volumeUpdate(e);
            handleVolumeUpdate(e);
            volumeSliderContainer.addEventListener("pointerup", e => {
                volumeSliderContainer.releasePointerCapture(e.pointerId);
                volumeUpdate(e);
            });
        });
});

function volumeUpdate(e) {
    const rect = volumeSliderContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    isVolumeScrubbing = (e.buttons && 1) === 1;
    volumeContainer.classList.toggle("scrubbing", isVolumeScrubbing);
    if (isVolumeScrubbing) {
        video.volume = percent;
        video.muted = percent === 0;
        volumeSliderContainer.style.setProperty("--volume-position", percent);
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
        volumeSliderContainer.style.setProperty("--volume-position", percent);
    };
};

volumeButton.addEventListener("click", toggleVolume);

function toggleVolume() {
    video.muted = !video.muted;
    if (video.muted) {
        volumeTooltipContainer.dataset.tooltip = "Unmute" + " (m)";
    } else {
        volumeTooltipContainer.dataset.tooltip = "Mute" + " (m)";
    };
};

//Timeline
function clamp(input = 0, min = 0, max = 255) {
    return Math.min(Math.max(input, min), max);
};
function seekingPreviewPosition(e) {
    /*var rect = e.target.getBoundingClientRect();
    var eventX = e.clientX - rect.left;
    seekingPreview.style.setProperty("--thumbnail-seek-position", eventX < seekingPreview.clientWidth ? seekingPreview.offsetLeft + "px" : eventX + seekingPreview.offsetLeft > videoContainer.clientWidth ? seekingPreview.offsetLeft + "px" : e.x + "px");*/

    /*const seek = seekingPreview.getBoundingClientRect();
    var rect = e.target.getBoundingClientRect();
    var eventX = e.clientX - rect.left;
    seekingPreview.style.setProperty("--thumbnail-seek-position", eventX + seek.left < videoContainer.offsetWidth + 48 ? seekingPreview.offsetLeft + "px" : eventX + seek.width > videoContainer.offsetWidth ? seekingPreview.offsetLeft + "px" : e.x + "px");*/

    /*const scrubberRect = timelineInner.getBoundingClientRect();
    const containerRect = videoPlayer.getBoundingClientRect();

    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;

    const min = containerRect.left + seekingPreview.clientWidth - 10;
    const max = containerRect.right - seekingPreview.clientWidth + 10;


    const position = x - (containerRect.left / containerRect.right) - seekingPreview.clientWidth / 4 - 8;
    const clamped = clamp(position, min, max);

    seekingPreview.style.setProperty("--thumbnail-seek-position", `${clamped}px`);*/

    let percent = 0;
    const clientRect = timelineInner.getBoundingClientRect();
    if (e.target) {
        percent = (100 / clientRect.width) * (e.clientX - clientRect.left);
    } else if (seekingPreview.classList.contains("hovered")) {
        percent = parseFloat(seekingPreview.style.left, 10);
    } else {
        return;
    };

    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    const seekRect = seekingPreview.getBoundingClientRect();

    seekingPreview.style.setProperty("--thumbnail-seek-position", `calc(${percent}% - ${(seekRect.width * (percent / 100)) / 2 + (40 * (1 - percent / 100))}px + ${(seekRect.width * (1 - percent / 100)) / 2 - (40 * (percent / 100))}px + ${(40 * 2) * (1 - percent / 100)}px)`);
};

timelineInner.addEventListener("pointermove", e => {
    timelineInner.setPointerCapture(e.pointerId);
    seekingPreview.classList.add("hovered");
    handleTimelineUpdate(e);
    if (isScrubbing) {
        videoControls.classList.add("hidden");
    };
    timelineInner.addEventListener("pointerleave", () => {
        seekingPreview.classList.remove("hovered");
        videoControls.classList.remove("hidden");
    }, { once: true });
});

timelineInner.addEventListener("pointerdown", e => {
    if (e.button === 0) toggleScrubbing(e);
    timelineInner.addEventListener("pointerup", e => {
        timelineInner.releasePointerCapture(e.pointerId);
        if (isScrubbing) {
            toggleScrubbing(e);
        };
    });
});

let isScrubbing = false;
let wasPaused;
function toggleScrubbing(e) {
    const rect = timelineInner.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    isScrubbing = (e.buttons & 1) === 1;
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

function handleTimelineUpdate(e) {
    const rect = timelineInner.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    var thumbPosition = Math.floor(percent * video.duration) / Math.floor(video.duration) * 100
    seekingThumbnail.style.backgroundPositionY = `${thumbPosition}%`;

    seekingPreviewPosition(e)
    let seekTime = percent * video.duration;
    timelineInner.style.setProperty("--preview-position", percent);
    cuetimeTooltip.textContent = formatDuration(seekTime);

    if (seekTime < 0) seekTime = 0;

    if (seekTime > video.duration - 1) seekTime = video.duration - 1;

    if (isScrubbing) {
        e.preventDefault();
        videoThumbPreview.style.backgroundPositionY = `${thumbPosition}%`;
        timelineInner.style.setProperty("--progress-position", percent);
        cuetimeTooltip.textContent = formatDuration(seekTime);
        currentTime.textContent = formatDuration(seekTime);
    };
};

//Load and update data
function loadedMetadata() {
    totalTime.textContent = formatDuration(video.duration);
    currentTime.textContent = formatDuration(video.currentTime);
    video.width = videoMetadata.video_Viewport;
    video.height = videoMetadata.video_Viewport / (video.videoWidth / video.videoHeight);
};

async function updatetime() {
    const percent = video.currentTime / video.duration;
    if (!video.paused) {
        timelineInner.style.setProperty("--buffered-position", (1 / video.duration) * video.buffered.end(0));
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

//Playback and Media Session
playpauseButton.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);

var title = document.querySelector("meta[property=\"og:title\"]").getAttribute("content");
var author = document.querySelector("meta[property=\"og:author\"]").getAttribute("content");

function updatePositionState() {
    navigator.mediaSession.setPositionState({
        duration: video.duration,
        playbackRate: video.playbackRate,
        position: video.currentTime,
    });
};

async function mediaSessionToggle() {
    try {
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: title,
                artist: author,
                artwork: [
                    { src: `${mediaSessionMetadata.thumb_96}`, sizes: "96x96", type: mediaSessionMetadata.type, },
                    { src: `${mediaSessionMetadata.thumb_128}`, sizes: "128x128", type: mediaSessionMetadata.type, },
                    { src: `${mediaSessionMetadata.thumb_192}`, sizes: "192x192", type: mediaSessionMetadata.type, },
                    { src: `${mediaSessionMetadata.thumb_256}`, sizes: "256x256", type: mediaSessionMetadata.type, },
                    { src: `${mediaSessionMetadata.thumb_384}`, sizes: "384x384", type: mediaSessionMetadata.type, },
                    { src: `${mediaSessionMetadata.thumb_512}`, sizes: "512x512", type: mediaSessionMetadata.type, },
                ],
            });
        };
    } catch (error) {
        console.error(error);
    };

    const actionHandlers = [
        ["play", async function () { await video.play(); }],
        ["pause", async function () { await video.pause(); }],
        ["stop", function () {
            if (!video.paused) video.pause();
            video.currentTime = 0;
        }],
        ["seekbackward", (d) => {
            video.currentTime -= d.seekOffset || 10;
            const percent = video.currentTime / video.duration;
            timelineInner.style.setProperty("--progress-position", percent);
            currentTime.textContent = formatDuration(video.currentTime);
        }],
        ["seekforward", (d) => {
            video.currentTime += d.seekOffset || 10;
            const percent = video.currentTime / video.duration;
            timelineInner.style.setProperty("--progress-position", percent);
            currentTime.textContent = formatDuration(video.currentTime);
        }],
        ["seekto", (d) => {
            if (d.fastSeek && "fastSeek" in video) {
                video.fastSeek(d.seekTime);
                return;
            };
            video.currentTime = d.seekTime;
        }],
    ];

    for (const [action, handler] of actionHandlers) {
        try {
            navigator.mediaSession.setActionHandler(action, handler);
            updatePositionState();
        } catch (error) {
            console.log(`The media session action "${action}" is unavailable.`);
        };
    };
};

function togglePlay() {
    if (video.currentTime === video.duration && video.paused) {
        if (contextMenu.classList.contains("show")) {
            return;
        } if (settingsContextMenu.classList.contains("pressed")) {
            return;
        };
        videoContainer.classList.remove("ended");
        video.currentTime = 0;
    };
    if (context.state === "suspended") {
        context.resume();
    };
    video.paused ? video.play() : video.pause();
};

const eventListeners = [
    ["play", () => {
        navigator.mediaSession.playbackState = "playing";
        playpauseTooltipContainer.dataset.tooltip = "Play" + " (k)";

        mediaSessionToggle();
        videoPoster.classList.add("played");
        spinnerDivider();
        if (Hls.isSupported() && video.currentTime === 0)
            hls.startLoad();
        videoContainer.addEventListener("pointerover", activity);
        videoContainer.addEventListener("pointermove", activity);
        videoContainer.addEventListener("pointerleave", () => {
            videoContainer.classList.remove("hovered");
            video.classList.add("inactive");
        });
        videoContainer.classList.remove("paused");
    }],
    ["pause", () => {
        navigator.mediaSession.playbackState = "paused";
        playpauseTooltipContainer.dataset.tooltip = "Pause" + " (k)";

        video.classList.remove("inactive");
        clearTimeout(timeout);
        videoContainer.classList.add("paused");
    }],
    ["ended", () => {
        videoContainer.classList.add("ended");
    }],
    ["progress", () => {
        if (video.buffered.length > 0) timelineInner.style.setProperty("--buffered-position", (1 / video.duration) * video.buffered.end(0));
    }],
    ["canplay", () => {
        if (video.buffered.length > 0) timelineInner.style.setProperty("--buffered-position", (1 / video.duration) * video.buffered.end(0));
    }],
    ["waiting", () => {
        videoContainer.classList.add("buffering");
    }],
    ["playing", () => {
        videoContainer.classList.remove("buffering");
    }],
    ["seeked", () => {
        videoPoster.classList.add("played");
        videoContainer.classList.remove("scrubbing");
        seekingPreview.classList.remove("loading");
        updatetime();
        currentTime.textContent = formatDuration(video.currentTime);
    }],
    ["timeupdate", () => {
        if (videoContainer.classList.contains("hovered")) {
            updatetime();
            currentTime.textContent = formatDuration(video.currentTime);
        } else {
            return;
        };

        if (video.currentTime === video.duration) {
            videoContainer.classList.add("ended");
        } else {
            videoContainer.classList.remove("ended");
        };
    }],
    ["loadedmetadata", () => {
        videoPlayer.classList.remove("loading");
        seekingThumbnail.style.backgroundImage = `url("${videoMetadata.video_thumbs}")`;
        videoThumbPreview.style.backgroundImage = `url("${videoMetadata.video_thumbs}")`;

        videoPlayer.style.setProperty("--aspect-ratio-size", video.videoWidth / video.videoHeight);
        videoPlayer.style.setProperty("--aspect-ratio-size-inverse", video.videoHeight / video.videoWidth);
        loadedMetadata();
    }],
    ["volumechange", () => {
        let volumeLevel;
        if (video.muted || video.volume === 0) {
            volumeLevel = "mute";
            volumeTooltipContainer.dataset.tooltip = "Unmute" + " (m)";
        } else if (video.volume >= 0.6) {
            volumeLevel = "full";
        } else if (video.volume >= 0.3) {
            volumeLevel = "mid";
        } else {
            volumeLevel = "low";
            volumeTooltipContainer.dataset.tooltip = "Mute" + " (m)";
        };
        videoContainer.dataset.volumeLevel = volumeLevel;
    }],
];

for (const [action, event] of eventListeners) {
    try {
        video.addEventListener(action, event);
    } catch (error) {
        console.log(`The video event listener action "${action}" is unavailable.`);
    };
};