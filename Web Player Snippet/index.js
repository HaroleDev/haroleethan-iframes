"use strict";
const videoMetadata = {
    video_thumbs: "//res.cloudinary.com/harole/image/upload/s--3AQUSV56--/q_auto:low/v1659426432/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_THUMBNAILS_shmsny.jpg",
    video_poster: "//res.cloudinary.com/harole/video/upload/s--p6nXm3qO--/c_fill,h_720,q_auto:low,w_1280/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    HLS_src: "//res.cloudinary.com/harole/video/upload/s--w9SNLopB--/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.m3u8",
    HLS_codec: "application/x-mpegURL",
    Fallback_src: "./TimeScapes Trailer 4K Demo.mp4",
    Fallback_codec: "video/mp4",
    video_FPS: "59.940",
},
    mediaSessionMetadata = {
        thumb_512: "//res.cloudinary.com/harole/video/upload/s--Vjfp8q3F--/c_fill,h_512,q_auto:eco,w_512/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
        thumb_384: "//res.cloudinary.com/harole/video/upload/s--GSclQ4pU--/c_fill,h_384,q_auto:eco,w_384/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
        thumb_256: "//res.cloudinary.com/harole/video/upload/s--Il1IjHMZ--/c_fill,h_256,q_auto:eco,w_256/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
        thumb_192: "//res.cloudinary.com/harole/video/upload/s--XGk0fUrZ--/c_fill,h_192,q_auto:eco,w_192/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
        thumb_128: "//res.cloudinary.com/harole/video/upload/s--G8UlljUd--/c_fill,h_128,q_auto:eco,w_128/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
        thumb_96: "//res.cloudinary.com/harole/video/upload/s--d8U6mcP6--/c_fill,h_96,q_auto:eco,w_96/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
        type: "image/jpeg",
    };

var config = {
    startPosition: -1,
};
var hls = new Hls(config);

const playpauseButton = document.querySelector(".play-pause-button"),
    playpauseTooltipContainer = document.querySelector(".play-pause-tooltip-container"),
    videoContainer = document.querySelector(".video-container"),
    videoPoster = document.querySelector(".video-poster"),
    video = document.querySelector(".video"),
    videoFit = document.querySelector(".video-fit-contain"),
    source = video.querySelector("source"),

    videoPlayerContainer = document.querySelector(".video-player-container"),
    videoPlayer = document.querySelector(".video-player"),

    currentTime = document.querySelector(".current-time"),
    totalTime = document.querySelector(".total-time"),
    durationContainer = document.querySelector(".duration-container"),
    timeTooltip = document.querySelector(".seeking-preview__time-tooltip"),

    EQswitchToggle = document.querySelector(".eq-switch"),
    rangeEQInputs = document.querySelectorAll(".dialog .eq-control input"),
    eqContainer = document.querySelector(".eq-dialog-container"),
    loopItem = document.querySelector(".loop-item"),
    eqItem = document.querySelector(".eq-item"),

    captionButton = document.querySelector(".caption-button"),

    settingsButton = document.querySelector(".settings-button"),
    settingsContextMenu = document.querySelector(".settings-context-menu"),
    settingsTooltipContainer = document.querySelector(".settings-tooltip-container"),
    contextMenu = document.querySelector(".video-context-menu"),
    downloadItem = document.querySelector(".download-item"),
    Item = document.querySelector(".item"),
    transcriptItem = document.querySelector(".transcript-item"),

    transcriptPanel = document.querySelector(".transcript-panel"),
    closeTranscriptPanelBtn = document.querySelector(".close-transcript-panel"),
    transcriptDiv = document.querySelector(".captions-contents"),
    snackbarSyncTranscript = document.querySelector(".snackbar-sync-time"),

    dialog = document.querySelector(".dialog"),
    closeDialogBtn = document.querySelector(".close-dialog"),
    dialogOverlay = document.querySelector(".dialog-overlay"),

    volumeSliderContainer = document.querySelector(".volume-slider-container"),
    volumeContainer = document.querySelector(".volume-container"),
    volumeButton = document.querySelector(".volume-button"),
    volumeTooltipContainer = document.querySelector(".volume-tooltip-container"),

    fullscreenButton = document.querySelector(".full-screen-button"),
    fullscreenTooltip = document.querySelector(".full-screen-tooltip"),
    pipPlayerButton = document.querySelector(".pip-button"),
    pipTooltip = document.querySelector(".pip-tooltip"),

    timelineContainer = document.querySelector(".timeline-container"),
    timelineInner = document.querySelector(".timeline"),

    videoInformationOverlay = document.querySelector(".video-information-overlay"),
    videoControlsContainer = document.querySelector(".video-controls-container"),
    videoControls = document.querySelector(".controls"),
    rightVideoControls = document.querySelector(".right-side"),

    seekingPreview = document.querySelector(".seeking-preview"),
    seekingThumbnail = document.querySelector(".seeking-preview__thumbnail"),
    videoThumbPreview = document.querySelector(".video-thumb-preview"),

    qualityBadgeContainer = document.querySelector(".quality-badge"),
    qualityBadgeText = document.querySelector(".quality-badge .quality"),
    streamingBadgeContainer = document.querySelector(".streaming-badge"),
    streamingBadgeText = document.querySelector(".streaming-badge .streaming"),

    AirPlayTooltip = document.querySelector(".airplay-tooltip"),
    AirPlayButton = document.querySelector(".airplay-button"),
    CastButton = document.querySelector(".gcast-button"),
    CastTooltip = document.querySelector(".gcast-tooltip");

var orientationInfluence;

