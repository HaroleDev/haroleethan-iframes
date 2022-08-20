const videoMetadata = {
    video_thumbs: "//res.cloudinary.com/harole/image/upload/s--3AQUSV56--/q_auto:low/v1659426432/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_THUMBNAILS_shmsny.jpg",
    video_poster: "//res.cloudinary.com/harole/video/upload/s--p6nXm3qO--/c_fill,h_720,q_auto:low,w_1280/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    HLS_src: "//res.cloudinary.com/harole/video/upload/s--w9SNLopB--/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.m3u8",
    HLS_codec: "application/x-mpegURL",
    Fallback_src: "//link.storjshare.io/jwrbyl67eqxrubohnqibyqwsx75q/harole-video%2F2022%2FSample%20Videos%2FJuly%2022%202022%2FIMG_1175_FALLBACKSTREAM.mp4?wrap=0",
    Fallback_codec: "video/mp4",
    video_FPS: "59.940",
};

const mediaSessionMetadata = {
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

const playpauseButton = document.querySelector(".play-pause-button");
const playpauseTooltipContainer = document.querySelector(".play-pause-tooltip-container");
const videoContainer = document.querySelector(".video-container");
const videoPoster = document.querySelector(".video-poster");
const video = document.querySelector(".video");
const videoFit = document.querySelector(".video-fit-contain");
const source = video.querySelector("source");

const currentTime = document.querySelector(".current-time");
const totalTime = document.querySelector(".total-time");
const durationContainer = document.querySelector(".duration-container");
const timeTooltip = document.querySelector(".seeking-preview__time-tooltip");

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
const videoPlayerContainer = document.querySelector(".video-player-container");

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
const rightVideoControls = document.querySelector(".right-side");
const videoInformationOverlay = document.querySelector(".video-information-overlay");

const seekingPreview = document.querySelector(".seeking-preview");
const seekingThumbnail = document.querySelector(".seeking-preview__thumbnail");
const videoThumbPreview = document.querySelector(".video-thumb-preview");

const qualityContainer = document.querySelector(".quality-badge");
const qualityText = document.querySelector(".quality-badge .quality");

const AirPlayTooltip = document.querySelector(".airplay-tooltip");
const AirPlayButton = document.querySelector(".airplay-button");
const CastButton = document.querySelector(".gcast-button");
const CastTooltip = document.querySelector(".gcast-tooltip");

var title = document.querySelector("meta[property=\"og:title\"]").getAttribute("content") || decodeURIComponent(videoMetadata.Fallback_src.substring(videoMetadata.Fallback_src.lastIndexOf('/') + 1));
var author = document.querySelector("meta[property=\"og:author\"]").getAttribute("content");
var description = document.querySelector("meta[property=\"og:description\"]").getAttribute("content");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 616 179">
<path fill="#02DA9A" d="M50.074 57.7258c3.1201 2.4019 3.1201 7.1071 0 9.5089L9.66019 98.3453c-3.94542 3.0367-9.65997195.2246-9.65997173-4.7544l.00000272-62.2212c2.2e-7-4.979 5.71454901-7.7916 9.65996901-4.7544L50.074 57.7258Zm84.106 4.7545c0 14.9117-12.089 27-27 27-14.912 0-27.0003-12.0883-27.0003-27s12.0883-27 27.0003-27c14.911 0 27 12.0883 27 27ZM37.5723 152.088c-4.2511 4.251-4.2946 11.249.6862 14.615 6.8757 4.648 14.7215 7.764 23.0048 9.075 11.889 1.884 24.069-.046 34.7942-5.51 10.7255-5.465 19.4455-14.185 24.9095-24.91 3.808-7.473 5.899-15.651 6.18-23.946.204-6.008-5.482-10.086-11.42-9.146-5.938.941-9.814 6.603-10.724 12.546-.565 3.692-1.717 7.293-3.434 10.662-3.3775 6.628-8.7668 12.018-15.3955 15.395-6.6287 3.378-14.1565 4.57-21.5044 3.406-3.7346-.591-7.3252-1.776-10.6441-3.489-5.3426-2.757-12.2016-2.949-16.4527 1.302ZM211.347 176.48l-37.824-94.0798h20.928l19.392 50.1118c1.792 4.736 3.328 9.152 4.608 13.248 1.408 3.968 2.432 7.36 3.072 10.176.896-3.072 2.048-6.592 3.456-10.56 1.408-4.096 2.944-8.384 4.608-12.864l20.16-50.1118h20.16l-39.36 94.0798h-19.2Zm66.936 0V82.4002h19.2V176.48h-19.2Zm9.6-115.5838c-3.456 0-6.464-1.216-9.024-3.648-2.432-2.432-3.648-5.376-3.648-8.832 0-3.456 1.216-6.4 3.648-8.832 2.56-2.432 5.568-3.648 9.024-3.648 3.328 0 6.208 1.216 8.64 3.648 2.432 2.432 3.648 5.376 3.648 8.832 0 3.456-1.216 6.4-3.648 8.832-2.432 2.432-5.312 3.648-8.64 3.648Zm67.656 118.0798c-9.088 0-16.96-2.112-23.616-6.336-6.528-4.224-11.584-9.984-15.168-17.28-3.584-7.424-5.376-16-5.376-25.728 0-9.6 1.792-18.176 5.376-25.728 3.584-7.5518 8.768-13.4398 15.552-17.6638 6.784-4.352 14.848-6.528 24.192-6.528 7.04 0 13.376 1.472 19.008 4.416 5.632 2.816 9.984 7.04 13.056 12.672v-62.016h19.392V176.48h-17.664l-1.344-16.512c-3.072 6.144-7.616 10.88-13.632 14.208-5.888 3.2-12.48 4.8-19.776 4.8Zm4.032-17.664c6.016 0 11.136-1.344 15.36-4.032 4.352-2.816 7.68-6.656 9.984-11.52 2.304-4.864 3.456-10.432 3.456-16.704s-1.152-11.776-3.456-16.512c-2.304-4.864-5.632-8.64-9.984-11.328-4.224-2.8158-9.344-4.2238-15.36-4.2238s-11.2 1.408-15.552 4.2238c-4.224 2.816-7.488 6.656-9.792 11.52-2.176 4.736-3.264 10.176-3.264 16.32 0 6.272 1.088 11.84 3.264 16.704 2.304 4.864 5.568 8.704 9.792 11.52 4.352 2.688 9.536 4.032 15.552 4.032Zm105.69 17.664c-9.216 0-17.408-2.112-24.576-6.336-7.04-4.224-12.608-10.048-16.704-17.472-3.968-7.424-5.952-16-5.952-25.728 0-9.856 1.92-18.496 5.76-25.92 3.968-7.4238 9.408-13.2478 16.32-17.4718 7.04-4.224 15.104-6.336 24.192-6.336 9.088 0 16.96 1.92 23.616 5.76 6.784 3.84 11.968 9.28 15.552 16.3198 3.712 7.04 5.568 15.296 5.568 24.768v6.72l-80.64.192.384-12.864h61.056c0-7.424-2.304-13.376-6.912-17.856-4.608-4.6078-10.752-6.9118-18.432-6.9118-5.888 0-10.944 1.28-15.168 3.84-4.096 2.5598-7.296 6.3358-9.6 11.3278-2.176 4.864-3.264 10.752-3.264 17.664 0 11.008 2.496 19.456 7.488 25.344 4.992 5.888 12.16 8.832 21.504 8.832 6.912 0 12.544-1.344 16.896-4.032 4.48-2.816 7.424-6.784 8.832-11.904h18.048c-2.176 10.112-7.104 17.984-14.784 23.616-7.68 5.632-17.408 8.448-29.184 8.448Zm51.821-49.728c0-9.728 2.112-18.304 6.336-25.728 4.352-7.4238 10.24-13.2478 17.664-17.4718 7.552-4.224 16.064-6.336 25.536-6.336 9.472 0 17.92 2.112 25.344 6.336 7.424 4.224 13.248 10.048 17.472 17.4718 4.224 7.424 6.336 16 6.336 25.728 0 9.728-2.112 18.304-6.336 25.728-4.224 7.424-10.048 13.248-17.472 17.472-7.424 4.224-15.872 6.336-25.344 6.336-9.472 0-17.984-2.112-25.536-6.336-7.424-4.224-13.312-10.048-17.664-17.472-4.224-7.424-6.336-16-6.336-25.728Zm19.584 0c0 6.272 1.28 11.84 3.84 16.704 2.56 4.864 6.08 8.704 10.56 11.52 4.48 2.688 9.664 4.032 15.552 4.032s11.008-1.344 15.36-4.032c4.48-2.816 8-6.656 10.56-11.52 2.56-4.864 3.84-10.432 3.84-16.704 0-6.4-1.28-11.968-3.84-16.704-2.56-4.864-6.08-8.64-10.56-11.328-4.352-2.6878-9.472-4.0318-15.36-4.0318s-11.072 1.344-15.552 4.0318c-4.48 2.688-8 6.464-10.56 11.328-2.56 4.736-3.84 10.304-3.84 16.704ZM270.589 18.5957c-2.346-4.0618-.965-9.34671 3.478-10.84921 3.533-1.19472 7.218-1.92864 10.963-2.17413 6.582-.43138 13.174.65706 19.268 3.18111 6.093 2.52403 11.525 6.41603 15.874 11.37493 2.474 2.822 4.561 5.9464 6.214 9.2893 2.079 4.2041-.681 8.9174-5.212 10.1313-4.53 1.2139-9.086-1.6026-11.689-5.5045-.632-.948-1.328-1.856-2.083-2.7175-2.631-3.0001-5.917-5.3549-9.604-6.8819-3.687-1.5271-7.675-2.1857-11.657-1.9247-1.143.075-2.277.2251-3.395.4484-4.599.9187-9.812-.3114-12.157-4.3731Z"/>
</svg>`;

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
    console.log("%cPlayful Video%c\nRolling Progress Release", `
    background-image: url(data:image/svg+xml;base64,${btoa(svg)});
    padding: 1rem 5.375rem;
    padding-right: 0px;
    margin: 20px;
    margin-left: -7px;
    margin-bottom: 8px;
    color: transparent;
    text-align: center;
    user-select: none;
    pointer-events: none;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    `,
        `font-family: Manrope, Arial, Helvetica, sans-serif;
    font-size: 1rem;
    line-height: 130%;
    margin: 4px 0px 16px 0px;
    font-weight: 500;
    font-kerning: normal;
    color: #1C5947;`);
    console.log("%cThis is a browser feature intended for developers to debug the player. As this is a rolling release of a developing project, I'd encourage you to send a feedback to me once you discovered a bug not listed on the page (which you can by my Discord's username below).\n\nDiscord: %cHarole#1225\n%cWebsite (WIP): %chttps://preview.studio.site/live/4BqN8BM2Wr",
        `font-family: Inconsolata, monospace;
    font-size: 1rem;
    line-height: 130%;
    font-weight: 500;
    color: #1C5947;
    `,
        `font-family: Inconsolata, monospace;
    font-size: 1rem;
    line-height: 100%;
    font-weight: 800;
    color: #1C5947;
    border-bottom: 2px solid #1C5947;
    `,
        `font-family: Inconsolata, monospace;
    font-size: 1rem;
    line-height: 130%;
    font-weight: 500;
    color: #1C5947;
    `,
        `font-family: Inconsolata, monospace;
    font-size: 1rem;
    line-height: 100%;
    font-weight: 800;
    color: #0249C7;
    `);
};