var title = document.querySelector("meta[property=\"og:title\"]").getAttribute("content") || decodeURIComponent(videoMetadata.Fallback_src.substring(videoMetadata.Fallback_src.lastIndexOf("/") + 1)),
    author = document.querySelector("meta[property=\"og:author\"]").getAttribute("content"),
    description = document.querySelector("meta[property=\"og:description\"]").getAttribute("content");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="#02da9a" viewBox="0 0 616 174"><path d="M290 .051a43 43 0 0 0-4.92.041c-3.75.245-7.43.979-11 2.17-4.44 1.5-5.82 6.79-3.47 10.8 2.34 4.06 7.56 5.29 12.2 4.37 1.12-.223 2.26-.372 3.4-.447a26 26 0 0 1 11.7 1.93c3.69 1.53 6.97 3.88 9.6 6.88a25.75 25.75 0 0 1 2.08 2.72c2.61 3.9 7.16 6.72 11.7 5.5s7.29-5.93 5.21-10.1a43.06 43.06 0 0 0-6.21-9.29c-4.35-4.96-9.78-8.85-15.9-11.4a43 43 0 0 0-14.3-3.22zM7 19.851c-3.27-.257-6.49 2.26-6.49 5.99v62.2c0 4.98 5.72 7.79 9.66 4.75l40.4-31.1c3.12-2.4 3.12-7.11 0-9.51l-40.4-31.1A5.96 5.96 0 0 0 7 19.841zm382 9.41v62c-3.07-5.63-7.42-9.86-13.1-12.7-5.63-2.94-12-4.42-19-4.42-9.34 0-17.4 2.18-24.2 6.53-6.79 4.22-12 10.1-15.6 17.7-3.59 7.55-5.38 16.1-5.38 25.7 0 9.73 1.79 18.3 5.38 25.7 3.59 7.3 8.64 13.1 15.2 17.3 6.66 4.22 14.5 6.34 23.6 6.34 7.3 0 13.9-1.6 19.8-4.8 6.02-3.33 10.6-8.06 13.6-14.2l1.34 16.5h17.7v-142h-19.4zm-281 .695c-14.9 0-27 12.1-27 27s12.1 27 27 27 27-12.1 27-27-12.1-27-27-27zm181 .455c-3.46 0-6.46 1.22-9.02 3.65-2.43 2.43-3.65 5.38-3.65 8.83s1.22 6.4 3.65 8.83c2.56 2.43 5.57 3.65 9.02 3.65 3.33 0 6.21-1.22 8.64-3.65s3.65-5.38 3.65-8.83-1.22-6.4-3.65-8.83-5.31-3.65-8.64-3.65zm176 43.8c-9.09 0-17.2 2.11-24.2 6.34-6.91 4.22-12.4 10-16.3 17.5-3.84 7.42-5.76 16.1-5.76 25.9 0 9.73 1.98 18.3 5.95 25.7 4.1 7.42 9.66 13.2 16.7 17.5 7.17 4.22 15.4 6.34 24.6 6.34 11.8 0 21.5-2.82 29.2-8.45s12.6-13.5 14.8-23.6h-18c-1.41 5.12-4.36 9.09-8.83 11.9-4.36 2.69-9.98 4.03-16.9 4.03-9.34 0-16.5-2.94-21.5-8.83-4.24-5-6.68-11.9-7.32-20.6l72.4-.172v-6.72c0-9.47-1.86-17.7-5.57-24.8-3.58-7.04-8.77-12.5-15.6-16.3-6.66-3.84-14.5-5.76-23.6-5.76zm102 0c-9.47 0-18 2.11-25.5 6.34-7.43 4.22-13.3 10-17.7 17.5-4.22 7.42-6.34 16-6.34 25.7s2.11 18.3 6.34 25.7c4.35 7.42 10.2 13.2 17.7 17.5 7.55 4.22 16.1 6.34 25.5 6.34s17.9-2.11 25.3-6.34 13.2-10 17.5-17.5 6.34-16 6.34-25.7-2.11-18.3-6.34-25.7c-4.22-7.42-10-13.2-17.5-17.5s-15.9-6.34-25.3-6.34zm-393 2.69l37.8 94.1H231l39.4-94.1h-20.2l-20.2 50.1-2.88 7.94-1.72 4.93c-1.41 3.97-2.56 7.49-3.46 10.6-.64-2.82-1.66-6.21-3.07-10.2-1.28-4.1-2.82-8.51-4.61-13.2l-19.4-50.1h-20.9zm105 0v94.1h19.2v-94.1H279zm186 13.4c7.68 0 13.8 2.3 18.4 6.91 4.61 4.48 6.91 10.4 6.91 17.9h-52.8c.528-3.55 1.43-6.75 2.7-9.6 2.3-4.99 5.5-8.77 9.6-11.3 4.23-2.56 9.28-3.84 15.2-3.84zm-105 1.15c6.02 0 11.1 1.41 15.4 4.22 4.35 2.69 7.68 6.46 9.98 11.3 2.3 4.74 3.46 10.2 3.46 16.5s-1.15 11.8-3.46 16.7-5.63 8.71-9.98 11.5c-4.23 2.69-9.35 4.03-15.4 4.03s-11.2-1.34-15.6-4.03c-4.22-2.82-7.49-6.66-9.79-11.5-2.18-4.86-3.26-10.4-3.26-16.7 0-6.14 1.09-11.6 3.26-16.3 2.3-4.86 5.57-8.7 9.79-11.5 4.35-2.82 9.54-4.22 15.6-4.22zm207 .191c5.89 0 11 1.35 15.4 4.03 4.48 2.69 8 6.46 10.6 11.3 2.56 4.74 3.84 10.3 3.84 16.7 0 6.27-1.28 11.8-3.84 16.7s-6.08 8.7-10.6 11.5c-4.35 2.69-9.47 4.03-15.4 4.03s-11.1-1.34-15.6-4.03c-4.48-2.82-8-6.66-10.6-11.5-2.56-4.86-3.84-10.4-3.84-16.7 0-6.4 1.28-12 3.84-16.7 2.56-4.86 6.08-8.64 10.6-11.3s9.66-4.03 15.6-4.03zm-449 15a10.85 10.85 0 0 0-2.2.123c-5.94.94-9.81 6.6-10.7 12.5-.567 3.69-1.72 7.29-3.43 10.7-3.38 6.63-8.77 12-15.4 15.4a35.2 35.2 0 0 1-32.1-.08c-5.34-2.76-12.2-2.95-16.5 1.3h-.002c-4.25 4.25-4.29 11.2.689 14.6a57 57 0 0 0 23 9.08c11.9 1.88 24.1-.047 34.8-5.51a57 57 0 0 0 31.08-48.8c.178-5.26-4.16-9.04-9.22-9.27z"/></svg>`;

function init() {
    document.body.classList.remove("preload");
    if (video.hasAttribute("controls")) {
        videoControlsContainer.removeAttribute("hidden");
        videoInformationOverlay.removeAttribute("hidden");
        video.removeAttribute("controls");
    } else {
        videoControlsContainer.setAttribute("hidden", "");
        videoInformationOverlay.setAttribute("hidden", "");
        video.removeAttribute("controls");
    };
    console.log("%cPlayful Video%c\nRolling Progress Release", `background-image: url(data:image/svg+xml;base64,${btoa(svg)});
    display: inline-block;
    padding: 2rem 12rem;
    padding-right: 0px;
    margin: 20px;
    margin-left: 0px;
    margin-bottom: 8px;
    color: transparent;
    text-align: center;
    font-size: 0px;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    `, `font-family: Manrope, Arial, Helvetica, sans-serif;
    display: block;
    font-size: 1rem;
    line-height: 130%;
    margin: 4px 0px 16px 0px;
    font-weight: 400;
    font-kerning: normal;
    color: currentColor;`);
    console.log("%cThis is a browser feature intended for developers to debug the player. As this is a rolling release of a developing project, I'd encourage you to send a feedback to me once you discovered a bug not listed on the page (which you can by my Discord's username below).\n\nDiscord: %cHarole#1225\n%cWebsite (WIP): %chttps://preview.studio.site/live/4BqN8BM2Wr", `font-family: Inconsolata, monospace;
    font-size: 1rem;
    line-height: 130%;
    font-weight: 400;
    color: currentColor;
    `, `font-family: Inconsolata, monospace;
    font-size: 1rem;
    line-height: 100%;
    font-weight: 800;
    color: currentColor;
    border-bottom: 2px solid currentColor;
    `, `font-family: Inconsolata, monospace;
    font-size: 1rem;
    line-height: 130%;
    font-weight: 400;
    color: currentColor;
    `, `font-family: Inconsolata, monospace;
    font-size: 1rem;
    line-height: 100%;
    font-weight: 800;
    color: currentColor;
    `);
};

init();

function canFullscreen() {
    return void 0 !== document.body.requestFullscreen ||
        void 0 !== document.body.mozRequestFullScreen ||
        void 0 !== document.body.webkitRequestFullscreen ||
        void 0 !== document.body.webkitEnterFullscreen ||
        void 0 !== document.body.msRequestFullscreen ||
        void 0 !== document.body.exitFullscreen ||
        void 0 !== document.body.mozCancelFullScreen ||
        void 0 !== document.body.webkitExitFullscreen;
};

window.addEventListener("DOMContentLoaded", () => {
    videoPoster.src = videoMetadata.video_poster;
    videoPoster.decoding = "async";

    /*if (!Hls.isSupported()) {
        hls.loadSource(videoMetadata.HLS_src);
        hls.attachMedia(video);
        source.setAttribute("type", videoMetadata.HLS_codec);
        //For HLS container
        hls.on(Hls.Events.LEVEL_LOADED, function () {
            loadedMetadata();
        });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        source.setAttribute("src", videoMetadata.HLS_src);
        source.setAttribute("type", videoMetadata.HLS_codec);
        video.load();
        video.addEventListener("durationchange", updatetime);
    } else {
        source.setAttribute("src", videoMetadata.Fallback_src);
        source.setAttribute("type", videoMetadata.Fallback_codec);
        video.load();
        //For MP4 container
        video.addEventListener("durationchange", updatetime);
    };*/

    source.setAttribute("src", videoMetadata.Fallback_src);
    source.setAttribute("type", videoMetadata.Fallback_codec);

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
        volumeTooltipContainer.setAttribute("hidden", "");
    };
    if (navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
        videoPlayer.dataset.device = "iPadOS";
        volumeTooltipContainer.setAttribute("hidden", "");
    };
});

const srcEventListeners = [
    ["error", function () {
        let s = "";
        let err = source.error;

        switch (err.code) {
            case MediaError.MEDIA_ERR_ABORTED:
                s += "The user stopped loading the video.";
                break;
            case MediaError.MEDIA_ERR_NETWORK:
                s += "A network error occurred while fetching the video.";
                break;
            case MediaError.MEDIA_ERR_DECODE:
                s += "An error occurred while decoding the video.";
                break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                s += "The video is missing or is in a format not supported by your browser.";
                break;
            default:
                s += "An unknown error occurred.";
                break;
        };

        let message = err.message;

        if (message && message.length) s += message;

        document.getElementById("error-log").textContent = err.code;
        document.getElementsByClassName("error-dialog").classList.add("error-occurred");
    }],
];

for (const [action, event] of srcEventListeners) {
    try {
        source.addEventListener(action, event);
    } catch (error) {
        console.log(`The video event listener action "${action}" is unavailable.`);
    };
};

//Range slider track
function handleInputChange(e) {
    let target = e.target;
    if (e.target.type !== "range") {
        target = rangeEQInputs;
    };
    const min = target.min,
        max = target.max,
        val = target.value;

    target.style.backgroundSize = `${(val - min) * 100 / (max - min)}% 100%`;
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
        seekingPreview.removeAttribute("hidden");
        closedDialog();
    };

    if (contextMenu.classList.contains("show")) {
        showContextMenu(false);
    } else {
        e.preventDefault();
        const {
            x,
            y
        } = ctxmenuPosition(e);
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        showContextMenu();
    };
});

function ctxmenuPosition(eventPos) {
    let menuOffset = 8;
    const scope = document.querySelector(".video-player");
    let x = eventPos.offsetX + menuOffset,
        y = eventPos.offsetY + menuOffset,
        winWidth = scope.innerWidth,
        winHeight = scope.innerHeight,
        cmWidth = contextMenu.offsetWidth,
        cmHeight = contextMenu.offsetHeight;

    if (x + cmWidth > winWidth - 8) {
        x = eventPos.offsetX - cmWidth;
    }

    if (y + cmHeight > winHeight - 8) {
        y = winHeight - cmHeight - 8;
    }

    return {
        x,
        y
    };
};

function closeSettingsMenu(e) {
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target)) {
        settingsButton.classList.remove("pressed");
        settingsContextMenu.classList.remove("pressed");
        settingsTooltipContainer.classList.add("tooltip-right");
        seekingPreview.removeAttribute("hidden");
        closedDialog();
    };
};

document.addEventListener("click", e => {
    showContextMenu(false);
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target) && !transcriptPanel.contains(e.target)) {
        settingsButton.classList.remove("pressed");
        settingsContextMenu.classList.remove("pressed");
        settingsTooltipContainer.classList.add("tooltip-right");
        seekingPreview.removeAttribute("hidden");
    };
});

//Context menu items
eqItem.addEventListener("click", () => eqContainer.classList.add("opened"));
transcriptItem.addEventListener("click", () => {
    loadTranscript(document.getElementById("default-track").getAttribute("srclang"));
    videoPlayer.classList.add("transcript-opened");
});

//Settings
settingsButton.addEventListener("click", () => {
    settingsButton.classList.toggle("pressed");
    settingsContextMenu.classList.toggle("pressed");
    settingsTooltipContainer.classList.toggle("tooltip-right");
    if (settingsButton.classList.contains("pressed") && settingsContextMenu.classList.contains("pressed")) {
        seekingPreview.setAttribute("hidden", "");
    } else {
        seekingPreview.removeAttribute("hidden");
    };
});

//Settings items
downloadItem.addEventListener("click", () => {
    window.open(videoMetadata.Fallback_src, "_parent");
    settingsButton.classList.remove("pressed");
    settingsContextMenu.classList.remove("pressed");
    settingsTooltipContainer.classList.add("tooltip-right");
});

//AudioContext
var ctx = window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext;
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

/*function childElements(node) {
    var elems = new Array();
    var children = node.childNodes;

    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeType === document.ELEMENT_NODE) {
            elems.push(children[i]);
            return elems;
        };
    };
};*/

//EQ dialog
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
            rangeEQInputs.forEach(input => {
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
closeDialogBtn.addEventListener("click", closedDialog);

//Transcript Panel
closeTranscriptPanelBtn.addEventListener("pointerover", () => {
    videoContainer.classList.add("hovered");
    video.classList.remove("inactive");
    closeTranscriptPanelBtn.addEventListener("pointerleave", () => {
        videoContainer.classList.remove("hovered");
        video.classList.add("inactive");
    });
});

closeTranscriptPanelBtn.addEventListener("click", () => {
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
var tracks, trackElements, tracksURLs = [];

trackElements = document.querySelectorAll("track");
for (var i = 0; i < trackElements.length; i++) {
    var currentTrackElem = trackElements[i];
    tracksURLs[i] = currentTrackElem.src;
};
tracks = video.textTracks;

function loadTranscript(lang) {
    clearTranscriptDiv();
    disableAllTracks();
    document.querySelector(".transcript-language").textContent = video.querySelector("track").getAttribute("label");
    for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        var trackAsHtmlElement = trackElements[i];

        if ((track.language === lang) && (track.kind !== "chapters")) {
            videoContainer.classList.contains("caption") ? track.mode = "showing" : track.mode = "hidden";
            trackAsHtmlElement.readyState === 2 ? displayCues(track) : displayCuesAfterTrackLoaded(trackAsHtmlElement, track);
        };
    };
};

function displayCuesAfterTrackLoaded(trackElem, track) {
    trackElem.addEventListener("load", displayCues(track));
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
        var clickableTranscriptText = `<div class="cue-container" id="${cue.startTime}" role="button" aria-pressed="false" tabindex="0" onclick="jumpToTranscript(${cue.startTime});"> <div class="cue-time span">${formatDuration(cue.startTime)}</div> <div class="cues span">${transcriptText}</div> </div>`;
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
    div.textContent = text;
    return div.textContent || div.innerText || "";
};

function jumpToTranscript(time) {
    (video.currentTime = time), video.paused ? (video.pause(), timelineInner.style.setProperty("--progress-position", video.currentTime / video.duration)) :
        video.play();
};

function clearTranscriptDiv() {
    transcriptDiv.innerHTML = "";
};

function addToTranscript(htmlText) {
    transcriptDiv.innerHTML += htmlText;
};

function addCueListeners(cue) {
    cue.addEventListener("enter", function () {
        var transcriptText = document.getElementById(this.startTime);
        transcriptText.classList.add("current");
        transcriptText.parentNode.scrollTop = transcriptText.offsetTop - transcriptText.parentNode.offsetTop;
    });
    cue.addEventListener("exit", function () {
        var transcriptText = document.getElementById(this.startTime);
        transcriptText.classList.remove("current");
    });
};

transcriptDiv.addEventListener("keydown", e => {
    if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") toggleBtn(e.target);
});

function toggleBtn(e) {
    e.setAttribute("aria-pressed", e.getAttribute("aria-pressed") === "true" ? "false" : "true");
};

transcriptPanel.addEventListener("click", e => {
    showContextMenu(show = false);
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target) && !transcriptPanel.contains(e.target)) {
        settingsButton.classList.remove("pressed");
        settingsContextMenu.classList.remove("pressed");
        settingsTooltipContainer.classList.add("tooltip-right");
    };
});

transcriptPanel.addEventListener("contextmenu", e => closeSettingsMenu(e));
transcriptPanel.addEventListener("click", e => closeSettingsMenu(e));

//Loop function
function loopVideo() {
    if (!loopItem.classList.contains("enabled")) {
        video.loop = true;
        if (typeof video.loop == "boolean") {
            video.loop = true;
        } else {
            video.addEventListener("ended", function () {
                video.currentTime = 0;
                video.play();
            }, false);
        };
        loopItem.classList.add("enabled");
    } else {
        if (typeof video.loop == "boolean") {
            video.loop = false;
        } else {
            video.removeEventListener("ended", function () {
                video.currentTime = 0;
                video.play();
            }, false);
        };
        loopItem.classList.remove("enabled");
    };
};

function checkElement() {
    if (video.loop === true) {
        loopItem.classList.add("enabled");
    } else if (video.loop === false) {
        loopItem.classList.remove("enabled");
    } else {
        return;
    };

    if (video.hasAttribute("controls")) {
        videoControlsContainer.setAttribute("hidden", "");
        videoInformationOverlay.setAttribute("hidden", "");
        video.removeAttribute("controls");
    } else if (!video.hasAttribute("controls")) {
        videoControlsContainer.removeAttribute("hidden");
        videoInformationOverlay.removeAttribute("hidden");
    }
};

loopItem.addEventListener("click", loopVideo);

//Skip time
function skip(time) {
    video.currentTime += time;
    const percent = video.currentTime / video.duration;
    (currentTime.textContent = formatDuration(percent * video.duration)), timelineInner.style.setProperty("--progress-position", percent);
};

function skipPercent(time) {
    video.currentTime = video.duration * time;
    const percent = video.currentTime / video.duration;
    (currentTime.textContent = formatDuration(percent * video.duration)), timelineInner.style.setProperty("--progress-position", percent);
};

function frameSeeking(time) {
    video.currentTime += 1 / time;
    const percent = video.currentTime / video.duration;
    (currentTime.textContent = formatDuration(percent * video.duration)), timelineInner.style.setProperty("--progress-position", percent);
};

//Time divider animation
const spinners = ["/", "–", "\\", "|"];
let spinindex = 0;

function intervalDivide() {
    let line = spinners[spinindex];
    if (line == undefined) {
        spinindex = 0;
        line = spinners[spinindex];
    };
    spinindex = spinindex > spinners.length ? 0 : spinindex + 1;
    document.querySelector(".divider-time").textContent = `${line}`;
};
let interval;

const requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (rq) {
        window.setTimeout(rq, 1e3 / 60);
    },
    cancelAnimFrame = window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function (rq) {
            window.clearTimeout(rq);
        };

//Activity check
let timeout = null;

function activity() {
    clearTimeout(timeout);
    video.classList.remove("inactive");
    videoControlsContainer.classList.remove("inactive");
    videoContainer.classList.add("hovered");
    cancelAnimFrame(updateMetadata);
    if (videoContainer.classList.contains("hovered") && !settingsContextMenu.classList.contains("pressed")) {
        if (video.paused) {
            return;
        } else {
            timeout = setTimeout(function () {
                cancelAnimFrame(updatetime);
                requestAnimFrame(updateMetadata);
                videoContainer.classList.remove("hovered");
                videoControlsContainer.classList.add("inactive");
                video.classList.add("inactive");
            }, 3e3);
        };
    };
};

//Full screen and picture-in-picture
fullscreenButton.addEventListener("click", toggleFullScreen);
video.addEventListener("dblclick", toggleFullScreen);

function toggleFullScreen() {
    if (context.state === "suspended") context.resume();
    if (document.fullscreenElement == null) {
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        } else if (videoPlayer.webkitRequestFullScreen) {
            videoPlayer.webkitRequestFullScreen();
        } else if (video.webkitEnterFullScreen) {
            video.webkitEnterFullScreen();
        } else {
            if (videoPlayer.mozRequestFullScreen) videoPlayer.mozRequestFullScreen();
            if (videoPlayer.msRequestFullScreen) videoPlayer.msRequestFullscreen();
        }
        fullscreenTooltip.dataset.tooltip = "Exit full screen" + " (f)";
    } else {
        if (document.mozFullScreenElement ||
            document.webkitIsFullScreen ||
            document.msRequestFullscreen ||
            document.requestFullscreen) {
            if (document.requestFullscreen) {
                document.exitFullscreen()
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else {
                if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                if (document.msRequestFullscreen) document.msExitFullscreen();
            };
            fullscreenTooltip.dataset.tooltip = "Full screen" + " (f)";
        };
    };
};

async function togglePIPPlayerMode() {
    try {
        if (document.pictureInPictureEnabled && !video.disablePictureInPicture) {
            if (videoContainer.classList.contains("pip-player") && !video.pictureInPictureElement) {
                await document.exitPictureInPicture();
                pipTooltip.dataset.tooltip = "Picture in picture" + " (i)";
            } else {
                await video.requestPictureInPicture();
                pipTooltip.dataset.tooltip = "Exit picture in picture" + " (i)";
            };
        };
    } catch (error) {
        console.error(error);
    };
};

function fullScreenToggleChange() {
    videoPlayer.classList.toggle("full-screen", document.fullscreenElement);
};

document.addEventListener("fullscreenchange", fullScreenToggleChange, false);
document.addEventListener("mozfullscreenchange", fullScreenToggleChange, false);
document.addEventListener("webkitfullscreenchange", fullScreenToggleChange, false);
document.addEventListener("msfullscreenchange", fullScreenToggleChange, false);

video.addEventListener("webkitenterfullscreen", () => {
    videoPlayer.classList.add("full-screen");
    fullscreenTooltip.dataset.tooltip = "Exit full screen" + " (f)";
});

video.addEventListener("webkitendfullscreen", () => {
    videoPlayer.classList.remove("full-screen");
    fullscreenTooltip.dataset.tooltip = "Full screen" + " (f)";
    if (!video.paused) video.play();
});

function togglePIPClass() {
    if (videoContainer.classList.contains("pip-player")) {
        videoContainer.classList.remove("pip-player");
        fullscreenTooltip.dataset.tooltip = "Full screen" + " (f)";
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
volumeSliderContainer.addEventListener("pointermove", e => {
    handleVolumeUpdate(e);
    volumeSliderContainer.addEventListener("pointerleave", () => {
        volumeSliderContainer.releasePointerCapture(e.pointerId);
    });
    volumeSliderContainer.addEventListener("pointerdown", e => {
        volumeSliderContainer.setPointerCapture(e.pointerId);
        settingsButton.classList.remove("pressed");
        settingsContextMenu.classList.remove("pressed");
        settingsTooltipContainer.classList.add("tooltip-right");
        seekingPreview.removeAttribute("hidden");
        showContextMenu(false);
        if (e.button === 0) volumeUpdate(e);
    });
    if (isVolumeScrubbing) {
        volumeUpdate(e);
    };
    volumeSliderContainer.addEventListener("pointerup", e => {
        volumeSliderContainer.releasePointerCapture(e.pointerId);
        if (isVolumeScrubbing) {
            volumeSliderContainer.releasePointerCapture(e.pointerId);
            volumeUpdate(e);
        };
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
    (video.muted = !video.muted), video.muted ?
        (volumeTooltipContainer.dataset.tooltip = "Unmute (m)") :
        (volumeTooltipContainer.dataset.tooltip = "Mute (m)");
};

//Timeline
function seekingPreviewPosition(e) {
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
    var seekPos = `calc(${percent}% - ${seekRect.width * (percent / 100) / 2 + 40 * (1 - percent / 100)}px + ${seekRect.width * (1 - percent / 100) / 2 - percent / 100 * 40}px + ${80 * (1 - percent / 100)}px)`;
    seekingPreview.style.setProperty("--thumbnail-seek-position", seekPos);
};

timelineInner.addEventListener("pointermove", e => {
    seekingPreview.classList.add("hovered");
    videoControls.setAttribute("hidden", "");
    handleTimelineUpdate(e);
    timelineInner.addEventListener("pointerleave", () => {
        timelineInner.releasePointerCapture(e.pointerId);
        seekingPreview.classList.remove("hovered");
        videoControls.removeAttribute("hidden");
    });
    timelineInner.addEventListener("pointerdown", e => {
        timelineInner.setPointerCapture(e.pointerId);
        settingsButton.classList.remove("pressed");
        settingsContextMenu.classList.remove("pressed");
        settingsTooltipContainer.classList.add("tooltip-right");
        seekingPreview.removeAttribute("hidden");
        showContextMenu(false);
        if (e.button === 0) toggleScrubbing(e);
    });
    if (isScrubbing) {
        videoControls.setAttribute("hidden", "");
    };
    timelineInner.addEventListener("pointerup", e => {
        timelineInner.releasePointerCapture(e.pointerId);

        if (isScrubbing) {
            toggleScrubbing(e);
            seekingPreview.classList.remove("hovered");
            videoControls.removeAttribute("hidden");
            videoContainer.classList.add("buffering-scrubbing");
        };
    });
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
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    var thumbPosition = Math.trunc(percent * video.duration) / Math.trunc(video.duration) * 100;
    seekingThumbnail.style.backgroundPositionY = `${thumbPosition}%`;

    seekingPreviewPosition(e);
    let seekTime = percent * video.duration;
    timelineInner.style.setProperty("--preview-position", percent);
    timeTooltip.textContent = formatDuration(seekTime);

    if (seekTime < 0) seekTime = 0;
    if (seekTime > video.duration - 1) seekTime = video.duration - 1;

    if (isScrubbing) {
        cancelAnimFrame(updatetime);
        e.preventDefault();
        videoThumbPreview.style.backgroundPositionY = `${thumbPosition}%`;
        timelineInner.style.setProperty("--progress-position", percent);
        timeTooltip.textContent = formatDuration(seekTime);
        currentTime.textContent = formatDuration(seekTime);
    };
};

//Load and update data
function loadedMetadata() {
    totalTime.textContent = formatDuration(video.duration);
    currentTime.textContent = formatDuration(video.currentTime);
};

function updatetime() {
    const percent = video.currentTime / video.duration;
    if (!video.paused) {
        if (video.currentTime > 0) timelineInner.style.setProperty("--buffered-position", (1 / video.duration) * video.buffered.end(0));
        timelineInner.style.setProperty("--progress-position", percent);
        if (orientationInfluence > 16/9) {
            qualityBadgeContainer.dataset.quality = qualityCheck(video.videoWidth);
            qualityBadgeText.textContent = qualityCheck(video.videoWidth);
        } else {
            qualityBadgeContainer.dataset.quality = qualityCheck(video.videoHeight);
            qualityBadgeText.textContent = qualityCheck(video.videoHeight);
        };
    };
    requestAnimFrame(updatetime);
};


function updateMetadata() {
    videoPlayerContainer.style.setProperty("--aspect-ratio-size", video.videoWidth / video.videoHeight);
    videoPlayerContainer.style.setProperty("--aspect-ratio-size-inverse", video.videoHeight / video.videoWidth);
    videoContainer.classList.contains("hovered") ? cancelAnimFrame(updateMetadata) : requestAnimFrame(updateMetadata);
    
};

const leading0Formatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
});

function formatDuration(time) {
    const seconds = Math.trunc(time % 60),
        minutes = Math.trunc(time / 60 % 60),
        hours = Math.trunc(time / 60 / 60 % 60);

    if (hours === 0) {
        return `${minutes}:${leading0Formatter.format(seconds)}`;
    } else if (hours > 0) {
        return `${hours}:${leading0Formatter.format(minutes)}:${leading0Formatter.format(seconds)}`;
    } else {
        return `0:00`;
    }
};

function formatDurationARIA(time) {
    const seconds = Math.trunc(time % 60),
        minutes = Math.trunc(time / 60 % 60),
        hours = Math.trunc(time / 60 / 60 % 60);

    let secondsARIA = 0;
    if (seconds < 1) secondsARIA = `Less than a second`;
    if (seconds === 1) secondsARIA = `${seconds} second`;
    if (seconds > 1) secondsARIA = `${seconds} seconds`;

    let minutesARIA = 0;
    if (minutes <= 1) minutesARIA = `${minutes} minute`;
    if (minutes > 1) minutesARIA = `${minutes} minutes`;

    let hoursARIA = 0;
    if (hours <= 1) hoursARIA = `${hours} hour`;
    if (hours > 1) hoursARIA = `${hours} hours`;

    if (minutes === 0) {
        return `${secondsARIA}`;
    } else if (minutes > 0) {
        return `${minutesARIA} ${secondsARIA}`;
    } else if (hours > 0) {
        return `${hoursARIA} ${minutesARIA} ${secondsARIA}`;
    } else {
        return `0`;
    };
};

//Playback and Media Session
playpauseButton.addEventListener("click", togglePlay);
videoFit.addEventListener("click", togglePlay);

async function togglePlay() {
    if (video.currentTime === video.duration && video.paused) {
        if (contextMenu.classList.contains("show")) return;
        if (settingsContextMenu.classList.contains("pressed")) return;

        videoContainer.classList.remove("ended");
        video.currentTime = 0;
    };
    if (context.state === "suspended") context.resume();
    video.paused ? await video.play() : await video.pause();
};


const qualityLabels = [{
    label: "SD",
    size: 640,
    length: 480
}, {
    label: "HD",
    size: 1280,
    length: 720
}, {
    label: "FHD",
    size: 1920,
    length: 1080
}, {
    label: "QHD",
    size: 2560,
    length: 1440
}, {
    label: "4K",
    size: 3840,
    length: 2160
}, {
    label: "5K",
    size: 5120,
    length: 2880
}, {
    label: "6K",
    size: 6144,
    length: 3456,
}, {
    label: "8K",
    size: 7860,
    length: 4320
},];

function qualityCheck(size) {
    if (!size || size < 0) return "N/A";
    var label;
    orientationInfluence > 16/9 ? label = qualityLabels.find(l => l.size >= size) : label = qualityLabels.find(l => l.length >= size);
    return label ? label.label : "LD";
};

function streamingCheck() {
    return source.hasAttribute("type") === videoMetadata.HLS_codec && source.hasAttribute("src") === videoMetadata.HLS_src ? "Multiple Qualities" : "Single Quality";
};

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
                artwork: [{
                    src: `${mediaSessionMetadata.thumb_96}`,
                    sizes: "96x96",
                    type: mediaSessionMetadata.type,
                }, {
                    src: `${mediaSessionMetadata.thumb_128}`,
                    sizes: "128x128",
                    type: mediaSessionMetadata.type,
                }, {
                    src: `${mediaSessionMetadata.thumb_192}`,
                    sizes: "192x192",
                    type: mediaSessionMetadata.type,
                }, {
                    src: `${mediaSessionMetadata.thumb_256}`,
                    sizes: "256x256",
                    type: mediaSessionMetadata.type,
                }, {
                    src: `${mediaSessionMetadata.thumb_384}`,
                    sizes: "384x384",
                    type: mediaSessionMetadata.type,
                }, {
                    src: `${mediaSessionMetadata.thumb_512}`,
                    sizes: "512x512",
                    type: mediaSessionMetadata.type,
                },],
            });
        };
    } catch (error) {
        console.error(error);
    };

    const actionHandlers = [
        ["play", async function () {
            if (video.paused) await togglePlay();
        }],
        ["pause", async function () {
            if (!video.paused) await togglePlay();
        }],
        ["stop", function () {
            if (!video.paused) togglePlay();
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
            updatetime();
            updatePositionState();
        } catch (error) {
            console.log(`The media session action "${action}" is unavailable.`);
        };
    };
};

if (window.WebKitPlaybackTargetAvailabilityEvent) {
    video.addEventListener("webkitplaybacktargetavailabilitychanged", function (e) {
        switch (e.availability) {
            case "available":
                video.setAttribute("x-webkit-airplay", "allow");
                AirPlayTooltip.removeAttribute("hidden");
                break;

            default:
                AirPlayTooltip.setAttribute("hidden", "");
                break;
        };

        AirPlayButton.addEventListener("click", function () {
            mediaSessionToggle();
            video.webkitShowPlaybackTargetPicker();
        });
    });
} else {
    AirPlayTooltip.setAttribute("hidden", "");
};

if (window.chrome && !window.chrome.cast && video.readyState > 0) {
    window["__onGCastApiAvailable"] = function (isAvailable) {
        if (isAvailable) {
            initializeCastApi();
        } else {
            return false;
        }
    };

    initializeCastApi = function () {
        cast.framework.CastContext.getInstance().setOptions({
            autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
            receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
            resumeSavedSession: false,
            androidReceiverCompatible: true,
        });
    };

    function mimeType() {
        if (video.currentSrc = videoMetadata.HLS_src) {
            return videoMetadata.HLS_codec;
        } else if (video.currentSrc = videoMetadata.Fallback_src) {
            return videoMetadata.Fallback_codec;
        } else {
            return;
        };
    };

    var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    var mediaInfo = new chrome.cast.media.MediaInfo(video.currentSrc, mimeType);

    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
    mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
    mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
    mediaInfo.metadata.title = title;
    mediaInfo.metadata.subtitle = author;
    mediaInfo.duration = video.duration;

    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = true;
    request.currentTime = startTime;

    var textTrackStyle = new chrome.cast.media.TextTrackStyle();
    var tracksInfoRequest = new chrome.cast.media.EditTracksInfoRequest(textTrackStyle);
    media.editTracksInfo(tracksInfoRequest, successCallback, errorCallback);
    var textTrackStyle = new chrome.cast.media.TextTrackStyle();
    textTrackStyle.foregroundColor = "#FFFFFF";
    textTrackStyle.backgroundColor = "#00000099";
    textTrackStyle.fontStyle = "NORMAL";

    castSession.loadMedia(request)
        .then(function () {
            console.log("Load succeed");
        }, function (errorCode) {
            console.log("Error code: " + errorCode)
        });

    let sessionId;

    function rejoinCastSession() {
        chrome.cast.requestSessionById(sessionId);
    }
    CastButton.addEventListener("click", function () {
        mediaSessionToggle();
        if (sessionId == null) {
            let castSession = cast.framework.CastContext.getInstance().getCurrentSession();
            if (castSession) {
                let mediaInfo = createMediaInfo();
                let request = new chrome.cast.media.LoadRequest(mediaInfo);
                castSession.loadMedia(request)

                sessionId = CastSession.getSessionId();
            } else {
                console.log("Error: Attempting to play media without a Cast Session");
            }
        } else {
            rejoinCastSession();
        }
    });

    var player = new cast.framework.RemotePlayer();
    var playerController = new cast.framework.RemotePlayerController(player);

    function changeVolume(newVolume) {
        player.volumeLevel = newVolume;
        playerController.setVolume();

    }

    playerController.addEventListener(
        cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
        function () {
            let session = cast.framework.CastContext.getInstance().getCurrentSession();

            if (!session) {
                return;
            }

            let mediaStatus = session.getMediaSession();
            if (!mediaStatus) {
                return;
            }

            let mediaInfo = mediaStatus.media;
        });

    var context = cast.framework.CastContext.getInstance();
    context.addEventListener(cast.framework, function (e) {
        switch (e.castState) {
            case cast.framework.SessionState.NO_DEVICES_AVAILABLE:
                CastTooltip.setAttribute("hidden", "");
                break;
            case cast.framework.SessionState.NOT_CONNECTED:
                CastTooltip.removeAttribute("hidden");
                break;
            case cast.framework.SessionState.CONNECTED:
                videoContainer.classList.add("casted-session");
                break;
        };
    });
    context.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, function (e) {
        switch (e.sessionState) {
            case cast.framework.SessionState.SESSION_STARTED:
            case cast.framework.SessionState.SESSION_RESUMED:
                break;
            case cast.framework.SessionState.SESSION_ENDED:
                videoContainer.classList.remove("casted-session");
                break;
        };
    });

    playerController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, function () {
        if (!player.isConnected) {
            console.log("RemotePlayerController: Player disconnected");
        }
    });

    function stopCasting() {
        var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
        castSession.endSession(true);
    };
};

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
    } else if (e.getModifierState("Control") +
        e.getModifierState("Alt") +
        e.getModifierState("Meta") > 1) {
        return;
    } else {
        function checkActive() {
            videoContainer.classList.add("hovered");
            activity();
        };
        switch (e.key.toLowerCase()) {
            case "":
                if (tagName === "button") break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                checkActive();
                skipPercent(e.key / 10);
                break;
            case "k":
            case " ":
                checkActive();
                e.preventDefault();
                togglePlay();
                break;
            case "f":
                if (fullscreenButton.classList.contains("unsupported")) break;
                checkActive();
                toggleFullScreen();
                break;
            case "c":
                checkActive();
                toggleCaptions();
                break;
            case "i":
                if (pipPlayerButton.classList.contains("unsupported")) break;
                checkActive();
                togglePIPPlayerMode();
                break;
            case "m":
                checkActive();
                toggleVolume();
                break;
            case "arrowleft":
            case "arrowright":
                if (e.key.toLowerCase() === "arrowleft") skip(-5);
                if (e.key.toLowerCase() === "arrowright") skip(5);
                checkActive();
                break;
            case "j":
            case "l":
                if (e.key.toLowerCase() === "j") skip(-10);
                if (e.key.toLowerCase() === "l") skip(10);
                checkActive();
                break;
            case ",":
            case ".":
                if (e.key === ",") frameSeeking(`-${videoMetadata.video_FPS}`);
                if (e.key === ".") frameSeeking(videoMetadata.video_FPS);
                checkActive();
                break;
        };
    };
});

const eventListeners = [
    ["play", () => {
        videoContainer.classList.add("played");
        navigator.mediaSession.playbackState = "playing";
        playpauseTooltipContainer.dataset.tooltip = "Pause" + " (k)";
        video.addEventListener("timeupdate", mediaSessionToggle());
        interval = setInterval(intervalDivide, 1e3);
        if (Hls.isSupported() && video.currentTime === 0) hls.startLoad();
        videoContainer.addEventListener("pointerover", () => {
            activity();
            checkElement();
            if (videoContainer.classList.contains("hovered")) cancelAnimFrame(updateMetadata);
        });
        videoContainer.addEventListener("pointermove", () => {
            activity();
            checkElement();
            if (videoContainer.classList.contains("hovered")) cancelAnimFrame(updateMetadata);
        });
        videoContainer.addEventListener("pointerleave", () => {
            if (settingsContextMenu.classList.contains("pressed")) return;
            videoContainer.classList.remove("hovered");
            video.classList.add("inactive");
            requestAnimFrame(updateMetadata);
        });
        videoContainer.classList.remove("paused");
    }],
    ["pause", () => {
        clearInterval(interval);
        cancelAnimFrame(updatetime);
        navigator.mediaSession.playbackState = "paused";
        playpauseTooltipContainer.dataset.tooltip = "Play" + " (k)";
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
        videoControls.removeAttribute("hidden");
    }],
    ["seeking", () => {
        currentTime.textContent = formatDuration(video.currentTime);
    }],
    ["seeked", () => {
        requestAnimFrame(updatetime);
        videoContainer.classList.add("played");
        seekingPreview.classList.remove("loading");
        videoContainer.classList.remove("buffering-scrubbing");
        updatetime();
        currentTime.textContent = formatDuration(video.currentTime);
    }],
    ["timeupdate", () => {
        requestAnimFrame(updatetime);
        currentTime.textContent = formatDuration(video.currentTime);
        durationContainer.setAttribute("aria-label", `${formatDurationARIA(video.currentTime)} elapsed of ${formatDurationARIA(video.duration)}`);
        video.currentTime === video.duration ? videoContainer.classList.add("ended") :videoContainer.classList.remove("ended");
    }],
    ["loadedmetadata", () => {
        videoPlayer.classList.remove("loading");
        video.textTracks[0].mode = "hidden";
        seekingThumbnail.style.backgroundImage = `url("${videoMetadata.video_thumbs}")`;
        videoThumbPreview.style.backgroundImage = `url("${videoMetadata.video_thumbs}")`;
        durationContainer.setAttribute("aria-label", `${formatDurationARIA(video.currentTime)} elapsed of ${formatDurationARIA(video.duration)}`);

        orientationInfluence = video.videoWidth / video.videoHeight;

        if (orientationInfluence > 16/9) {
            qualityBadgeContainer.dataset.quality = qualityCheck(video.videoWidth);
            qualityBadgeText.textContent = qualityCheck(video.videoWidth);
        } else {
            qualityBadgeContainer.dataset.quality = qualityCheck(video.videoHeight);
            qualityBadgeText.textContent = qualityCheck(video.videoHeight);
        };
        
        streamingBadgeContainer.dataset.streaming = streamingCheck();
        streamingBadgeText.textContent = streamingCheck();
        streamingBadgeContainer.removeAttribute("hidden");

        videoPlayerContainer.style.setProperty("--aspect-ratio-size", video.videoWidth / video.videoHeight);
        videoPlayerContainer.style.setProperty("--aspect-ratio-size-inverse", video.videoHeight / video.videoWidth);
        loadedMetadata();
    }],
    ["volumechange", () => {
        let volumeLevel;
        if (video.muted || video.volume === 0) {
            volumeLevel = "mute";
            volumeTooltipContainer.dataset.tooltip = "Unmute" + " (m)";
        } else if (video.volume >= 0.6) {
            volumeLevel = "full";
            volumeTooltipContainer.dataset.tooltip = "Mute" + " (m)";
        } else if (video.volume >= 0.3) {
            volumeLevel = "mid";
            volumeTooltipContainer.dataset.tooltip = "Mute" + " (m)";
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