init();

function canFullscreen() {
    var check = typeof document.body.requestFullscreen !== "undefined" ||
        typeof document.body.mozRequestFullScreen !== "undefined" ||
        typeof document.body.webkitRequestFullscreen !== "undefined" ||
        typeof document.body.webkitEnterFullscreen !== "undefined" ||
        typeof document.body.msRequestFullscreen !== "undefined" ||
        typeof document.body.exitFullscreen !== "undefined" ||
        typeof document.body.mozCancelFullScreen !== "undefined" ||
        typeof document.body.webkitExitFullscreen !== "undefined";
    return check;
};

let lastKnownScrollPosition = 0;
let ticking = false;

window.addEventListener("DOMContentLoaded", () => {
    videoPoster.src = videoMetadata.video_poster;
    videoPoster.decoding = "async";

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

        if (message && message.length) {
            s += message;
        };

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
        seekingPreview.removeAttribute("hidden");
        closedDialog();
    };

    if (contextMenu.classList.contains("show")) {
        showContextMenu(false);
    } else {
        e.preventDefault();
        const { x, y } = ctxmenuPosition(e);
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

    return { x, y };
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
    if (settingsButton.classList.contains("pressed") && settingsContextMenu.classList.contains("pressed")) {
        seekingPreview.setAttribute("hidden", "");
    } else {
        seekingPreview.removeAttribute("hidden");
    }
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
            if (videoContainer.classList.contains("caption")) {
                track.mode = "showing";
            } else {
                track.mode = "hidden";
            };

            if (trackAsHtmlElement.readyState === 2) {
                displayCues(track);
            } else {
                displayCuesAfterTrackLoaded(trackAsHtmlElement, track);
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
    if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") {
        toggleBtn(e.target);
    };
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
function skip(duration) {
    video.currentTime += duration;
    const percent = video.currentTime / video.duration;
    currentTime.textContent = formatDuration(percent * video.duration);
    timelineInner.style.setProperty("--progress-position", percent);
};

function skipPercent(number) {
    video.currentTime = video.duration * number;
    const percent = video.currentTime / video.duration;
    currentTime.textContent = formatDuration(percent * video.duration);
    timelineInner.style.setProperty("--progress-position", percent);
};

function frameSeeking(fps) {
    video.currentTime += 1 / fps;
    const percent = video.currentTime / video.duration;
    currentTime.textContent = formatDuration(percent * video.duration);
    timelineInner.style.setProperty("--progress-position", percent);
};

//Time divider animation
function spinnerDivider() {
    const spinners = ["/", "–", "\\", "|"];
    let index = 0;
    var interval = setInterval(() => {
        if (video.paused) clearInterval(interval);
        let line = spinners[index];
        if (line == undefined) {
            index = 0;
            line = spinners[index];
        };
        index = index > spinners.length ? 0 : index + 1;
        document.querySelector(".divider-time").textContent = `${line}`;
    }, 1000);
};

const requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

const cancelAnimFrame = (function () {
    return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function (callback) {
            window.clearTimeout(callback);
        };
})();

//Activity check
let timeout = null;
function activity() {
    clearTimeout(timeout);
    video.classList.remove("inactive");
    videoControlsContainer.classList.remove("inactive");
    videoContainer.classList.add("hovered");
    if (videoContainer.classList.contains("hovered") && !settingsContextMenu.classList.contains("pressed")) {
        if (video.paused) {
            return;
        } else {
            timeout = setTimeout(function () {
                cancelAnimFrame(updatetime);
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
        if (e.button === 0) volumeUpdate(e);
    });
    if (isVolumeScrubbing) {
        lockScroll();
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
    video.muted = !video.muted;
    if (video.muted) {
        volumeTooltipContainer.dataset.tooltip = "Unmute" + " (m)";
    } else {
        volumeTooltipContainer.dataset.tooltip = "Mute" + " (m)";
    };
};

//Timeline
function seekingPreviewPosition(e) {
    /*function clamp(input = 0, min = 0, max = 255) {
        return Math.min(Math.max(input, min), max);
    };*/
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
    var seekPos = `calc(${percent}% - ${(seekRect.width * (percent / 100)) / 2 + (40 * (1 - percent / 100))}px + ${(seekRect.width * (1 - percent / 100)) / 2 - (40 * (percent / 100))}px + ${(40 * 2) * (1 - percent / 100)}px)`;
    seekingPreview.style.setProperty("--thumbnail-seek-position", seekPos);
};

let scrollPosition = 0;
function unlockScroll() {
    scrollPosition = window.pageYOffset;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
};

function lockScroll() {
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("position");
    document.body.style.removeProperty("top");
    document.body.style.removeProperty("width");
    window.scrollTo(0, scrollPosition);
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
        if (e.button === 0) toggleScrubbing(e);
    });
    if (isScrubbing) {
        lockScroll();
        videoControls.setAttribute("hidden", "");
    };
    timelineInner.addEventListener("pointerup", e => {
        timelineInner.releasePointerCapture(e.pointerId);
        if (isScrubbing) {
            toggleScrubbing(e);
            unlockScroll();
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

    var thumbPosition = Math.floor(percent * video.duration) / Math.floor(video.duration) * 100;
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
    };
    requestAnimFrame(updatetime);
};

const leading0Formatter = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });

function formatDuration(time) {
    const seconds = Math.trunc(time % 60);
    const minutes = Math.trunc((time / 60) % 60);
    const hours = Math.trunc((time / 60 / 60) % 60);
    if (hours === 0) {
        return `${minutes}:${leading0Formatter.format(seconds)}`;
    } else if (hours > 0) {
        return `${hours}:${leading0Formatter.format(minutes)}:${leading0Formatter.format(seconds)}`;
    } else {
        return `0:00`;
    }
};

function formatDurationARIA(time) {
    const seconds = Math.trunc(time % 60);
    const minutes = Math.trunc((time / 60) % 60);
    const hours = Math.trunc((time / 60 / 60) % 60);

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
        return `${secondsARIA}`;
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


const qualityLabels = [
    { label: 'SD', size: 640 },
    { label: 'HD', size: 1280 },
    { label: 'FHD', size: 1920 },
    { label: 'QHD', size: 2560 },
    { label: '4K', size: 3840 },
    { label: '5K', size: 5120 },
    { label: '6K', size: 6144 },
    { label: '8K', size: 7860 },
];

function qualityCheck(size) {
    if (!size || size < 0) return "N/A";
    const label = qualityLabels.find(lb => lb.size >= size);
    return label ? label.label : "LD";
};
//return video.videoWidth >= 1280 ? "HD" : video.videoWidth >= 1920 ? "FHD" : video.videoWidth >= 2560 ? "QHD" : video.videoWidth >= 3840 ? "4K UHD" : video.videoWidth >= 5120 ? "5K UHD" : video.videoWidth >= 6144 ? "6K UHD" : video.videoWidth >= 7860 ? "8K UHD" : video.videoWidth < 640 ? "LD" : video.videoWidth >= 640 ? "SD" : "N/A";

function qualityCheckAcro() {
    return video.videoWidth >= 1280 ? "HD" : video.videoWidth >= 1920 ? "FHD" : video.videoWidth >= 2560 ? "QHD" : video.videoWidth >= 3840 ? "UHD" : video.videoWidth < 640 ? "LD" : video.videoWidth >= 640 ? "SD" : "N/A";
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
        ["play", async function () { if (video.paused) await togglePlay(); }],
        ["pause", async function () { if (!video.paused) await togglePlay(); }],
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
        .then(function () { console.log("Load succeed"); },
            function (errorCode) { console.log("Error code: " + errorCode) });

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
        cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED, function () {
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
    context.addEventListener(cast.framework,
        function (e) {
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
    context.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
        function (e) {
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
            case "0": case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9":
                checkActive();
                skipPercent(e.key / 10);
                break;
            case "k": case " ":
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
            case "arrowleft": case "arrowright":
                if (e.key.toLowerCase() === "arrowleft") skip(-5);
                if (e.key.toLowerCase() === "arrowright") skip(5);
                checkActive();
                break;
            case "j": case "l":
                if (e.key.toLowerCase() === "j") skip(-10);
                if (e.key.toLowerCase() === "l") skip(10);
                checkActive();
                break;
            case ",": case ".":
                if (e.key === ",") frameSeeking(`-${videoMetadata.video_FPS}`);
                if (e.key === ".") frameSeeking(videoMetadata.video_FPS);
                checkActive();
                break;
        };
    };
});

const eventListeners = [
    ["play", () => {
        videoPoster.classList.add("played");
        navigator.mediaSession.playbackState = "playing";
        playpauseTooltipContainer.dataset.tooltip = "Pause" + " (k)";

        video.addEventListener("timeupdate", mediaSessionToggle());
        spinnerDivider();
        if (Hls.isSupported() && video.currentTime === 0) hls.startLoad();
        videoContainer.addEventListener("pointerover", () => {
            activity();
            checkElement();
        });
        videoContainer.addEventListener("pointermove", () => {
            activity();
            checkElement();
        });
        videoContainer.addEventListener("pointerleave", () => {
            if (settingsContextMenu.classList.contains("pressed")) return;
            videoContainer.classList.remove("hovered");
            video.classList.add("inactive");
        });
        videoContainer.classList.remove("paused");
    }],
    ["pause", () => {
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
        videoPoster.classList.add("played");
        seekingPreview.classList.remove("loading");
        videoContainer.classList.remove("buffering-scrubbing");
        updatetime();
        currentTime.textContent = formatDuration(video.currentTime);
    }],
    ["timeupdate", () => {
        requestAnimFrame(updatetime);
        currentTime.textContent = formatDuration(video.currentTime);
        durationContainer.setAttribute("aria-label", `${formatDurationARIA(video.currentTime)} elapsed of ${formatDurationARIA(video.duration)}`);
        if (video.currentTime === video.duration) {
            videoContainer.classList.add("ended");
        } else {
            videoContainer.classList.remove("ended");
        };
    }],
    ["loadedmetadata", () => {
        videoPlayer.classList.remove("loading");
        video.textTracks[0].mode = "hidden";
        seekingThumbnail.style.backgroundImage = `url("${videoMetadata.video_thumbs}")`;
        videoThumbPreview.style.backgroundImage = `url("${videoMetadata.video_thumbs}")`;
        durationContainer.setAttribute("aria-label", `${formatDurationARIA(video.currentTime)} elapsed of ${formatDurationARIA(video.duration)}`);

        qualityContainer.dataset.quality = qualityCheckAcro();
        qualityText.textContent = qualityCheck(video.videoWidth);

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
