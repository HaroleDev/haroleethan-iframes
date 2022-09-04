'use strict'
import "//cdn.jsdelivr.net/npm/core-js-bundle@latest/index.min.js";
import { videoMetadata, mediaSessionMetadata } from './metadata.js'
const config = {
    startPosition: -1
}

const hls = new Hls(config)

const playfulVideoPlayerContainer = document.querySelector('.playful-video-player-container')
const playfulVideoPlayer = playfulVideoPlayerContainer.querySelector('.playful-video-player')

const video = playfulVideoPlayer.querySelector('.video')
const videoFit = playfulVideoPlayer.querySelector('.video-fit-contain')
const source = video.querySelector('source')

const playpauseButton = playfulVideoPlayer.querySelector('.play-pause-button')
const playpauseTooltipContainer = playfulVideoPlayer.querySelector('.play-pause-tooltip-container')
const videoContainer = playfulVideoPlayer.querySelector('.video-container')
const videoPoster = playfulVideoPlayer.querySelector('.video-poster')

const currentTime = playfulVideoPlayer.querySelector('.current-time')
const totalTime = playfulVideoPlayer.querySelector('.total-time')
const durationContainer = playfulVideoPlayer.querySelector('.duration-container')
const timeTooltip = playfulVideoPlayer.querySelector('.seeking-preview__time-tooltip')

const EQswitchToggle = playfulVideoPlayer.querySelector('.eq-switch')
const rangeEQInputs = playfulVideoPlayer.querySelectorAll('.dialog .eq-control input')
const eqContainer = playfulVideoPlayer.querySelector('.eq-dialog-container')
const loopItem = playfulVideoPlayer.querySelector('.loop-item')
const eqItem = playfulVideoPlayer.querySelector('.eq-item')

const aboutPlayerItem = playfulVideoPlayer.querySelector('.about-player-item')
const aboutPlayerContainer = playfulVideoPlayer.querySelector('.about-player-dialog-container')

const dialogContainer = playfulVideoPlayer.querySelectorAll('.dialog-container')

const captionButton = playfulVideoPlayer.querySelector('.caption-button')
const settingsButton = playfulVideoPlayer.querySelector('.settings-button')
const settingsContextMenu = playfulVideoPlayer.querySelector('.settings-context-menu')
const settingsTooltipContainer = playfulVideoPlayer.querySelector('.settings-tooltip-container')

const contextMenu = playfulVideoPlayer.querySelector('.video-context-menu')

const Item = playfulVideoPlayer.querySelector('.item')
const downloadItem = playfulVideoPlayer.querySelector('.download-item')
const playbackSpeedItem = playfulVideoPlayer.querySelector('.playback-speed-item')
const transcriptItem = playfulVideoPlayer.querySelector('.transcript-item')
const backPageSettings = playfulVideoPlayer.querySelector('.back-page')

const playbackSpeedItemControls = playfulVideoPlayer.querySelectorAll('.page-contents.playback-speed-settings .item')

const transcriptPanel = playfulVideoPlayer.querySelector('.transcript-panel')
const closeTranscriptPanelBtn = playfulVideoPlayer.querySelector('.close-transcript-panel')
const transcriptDiv = playfulVideoPlayer.querySelector('.captions-contents')
const snackbarSyncTranscript = playfulVideoPlayer.querySelector('.snackbar-sync-time')
let cueContainers = playfulVideoPlayer.querySelectorAll('.cue-container')

const dialog = playfulVideoPlayer.querySelectorAll('.dialog')
const closeDialogBtn = playfulVideoPlayer.querySelectorAll('.dialog .close-dialog')

const dialogOverlay = playfulVideoPlayer.querySelectorAll('.dialog-container .dialog-overlay')
const volumeSliderContainer = playfulVideoPlayer.querySelector('.volume-slider-container')
const volumeContainer = playfulVideoPlayer.querySelector('.volume-container')
const volumeButton = playfulVideoPlayer.querySelector('.volume-button')
const volumeTooltipContainer = playfulVideoPlayer.querySelector('.volume-tooltip-container')
const fullscreenButton = playfulVideoPlayer.querySelector('.full-screen-button')
const fullscreenTooltip = playfulVideoPlayer.querySelector('.full-screen-tooltip')
const pipPlayerButton = playfulVideoPlayer.querySelector('.pip-button')
const pipTooltip = playfulVideoPlayer.querySelector('.pip-tooltip')

const timelineContainer = playfulVideoPlayer.querySelector('.timeline-container')
const timelineInner = playfulVideoPlayer.querySelector('.timeline')
const timelineProgressbar = playfulVideoPlayer.querySelector('.timeline__progressbar')

const videoInformationOverlay = playfulVideoPlayer.querySelector('.video-information-overlay')
const videoControlsContainer = playfulVideoPlayer.querySelector('.video-controls-container')
const videoControls = playfulVideoPlayer.querySelector('.controls')
const rightVideoControls = playfulVideoPlayer.querySelector('.right-side')
const seekingPreview = playfulVideoPlayer.querySelector('.seeking-preview')
const seekingThumbnail = playfulVideoPlayer.querySelector('.seeking-preview__thumbnail')
const videoThumbPreview = playfulVideoPlayer.querySelector('.video-thumb-preview')
const qualityBadgeContainer = playfulVideoPlayer.querySelector('.quality-badge')
const qualityBadgeText = playfulVideoPlayer.querySelector('.quality-badge .quality')
const AirPlayTooltip = playfulVideoPlayer.querySelector('.airplay-tooltip')
const AirPlayButton = playfulVideoPlayer.querySelector('.airplay-button')
const CastButton = playfulVideoPlayer.querySelector('.gcast-button')
const CastTooltip = playfulVideoPlayer.querySelector('.gcast-tooltip')

let orientationInfluence, videoPercent

const title =
    document
        .querySelector('meta[property="og:title"]')
        .getAttribute('content') ||
    decodeURIComponent(videoMetadata.Fallback_src.substring(videoMetadata.Fallback_src.lastIndexOf('/') + 1))
const author = document
    .querySelector('meta[property="og:author"]')
    .getAttribute('content')
const description = document
    .querySelector('meta[property="og:description"]')
    .getAttribute('content')

playfulVideoPlayerContainer.style.setProperty('--aspect-ratio-size', 16 / 9)
playfulVideoPlayerContainer.style.setProperty('--aspect-ratio-size-inverse', 9 / 16)

// Debounce and throttle
function debounce(cb, delay = 1000) {
    let timeout

    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}

function throttle(cb, delay = 1000) {
    let shouldWait = false
    let waitingArgs
    const timeoutFunc = () => {
        if (waitingArgs == null) {
            shouldWait = false
        } else {
            cb(...waitingArgs)
            waitingArgs = null
            setTimeout(timeoutFunc, delay)
        }
    }

    return (...args) => {
        if (shouldWait) {
            waitingArgs = args
            return
        }
        cb(...args)
        shouldWait = true

        setTimeout(timeoutFunc, delay)
    }
}

const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" fill="#02da9a" viewBox="0 0 616 174"><path d="M290 .051a43 43 0 0 0-4.92.041c-3.75.245-7.43.979-11 2.17-4.44 1.5-5.82 6.79-3.47 10.8 2.34 4.06 7.56 5.29 12.2 4.37 1.12-.223 2.26-.372 3.4-.447a26 26 0 0 1 11.7 1.93c3.69 1.53 6.97 3.88 9.6 6.88a25.75 25.75 0 0 1 2.08 2.72c2.61 3.9 7.16 6.72 11.7 5.5s7.29-5.93 5.21-10.1a43.06 43.06 0 0 0-6.21-9.29c-4.35-4.96-9.78-8.85-15.9-11.4a43 43 0 0 0-14.3-3.22zM7 19.851c-3.27-.257-6.49 2.26-6.49 5.99v62.2c0 4.98 5.72 7.79 9.66 4.75l40.4-31.1c3.12-2.4 3.12-7.11 0-9.51l-40.4-31.1A5.96 5.96 0 0 0 7 19.841zm382 9.41v62c-3.07-5.63-7.42-9.86-13.1-12.7-5.63-2.94-12-4.42-19-4.42-9.34 0-17.4 2.18-24.2 6.53-6.79 4.22-12 10.1-15.6 17.7-3.59 7.55-5.38 16.1-5.38 25.7 0 9.73 1.79 18.3 5.38 25.7 3.59 7.3 8.64 13.1 15.2 17.3 6.66 4.22 14.5 6.34 23.6 6.34 7.3 0 13.9-1.6 19.8-4.8 6.02-3.33 10.6-8.06 13.6-14.2l1.34 16.5h17.7v-142h-19.4zm-281 .695c-14.9 0-27 12.1-27 27s12.1 27 27 27 27-12.1 27-27-12.1-27-27-27zm181 .455c-3.46 0-6.46 1.22-9.02 3.65-2.43 2.43-3.65 5.38-3.65 8.83s1.22 6.4 3.65 8.83c2.56 2.43 5.57 3.65 9.02 3.65 3.33 0 6.21-1.22 8.64-3.65s3.65-5.38 3.65-8.83-1.22-6.4-3.65-8.83-5.31-3.65-8.64-3.65zm176 43.8c-9.09 0-17.2 2.11-24.2 6.34-6.91 4.22-12.4 10-16.3 17.5-3.84 7.42-5.76 16.1-5.76 25.9 0 9.73 1.98 18.3 5.95 25.7 4.1 7.42 9.66 13.2 16.7 17.5 7.17 4.22 15.4 6.34 24.6 6.34 11.8 0 21.5-2.82 29.2-8.45s12.6-13.5 14.8-23.6h-18c-1.41 5.12-4.36 9.09-8.83 11.9-4.36 2.69-9.98 4.03-16.9 4.03-9.34 0-16.5-2.94-21.5-8.83-4.24-5-6.68-11.9-7.32-20.6l72.4-.172v-6.72c0-9.47-1.86-17.7-5.57-24.8-3.58-7.04-8.77-12.5-15.6-16.3-6.66-3.84-14.5-5.76-23.6-5.76zm102 0c-9.47 0-18 2.11-25.5 6.34-7.43 4.22-13.3 10-17.7 17.5-4.22 7.42-6.34 16-6.34 25.7s2.11 18.3 6.34 25.7c4.35 7.42 10.2 13.2 17.7 17.5 7.55 4.22 16.1 6.34 25.5 6.34s17.9-2.11 25.3-6.34 13.2-10 17.5-17.5 6.34-16 6.34-25.7-2.11-18.3-6.34-25.7c-4.22-7.42-10-13.2-17.5-17.5s-15.9-6.34-25.3-6.34zm-393 2.69l37.8 94.1H231l39.4-94.1h-20.2l-20.2 50.1-2.88 7.94-1.72 4.93c-1.41 3.97-2.56 7.49-3.46 10.6-.64-2.82-1.66-6.21-3.07-10.2-1.28-4.1-2.82-8.51-4.61-13.2l-19.4-50.1h-20.9zm105 0v94.1h19.2v-94.1H279zm186 13.4c7.68 0 13.8 2.3 18.4 6.91 4.61 4.48 6.91 10.4 6.91 17.9h-52.8c.528-3.55 1.43-6.75 2.7-9.6 2.3-4.99 5.5-8.77 9.6-11.3 4.23-2.56 9.28-3.84 15.2-3.84zm-105 1.15c6.02 0 11.1 1.41 15.4 4.22 4.35 2.69 7.68 6.46 9.98 11.3 2.3 4.74 3.46 10.2 3.46 16.5s-1.15 11.8-3.46 16.7-5.63 8.71-9.98 11.5c-4.23 2.69-9.35 4.03-15.4 4.03s-11.2-1.34-15.6-4.03c-4.22-2.82-7.49-6.66-9.79-11.5-2.18-4.86-3.26-10.4-3.26-16.7 0-6.14 1.09-11.6 3.26-16.3 2.3-4.86 5.57-8.7 9.79-11.5 4.35-2.82 9.54-4.22 15.6-4.22zm207 .191c5.89 0 11 1.35 15.4 4.03 4.48 2.69 8 6.46 10.6 11.3 2.56 4.74 3.84 10.3 3.84 16.7 0 6.27-1.28 11.8-3.84 16.7s-6.08 8.7-10.6 11.5c-4.35 2.69-9.47 4.03-15.4 4.03s-11.1-1.34-15.6-4.03c-4.48-2.82-8-6.66-10.6-11.5-2.56-4.86-3.84-10.4-3.84-16.7 0-6.4 1.28-12 3.84-16.7 2.56-4.86 6.08-8.64 10.6-11.3s9.66-4.03 15.6-4.03zm-449 15a10.85 10.85 0 0 0-2.2.123c-5.94.94-9.81 6.6-10.7 12.5-.567 3.69-1.72 7.29-3.43 10.7-3.38 6.63-8.77 12-15.4 15.4a35.2 35.2 0 0 1-32.1-.08c-5.34-2.76-12.2-2.95-16.5 1.3h-.002c-4.25 4.25-4.29 11.2.689 14.6a57 57 0 0 0 23 9.08c11.9 1.88 24.1-.047 34.8-5.51a57 57 0 0 0 31.08-48.8c.178-5.26-4.16-9.04-9.22-9.27z"/></svg>'

const consoleWelcomeDebounce = debounce(() => {
    console.log(
        '%cPlayful Video%c\nRolling Progress Release',
        'background-image: url(data:image/svg+xml;base64,' + btoa(svg) +
        ');\n    display: inline-block;\n    padding: 2rem 12rem;\n    padding-right: 0px;\n    margin: 20px;\n    margin-left: 0px;\n    margin-bottom: 8px;\n    color: transparent;\n    text-align: center;\n    font-size: 0px;\n    background-size: contain;\n    background-position: center center;\n    background-repeat: no-repeat;\n    ',
        'font-family: Manrope, Arial, Helvetica, sans-serif;\n    display: block;\n    font-size: 1rem;\n    line-height: 130%;\n    margin: 4px 0px 16px 0px;\n    font-weight: 400;\n    font-kerning: normal;\n    color: currentColor;'
    )
    console.log(
        "%cThis is a browser feature intended for developers to debug the player. As this is a rolling release of a developing project, I'd encourage you to send a feedback to me once you discovered a bug not listed on the page (which you can by my Discord's username below).\n\nDiscord: %cHarole#1225\n%cWebsite (WIP): %chttps://preview.studio.site/live/4BqN8BM2Wr",
        'font-family: Inconsolata, monospace;\n    font-size: 1rem;\n    line-height: 130%;\n    font-weight: 400;\n    color: currentColor;\n    ',
        'font-family: Inconsolata, monospace;\n    font-size: 1rem;\n    line-height: 100%;\n    font-weight: 800;\n    color: currentColor;\n    border-bottom: 2px solid currentColor;\n    ',
        'font-family: Inconsolata, monospace;\n    font-size: 1rem;\n    line-height: 130%;\n    font-weight: 400;\n    color: currentColor;\n    ',
        'font-family: Inconsolata, monospace;\n    font-size: 1rem;\n    line-height: 100%;\n    font-weight: 800;\n    color: currentColor;\n    '
    )
}, 200)
consoleWelcomeDebounce()

function init() {
    if (video.hasAttribute('controls')) {
        videoControlsContainer.removeAttribute('hidden')
        videoInformationOverlay.removeAttribute('hidden')
        video.removeAttribute('controls')
    } else {
        videoControlsContainer.setAttribute('hidden', '')
        videoInformationOverlay.setAttribute('hidden', '')
        video.removeAttribute('controls')
    }

    playfulVideoPlayer.querySelector('#mosaic feMorphology.dilate').setAttribute('radius', (playfulVideoPlayer.querySelector('#mosaic feComposite.comp').getAttribute('width') / 2) - 1)
    playfulVideoPlayer.querySelector('#mosaic feComposite.comp').setAttribute('height', playfulVideoPlayer.querySelector('#mosaic feComposite.comp').getAttribute('width'))
}

init()

function canFullscreenEnabled() {
    if (document.fullscreenEnabled) {
        return document.fullscreenEnabled
    } else if (document.webkitFullscreenEnabled) {
        return document.webkitFullscreenEnabled
    } else if (document.mozFullscreenEnabled) {
        return document.mozFullscreenEnabled
    } else {
        return false
    }
}

window.addEventListener('DOMContentLoaded', () => {
    videoPoster.src = videoMetadata.video_poster
    /* if (!Hls.isSupported()) {
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
                    }; */
    source.setAttribute('src', videoMetadata.Fallback_src)
    source.setAttribute('type', videoMetadata.Fallback_codec)
    video.load()
    video.addEventListener('durationchange', updatetime)

    rangeEQInputs.forEach((element) => {
        element.disabled = true
        element.value = 0
    })

    if (!('pictureInPictureEnabled' in document)) {
        pipPlayerButton.parentElement.setAttribute('hidden', '')
    }

    if (canFullscreenEnabled == false) {
        fullscreenButton.parentElement.setAttribute('unsupported', '')
        fullscreenTooltip.setAttribute('data-tooltip-text', 'Full screen is unavailable')
    }

    // Disable features for mobile users
    const isMobile = /Mobi/.test(window.navigator.userAgent)
    if (isMobile) {
        volumeTooltipContainer.setAttribute('hidden', '')
    }

    if (
        navigator.userAgent.match(/Mac/) &&
        navigator.maxTouchPoints &&
        navigator.maxTouchPoints > 2
    ) {
        playfulVideoPlayer.dataset.device = 'iPadOS'
        volumeTooltipContainer.setAttribute('hidden', '')
    }
})
const srcEventListeners = [
    [
        'error',
        function () {
            let s = ''
            const err = source.error

            switch (err.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                    s += 'The user stopped loading the video.'
                    break

                case MediaError.MEDIA_ERR_NETWORK:
                    s += 'A network error occurred while fetching the video.'
                    break

                case MediaError.MEDIA_ERR_DECODE:
                    s += 'An error occurred while decoding the video.'
                    break

                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    s +=
                        'The video is missing or is in a format not supported by your browser.'
                    break

                default:
                    s += 'An unknown error occurred.'
                    break
            }

            const message = err.message
            if (message && message.length) s += message
            playfulVideoPlayer.querySelector('#error-log').innerText = err.code
            playfulVideoPlayer
                .querySelector('.error-dialog')
                .classList.add('error-occurred')
        }
    ]
]

for (const [action, event] of srcEventListeners) {
    try {
        source.addEventListener(action, event)
    } catch (error) {
        console.log(`The video event listener action "${action}" is unavailable.`)
    }
}

// Range slider track
function handleInputChange(e) {
    let target = e.target

    if (e.target.type !== 'range') target = rangeEQInputs

    const min = target.min
    const max = target.max
    const val = target.value
    const bg = ((val - min) * 100) / (max - min)
    return target.style.setProperty('--gradient',
        bg < 50
            ? `linear-gradient(-90deg, transparent 50%, var(--bright-accent-color) 50%, var(--accent-color) ${100 - bg}%, transparent ${100 - bg}%)`
            : `linear-gradient(90deg, transparent 50%, var(--accent-color) 50%, var(--bright-accent-color) ${bg}%, transparent ${bg}% )`
    )
}

// Context menu
function showContextMenu(show) {
    if (show === void 0) show = true
    return contextMenu.classList[show ? 'add' : 'remove']('show')
}

videoContainer.addEventListener('contextmenu', (e) => {
    if (
        !settingsButton.contains(e.target) &&
        !settingsContextMenu.contains(e.target) &&
        !transcriptPanel.contains(e.target)
    ) {
        settingsButton.classList.remove('pressed')
        settingsContextMenu.classList.remove('pressed')
        settingsTooltipContainer.setAttribute('data-tooltip', 'right')
        seekingPreview.removeAttribute('hidden')
        closedDialog(e.target)
    }

    if (contextMenu.classList.contains('show')) {
        showContextMenu(false)
    } else {
        e.preventDefault()
        const {
            x,
            y
        } = ctxmenuPosition(e)
        contextMenu.style.left = x + 'px'
        contextMenu.style.top = y + 'px'
        showContextMenu()
    }
})

function ctxmenuPosition(eventPos) {
    const menuOffset = 8
    const scope = playfulVideoPlayer
    let x = eventPos.offsetX + menuOffset
    let y = eventPos.offsetY + menuOffset
    const winWidth = scope.innerWidth
    const winHeight = scope.innerHeight
    const cmWidth = contextMenu.offsetWidth
    const cmHeight = contextMenu.offsetHeight

    if (x + cmWidth > winWidth - 8) {
        x = eventPos.offsetX - cmWidth
    }

    if (y + cmHeight > winHeight - 8) {
        y = winHeight - cmHeight - 8
    }

    return {
        x,
        y
    }
}

function closeSettingsMenu(e) {
    if (
        !settingsButton.contains(e.target) &&
        !settingsContextMenu.contains(e.target)
    ) {
        settingsButton.classList.remove('pressed')
        settingsContextMenu.classList.remove('pressed')
        settingsTooltipContainer.setAttribute('data-tooltip', 'right')
        seekingPreview.removeAttribute('hidden')
        closedDialog(e.target)
    }
}

document.addEventListener('click', (e) => {
    showContextMenu(false)
    if (
        !settingsButton.contains(e.target) &&
        !settingsContextMenu.contains(e.target) &&
        !transcriptPanel.contains(e.target)
    ) {
        settingsButton.classList.remove('pressed')
        settingsContextMenu.classList.remove('pressed')
        settingsTooltipContainer.setAttribute('data-tooltip', 'right')
        seekingPreview.removeAttribute('hidden')
        backPageSettingsFn()
    }
})

// Context menu items
eqItem.addEventListener('click', () => eqContainer.classList.add('opened'))
transcriptItem.addEventListener('click', () => {
    loadTranscript(
        playfulVideoPlayer.querySelector('#default-track').getAttribute('srclang')
    )
    playfulVideoPlayer.classList.add('transcript-opened')
})
aboutPlayerItem.addEventListener('click', () => aboutPlayerContainer.classList.add('opened'))

// Settings
settingsButton.addEventListener('click', () => {
    settingsButton.classList.toggle('pressed')
    settingsContextMenu.classList.toggle('pressed')

    backPageSettingsFn()
    if (
        settingsButton.classList.contains('pressed') &&
        settingsContextMenu.classList.contains('pressed')
    ) {
        seekingPreview.setAttribute('hidden', '')
        settingsTooltipContainer.setAttribute('data-tooltip', 'right')
    } else {
        settingsTooltipContainer.removeAttribute('data-tooltip')
        seekingPreview.removeAttribute('hidden')
    }
})

backPageSettings.addEventListener('click', backPageSettingsFn)

function backPageSettingsFn() {
    const oldContent = settingsContextMenu.querySelectorAll('.page')
    oldContent.forEach(element => {
        element.setAttribute('hidden', '')
    })
    const content = settingsContextMenu.querySelector('.front-page')
    content.removeAttribute('hidden')
}

// Settings items
function downloadFile(url, fileName) {
    fetch(url, {
        method: 'get',
        mode: 'no-cors',
        referrerPolicy: 'no-referrer'
    })
        .then((res) => res.blob())
        .then((res) => {
            const a = document.createElement('a')
            a.setAttribute('download', fileName)
            const href = URL.createObjectURL(res)
            a.href = href
            a.setAttribute('target', '_blank')
            a.click()
            URL.revokeObjectURL(href)
            a.remove()
        })
}

downloadItem.addEventListener('click', () => {
    downloadFile(
        videoMetadata.Fallback_src,
        `${title}.${videoMetadata.Fallback_codec.split('/')[1]}`
    )
    settingsButton.classList.remove('pressed')
    settingsContextMenu.classList.remove('pressed')
    settingsTooltipContainer.setAttribute('data-tooltip', 'right')
})

playbackSpeedItem.addEventListener('click', () => {
    const parent = playbackSpeedItem.parentElement.parentElement
    parent.setAttribute('hidden', '')
    const content = playfulVideoPlayer.querySelector('.playback-speed-settings')
    content.removeAttribute('hidden')
})

for (var i = 0; i < playbackSpeedItemControls.length; i++) {
    const dataSpeed = playbackSpeedItemControls[i].getAttribute('data-speed')
    playbackSpeedItemControls[i].classList.add(`speed__${dataSpeed}`)
    playbackSpeedItemControls[i].querySelector('.span:last-child').innerHTML = `${dataSpeed} &times;`
    video.playbackRate = playfulVideoPlayer.getAttribute('data-speed')

    playfulVideoPlayer.querySelector('.page.playback-speed-settings .item[data-speed="1"] .span:last-child').innerHTML = `(${playfulVideoPlayer.querySelector('.page.playback-speed-settings .item[data-speed="1"]').getAttribute('data-speed')} &times;)`
    playfulVideoPlayer.querySelector('.page.playback-speed-settings .item .span.normal-speed').innerText = 'Normal'

    playbackSpeedItem.querySelector('.span.current-speed').innerHTML = `${video.playbackRate} &times;`
    playfulVideoPlayer.querySelector(`.page.playback-speed-settings .item[data-speed="${playfulVideoPlayer.getAttribute('data-speed')}"]`).setAttribute('aria-checked', 'true')
};

playbackSpeedItemControls.forEach(element => {
    element.addEventListener('click', () => {
        playbackSpeedItemControls.forEach(element => {
            element.removeAttribute('aria-checked')
        })
        if (playfulVideoPlayer.querySelector('.page-contents.playback-speed-settings .item[class*="speed__"]')) {
            video.playbackRate = element.getAttribute('data-speed')
            playfulVideoPlayer.setAttribute('data-speed', video.playbackRate)
            playbackSpeedItem.querySelector('.span.current-speed').innerHTML = `${video.playbackRate} &times;`
            element.setAttribute('aria-checked', 'true')
            if (!element.getAttribute('data-speed') >= '1.25' && !element.getAttribute('data-speed') < playbackSpeedItemControls.lastChild.getAttribute('data-speed')) return timelineProgressbar.style.filter = 'none'
            timelineProgressbar.style.filter = `url(#${element.getAttribute('data-speed')}x-speed)`
        }
        backPageSettingsFn()
    })
})

// AudioContext
const ctx =
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext

if (ctx) {
    var context = new ctx()
} else {
    eqItem.setAttribute('unsupported', '')
}
const sourceNode = context.createMediaElementSource(video)
// EQ
const filters = [];
[30, 60, 125, 250, 500, 800, 1000, 2000, 4000, 8000, 16000].map(function (
    freq,
    i
) {
    const eq = context.createBiquadFilter()
    eq.frequency.value = freq
    eq.type = 'peaking'
    eq.gain.value = 0
    filters.push(eq)

    for (var i = 0; i < filters.length - 1; i++) {
        filters[i].connect(filters[i + 1])
    }
})
sourceNode.connect(context.destination)
filters[filters.length - 1].connect(context.destination)

function changeGain(sliderValue, nbFilter) {
    const value = parseFloat(sliderValue)
    filters[nbFilter].gain.value = value
}

// EQ dialog
EQswitchToggle.addEventListener('click', () => {
    if (EQswitchToggle.hasAttribute('aria-checked')) {
        EQswitchToggle.removeAttribute('aria-checked')
        eqContainer.querySelectorAll('.eq-slider').forEach((element) => {
            element.disabled = true
            sourceNode.disconnect(filters)
            sourceNode.connect(context.destination)
        })
    } else {
        EQswitchToggle.setAttribute('aria-checked', 'true')
        eqContainer.querySelectorAll('.eq-slider').forEach((element) => {
            element.disabled = false
            rangeEQInputs.forEach((input) => {
                input.addEventListener('input', e => handleInputChange(e))
            })
            sourceNode.connect(filters[0])
        })
    }
})

for (var i = 0; i < rangeEQInputs.length; i++) {
    rangeEQInputs[i].setAttribute('data-input', i)
}

rangeEQInputs.forEach(element => {
    element.addEventListener('input', () => {
        changeGain(element.value, element.getAttribute('data-input'))
    })
})

// Dialog
function closedDialog(e) {
    if (e.classList.contains('opened')) {
        e.classList.remove('opened')
    } else {

    }
}

dialogOverlay.forEach(element => {
    element.addEventListener('click', (e) => {
        closedDialog(e.target.parentElement)
    })
})

closeDialogBtn.forEach(element => {
    element.addEventListener('click', (e) => {
        closedDialog(e.target.parentElement.parentElement.parentElement)
    })
})

// Transcript Panel
closeTranscriptPanelBtn.addEventListener('pointerover', () => {
    videoContainer.classList.add('hovered')
    video.classList.remove('inactive')
    closeTranscriptPanelBtn.addEventListener('pointerleave', () => {
        videoContainer.classList.remove('hovered')
        video.classList.add('inactive')
    })
})
closeTranscriptPanelBtn.addEventListener('click', () => {
    playfulVideoPlayer.classList.remove('transcript-opened')
})

// Captions
const captions = video.textTracks[0]
captions.mode = 'hidden'
captionButton.addEventListener('click', toggleCaptions)

function toggleCaptions() {
    const isHidden = captions.mode === 'hidden'
    captions.mode = isHidden ? 'showing' : 'hidden'
    videoContainer.classList.toggle('caption', isHidden)
}

// Transcript
let tracks
let trackElements
const tracksURLs = []
trackElements = playfulVideoPlayer.querySelectorAll('track')

for (var i = 0; i < trackElements.length; i++) {
    const currentTrackElem = trackElements[i]
    tracksURLs[i] = currentTrackElem.src
}

tracks = video.textTracks

function loadTranscript(lang) {
    clearTranscriptDiv()
    disableAllTracks()
    playfulVideoPlayer.querySelector('.transcript-language').innerText = video
        .querySelector('track')
        .getAttribute('label')

    for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]
        const trackAsHtmlElement = trackElements[i]

        if (track.language === lang && track.kind !== 'chapters') {
            videoContainer.classList.contains('caption')
                ? track.mode = 'showing'
                : track.mode = 'hidden'
            trackAsHtmlElement.readyState === 2
                ? displayCues(track)
                : displayCuesAfterTrackLoaded(trackAsHtmlElement, track)
        }
    }
}

function displayCuesAfterTrackLoaded(trackElem, track) {
    trackElem.addEventListener('load', displayCues(track))
}

function disableAllTracks() {
    for (let i = 0; i < tracks.length; i++) tracks[i].mode = 'disabled'
}

function displayCues(track) {
    const cues = track.cues

    for (let i = 0, len = cues.length; i < len; i++) {
        const cue = cues[i]
        addCueListeners(cue)
        const voices = getVoices(cue.text)
        let transcriptText = ''
        if (voices.length > 0) {
            for (let j = 0; j < voices.length; j++) {
                transcriptText += voices[j].voice + ': ' + removeHTML(voices[j].text)
            }
        } else {
            transcriptText = cue.text
        }
        const clickableTranscriptText = `<div class="cue-container" start-time="${cue.startTime}" role="button" aria-pressed="false" tabindex="0"><div class="cue-time span">${formatDuration(cue.startTime)}</div><div class="cues span">${transcriptText}</div></div>`
        addToTranscript(clickableTranscriptText)
        cueContainers = playfulVideoPlayer.querySelectorAll('.cue-container')
    }
}

function getVoices(speech) {
    const voices = []
    let pos = speech.indexOf('<v')
    while (pos != -1) {
        endVoice = speech.indexOf('>')
        const voice = speech.substring(pos + 2, endVoice).trim()
        const endSpeech = speech.indexOf('</v>')
        const text = speech.substring(endVoice + 1, endSpeech)
        voices.push({
            voice,
            text
        })
        speech = speech.substring(endSpeech + 4)
        pos = speech.indexOf('<v')
    }
    return voices
}

function removeHTML(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerText || div.innerText || ''
}

function jumpToTranscript(time) {
    video.currentTime = time
    playfulVideoPlayer.querySelector('.cue-container').classList.remove('current')
    playfulVideoPlayer.querySelector(`.cue-container[start-time="${time}"]`).classList.add('current')
    timelineInner.style.setProperty('--progress-position', video.currentTime / video.duration)
}

function clearTranscriptDiv() {
    transcriptDiv.innerHTML = ''
}

function addToTranscript(htmlText) {
    transcriptDiv.innerHTML += htmlText
}

function addCueListeners(cue) {
    cue.addEventListener('enter', function () {
        const transcriptText = playfulVideoPlayer.querySelector(`.cue-container[start-time="${this.startTime}"]`)
        transcriptText.classList.add('current')
        transcriptText.parentElement.scrollTop =
            transcriptText.offsetTop - transcriptText.parentElement.offsetTop
    })
    cue.addEventListener('exit', function () {
        const transcriptText = playfulVideoPlayer.querySelector(`.cue-container[start-time="${this.startTime}"]`)
        transcriptText.classList.remove('current')
    })
}

transcriptDiv.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') { toggleBtn(e.target) }
})

transcriptDiv.addEventListener('click', (e) => {
    cueContainers.forEach(element => {
        if (element.contains(e.target)) jumpToTranscript(element.getAttribute('start-time'))
    })
})

function toggleBtn(e) {
    e.setAttribute(
        'aria-pressed',
        e.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'
    )
}

transcriptPanel.addEventListener('click', (e) => {
    showContextMenu(false)
    if (
        !settingsButton.contains(e.target) &&
        !settingsContextMenu.contains(e.target) &&
        !transcriptPanel.contains(e.target)
    ) {
        settingsButton.classList.remove('pressed')
        settingsContextMenu.classList.remove('pressed')
        settingsTooltipContainer.setAttribute('data-tooltip', 'right')
    }
})

transcriptPanel.addEventListener('contextmenu', (e) => closeSettingsMenu(e))
transcriptPanel.addEventListener('click', (e) => closeSettingsMenu(e))

// Loop function
function loopVideo() {
    if (!loopItem.hasAttribute('aria-checked')) {
        video.loop = true
        if (typeof video.loop === 'boolean') {
            video.loop = true
        } else {
            video.addEventListener(
                'ended',
                function () {
                    video.currentTime = 0
                    video.play()
                },
                false
            )
        }
        loopItem.setAttribute('aria-checked', 'true')
    } else {
        if (typeof video.loop === 'boolean') {
            video.loop = false
        } else {
            video.removeEventListener('ended',
                function () {
                    video.currentTime = 0
                    video.play()
                },
                false
            )
        }
        loopItem.removeAttribute('aria-checked')
    }
}

function checkElement() {
    if (video.loop === true) {
        loopItem.setAttribute('aria-checked', 'true')
    } else if (video.loop === false) {
        loopItem.removeAttribute('aria-checked')
    }

    if (video.hasAttribute('controls')) {
        videoControlsContainer.setAttribute('hidden', '')
        videoInformationOverlay.setAttribute('hidden', '')
        video.removeAttribute('controls')
    } else if (!video.hasAttribute('controls')) {
        videoControlsContainer.removeAttribute('hidden')
        videoInformationOverlay.removeAttribute('hidden')
    }
}

loopItem.addEventListener('click', loopVideo)

// Skip time
function skip(time) {
    video.currentTime += time;
    (currentTime.innerText = formatDuration(videoPercent * video.duration)),
        timelineInner.style.setProperty('--progress-position', video.currentTime / video.duration)
}

function skipPercent(time) {
    video.currentTime = video.duration * time;
    (currentTime.innerText = formatDuration(videoPercent * video.duration)),
        timelineInner.style.setProperty('--progress-position', video.currentTime / video.duration)
}

function frameSeeking(time) {
    video.currentTime += 1 / time;
    (currentTime.innerText = formatDuration(videoPercent * video.duration)),
        timelineInner.style.setProperty('--progress-position', video.currentTime / video.duration)
}

// Time divider animation
let divide
function intervalDivideWorker() {
    if (typeof (Worker) !== 'undefined') {
        if (typeof (divide) === 'undefined') {
            divide = new Worker('timeDivider.js')
        }
        divide.onmessage = function (e) {
            playfulVideoPlayer.querySelector('.divider-time').innerText = e.data
        }
    } else {
        playfulVideoPlayer.querySelector('.divider-time').innerText = '/'
    }
}

function stopIntervalDivideWorker() {
    if (typeof (Worker) === 'undefined') return
    divide.terminate()
    divide = undefined
}

(function () {
    const vendors = ['webkit', 'moz', 'ms', 'o']
    let vp = null
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame && !window.cancelAnimationFrame; x++) {
        vp = vendors[x]
        window.requestAnimationFrame = window.requestAnimationFrame || window[vp + 'RequestAnimationFrame']
        window.cancelAnimationFrame = window.cancelAnimationFrame || window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame']
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        let lastTime = 0
        window.requestAnimationFrame = function (callback, element) {
            const now = window.performance.now()
            const nextTime = Math.max(lastTime + 16, now)
            return setTimeout(function () { callback(lastTime = nextTime) }, nextTime - now)
        }
        window.cancelAnimationFrame = clearTimeout
    }
}())

// Activity check
let timeout = null

function activity() {
    clearTimeout(timeout)
    video.classList.remove('inactive')
    videoControlsContainer.classList.remove('inactive')
    videoContainer.classList.add('hovered')
    window.cancelAnimationFrame(updateMetadata)
    window.requestAnimationFrame(updatetime)
    if (
        videoContainer.classList.contains('hovered') &&
        !settingsContextMenu.classList.contains('pressed')
    ) {
        if (video.paused) {

        } else {
            timeout = setTimeout(function () {
                window.cancelAnimationFrame(updatetime)
                window.requestAnimationFrame(updateMetadata)
                videoContainer.classList.remove('hovered')
                videoControlsContainer.classList.add('inactive')
                video.classList.add('inactive')
            }, 3e3)
        }
    }
}

// Full screen and picture-in-picture
fullscreenButton.addEventListener('click', toggleFullScreen)
video.addEventListener('dblclick', toggleFullScreen)

function toggleFullScreen() {
    if (context.state === 'suspended') context.resume()
    if (!document.fullscreenElement ||
        !document.webkitIsFullScreen ||
        !document.mozIsFullScreen ||
        !document.msIsFullScreen) {
        if (playfulVideoPlayer.requestFullscreen) {
            playfulVideoPlayer.requestFullscreen()
        } else if (playfulVideoPlayer.webkitRequestFullScreen) {
            playfulVideoPlayer.webkitRequestFullScreen()
        } else if (video.webkitEnterFullScreen) {
            video.webkitEnterFullScreen()
        } else if (playfulVideoPlayer.mozRequestFullScreen) {
            playfulVideoPlayer.mozRequestFullScreen()
        } else if (playfulVideoPlayer.msRequestFullScreen) {
            playfulVideoPlayer.msRequestFullscreen()
        }
        fullscreenTooltip.setAttribute('data-tooltip-text', 'Exit full screen' + ' (f)')
    }
    if (document.fullscreenElement ||
        document.webkitIsFullScreen ||
        document.mozIsFullScreen ||
        document.msIsFullScreen) {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
        } else if (document.msRequestFullscreen) {
            document.msExitFullscreen()
        }
        fullscreenTooltip.setAttribute('data-tooltip-text', 'Full screen' + ' (f)')
    }
}

async function togglePIPPlayerMode() {
    try {
        if (document.pictureInPictureEnabled && !video.disablePictureInPicture) {
            if (
                videoContainer.classList.contains('pip-player') &&
                !video.pictureInPictureElement
            ) {
                await document.exitPictureInPicture()
                pipTooltip.setAttribute('data-tooltip-text', 'Picture in picture' + ' (i)')
            } else {
                await video.requestPictureInPicture()
                pipTooltip.setAttribute('data-tooltip-text', 'Exit picture in picture' + ' (i)')
            }
        } else {
            pipPlayerButton.setAttribute('unsupported', '')
            pipTooltip.setAttribute('data-tooltip-text', 'Picture in picture is unavailable.')
        }
    } catch (error) {
        console.error(error)
    }
}

function fullScreenToggleChange() {
    playfulVideoPlayer.classList.toggle('full-screen', document.fullscreenElement)
}

document.addEventListener('fullscreenchange', fullScreenToggleChange, false)
document.addEventListener('mozfullscreenchange', fullScreenToggleChange, false)
document.addEventListener('webkitfullscreenchange', fullScreenToggleChange, false)
document.addEventListener('msfullscreenchange', fullScreenToggleChange, false)

video.addEventListener('webkitenterfullscreen', () => {
    playfulVideoPlayer.classList.add('full-screen')
    fullscreenTooltip.setAttribute('data-tooltip-text', 'Exit full screen' + ' (f)')
})

video.addEventListener('webkitendfullscreen', () => {
    playfulVideoPlayer.classList.remove('full-screen')
    fullscreenTooltip.setAttribute('data-tooltip-text', 'Full screen' + ' (f)')
    if (!video.paused) video.play()
})

function togglePIPClass() {
    if (videoContainer.classList.contains('pip-player')) {
        videoContainer.classList.remove('pip-player')
        fullscreenTooltip.setAttribute('data-tooltip-text', 'Full screen' + ' (f)')
    } else {
        videoContainer.classList.add('pip-player')
        fullscreenTooltip.setAttribute('data-tooltip-text', 'Full screen is unavailable')
    }
}

video.addEventListener('enterpictureinpicture', togglePIPClass)
video.addEventListener('leavepictureinpicture', togglePIPClass)

pipPlayerButton.addEventListener('click', togglePIPPlayerMode)

// Volume control
let isVolumeScrubbing = false
volumeSliderContainer.addEventListener('pointermove', (e) => {
    handleVolumeUpdate(e)
    volumeSliderContainer.addEventListener('pointerleave', () => {
        volumeSliderContainer.releasePointerCapture(e.pointerId)
    })
    volumeSliderContainer.addEventListener('pointerdown', (e) => {
        volumeSliderContainer.setPointerCapture(e.pointerId)
        settingsButton.classList.remove('pressed')
        settingsContextMenu.classList.remove('pressed')
        settingsTooltipContainer.setAttribute('data-tooltip', 'right')
        seekingPreview.removeAttribute('hidden')
        showContextMenu(false)
        if (e.button === 0) volumeUpdate(e)
    })
    if (isVolumeScrubbing) {
        volumeUpdate(e)
    }
    volumeSliderContainer.addEventListener('pointerup', (e) => {
        volumeSliderContainer.releasePointerCapture(e.pointerId)
        if (isVolumeScrubbing) {
            volumeSliderContainer.releasePointerCapture(e.pointerId)
            volumeUpdate(e)
        }
    })
})

function volumeUpdate(e) {
    const rect = volumeSliderContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    isVolumeScrubbing = (e.buttons && 1) === 1
    volumeContainer.classList.toggle('scrubbing', isVolumeScrubbing)
    if (isVolumeScrubbing) {
        video.volume = percent
        video.muted = percent === 0
        volumeSliderContainer.style.setProperty('--volume-position', percent)
    }
    handleVolumeUpdate(e)
}

function handleVolumeUpdate(e) {
    const rect = volumeSliderContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    if (isVolumeScrubbing) {
        e.preventDefault()
        video.volume = percent
        video.muted = percent === 0
        volumeSliderContainer.style.setProperty('--volume-position', percent)
    }
}

volumeButton.addEventListener('click', toggleVolume)

function toggleVolume() {
    video.muted = !video.muted
    return volumeTooltipContainer.setAttribute('data-tooltip-text',
        video.muted
            ? 'Unmute (m)'
            : 'Mute (m)')
}

function volumeControlKeyboard(e, value) {
    let volumeLevel
    if (e.toLowerCase() === 'arrowup') {
        video.volume = Math.min(1, video.volume + value);
    }
    if (e.toLowerCase() === 'arrowdown') {
        video.volume = Math.max(0, video.volume - value);
    }
    volumeSliderContainer.style.setProperty('--volume-position', video.volume)
    if (video.muted || video.volume === 0) {
        volumeLevel = 'mute'
        volumeTooltipContainer.setAttribute('data-tooltip-text', 'Unmute' + ' (m)')
    } else if (video.volume >= 0.6) {
        volumeLevel = 'full'
        volumeTooltipContainer.setAttribute('data-tooltip-text', 'Mute' + ' (m)')
    } else if (video.volume >= 0.3) {
        volumeLevel = 'mid'
        volumeTooltipContainer.setAttribute('data-tooltip-text', 'Mute' + ' (m)')
    } else {
        volumeLevel = 'low'
        volumeTooltipContainer.setAttribute('data-tooltip-text', 'Mute' + ' (m)')
    }
    videoContainer.dataset.volumeLevel = volumeLevel
}

// Timeline
function seekingPreviewPosition(e) {
    let percent = 0
    const clientRect = timelineInner.getBoundingClientRect()

    const RectContainer = window.getComputedStyle(timelineContainer)
    const marginLeft = parseFloat(RectContainer.marginLeft)
    const marginRight = parseFloat(RectContainer.marginRight)

    if (e.target) {
        percent = (100 / clientRect.width) * (e.clientX - clientRect.left)
    } else if (seekingPreview.classList.contains('hovered')) {
        percent = parseFloat(seekingPreview.style.left, 10)
    }

    if (percent < 0) percent = 0
    if (percent > 100) percent = 100

    const seekRect = seekingPreview.getBoundingClientRect()
    const seekPos = `calc(${percent}% - ${(seekRect.width * (percent / 100)) / 2 + marginLeft * (1 - percent / 100)}px + ${(seekRect.width * (1 - percent / 100)) / 2 - (percent / 100) * marginRight}px + ${(marginLeft * 2) * (1 - percent / 100)}px)`
    seekingPreview.style.setProperty('--thumbnail-seek-position', seekPos)
}

timelineInner.addEventListener('pointermove', (e) => {
    seekingPreview.classList.add('hovered')
    videoControls.setAttribute('hidden', '')
    handleTimelineUpdate(e)
    timelineInner.addEventListener('pointerleave', () => {
        timelineInner.releasePointerCapture(e.pointerId)
        seekingPreview.classList.remove('hovered')
        videoControls.removeAttribute('hidden')
    })
    timelineInner.addEventListener('pointerdown', (e) => {
        timelineInner.setPointerCapture(e.pointerId)
        if (e.button === 0) {
            settingsButton.classList.remove('pressed')
            settingsContextMenu.classList.remove('pressed')
            settingsTooltipContainer.setAttribute('data-tooltip', 'right')
            seekingPreview.removeAttribute('hidden')
            showContextMenu(false)
            toggleScrubbing(e)
        }
    })
    if (isScrubbing) {
        videoControls.setAttribute('hidden', '')
    }
    timelineInner.addEventListener('pointerup', (e) => {
        timelineInner.releasePointerCapture(e.pointerId)

        if (isScrubbing) {
            toggleScrubbing(e)
            seekingPreview.classList.remove('hovered')
            videoControls.removeAttribute('hidden')
            videoContainer.classList.add('buffering-scrubbing')
        }
    })
})

let isScrubbing = false
let wasPaused

function toggleScrubbing(e) {
    const rect = timelineInner.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    isScrubbing = (e.buttons & 1) === 1
    videoContainer.classList.toggle('scrubbing', isScrubbing)
    if (isScrubbing) {
        wasPaused = video.paused
        video.pause()
    } else {
        video.currentTime = percent * video.duration
        if (!wasPaused) video.play()
    }

    handleTimelineUpdate(e)
}

function handleTimelineUpdate(e) {
    const rect = timelineInner.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width

    let seekTime = percent * video.duration
    timelineInner.style.setProperty('--preview-position', percent)
    timeTooltip.innerText = formatDuration(seekTime)

    const thumbPosition =
        (Math.trunc(percent * video.duration) / Math.trunc(video.duration)) * 100
    seekingThumbnail.style.backgroundPositionY = `${thumbPosition}%`
    seekingPreviewPosition(e)

    if (seekTime < 0) seekTime = 0
    if (seekTime > video.duration - 1) seekTime = video.duration - 1

    if (isScrubbing) {
        window.cancelAnimationFrame(updatetime)
        e.preventDefault()
        videoThumbPreview.style.backgroundPositionY = `${thumbPosition}%`
        timelineInner.style.setProperty('--progress-position', percent)
        timeTooltip.innerText = formatDuration(seekTime)
        currentTime.innerText = formatDuration(seekTime)
    }
}

// Load and update data
function loadedMetadata() {
    totalTime.innerText = formatDuration(video.duration)
    currentTime.innerText = formatDuration(video.currentTime)
}

async function updatetime() {
    videoPercent = video.currentTime / video.duration
    if (!video.paused && videoContainer.classList.contains('hovered')) {
        timelineInner.style.setProperty('--progress-position', videoPercent)
        window.requestAnimationFrame(updatetime)
    }
    window.cancelAnimationFrame(updatetime)
}

function updateMetadata() {
    const updateThrottleMetadata = throttle(() => {
        orientationInfluence = video.videoWidth / video.videoHeight || 16 / 9
        playfulVideoPlayerContainer.style.setProperty('--aspect-ratio-size', orientationInfluence)
        playfulVideoPlayerContainer.style.setProperty('--aspect-ratio-size-inverse', video.videoHeight / video.videoWidth || 9 / 16)
        qualityBadgeContainer.dataset.quality = qualityCheckShort(video.videoWidth, video.videoHeight)
        qualityBadgeText.innerText = qualityCheck(video.videoWidth, video.videoHeight)
    }, 1000)
    updateThrottleMetadata()
    window[videoContainer.classList.contains('hovered') ? 'cancelAnimationFrame' : 'requestAnimationFrame'](updateMetadata)
}

const leading0Formatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2
})

function formatDuration(time) {
    const seconds = Math.trunc(time % 60)
    const minutes = Math.trunc((time / 60) % 60)
    const hours = Math.trunc((time / 60 / 60) % 60)

    if (hours === 0) {
        return `${minutes}:${leading0Formatter.format(seconds)}`
    } else if (hours > 0) {
        return `${hours}:${leading0Formatter.format(minutes)}:${leading0Formatter.format(seconds)}`
    } else {
        return '0:00'
    }
}

function formatDurationARIA(time) {
    const seconds = Math.trunc(time % 60)
    const minutes = Math.trunc((time / 60) % 60)
    const hours = Math.trunc((time / 60 / 60) % 60)

    let secondsARIA = 0
    if (seconds < 1) secondsARIA = 'Less than a second'
    if (seconds === 1) secondsARIA = `${seconds} second`
    if (seconds > 1) secondsARIA = `${seconds} seconds`

    let minutesARIA = 0
    if (minutes <= 1) minutesARIA = `${minutes} minute`
    if (minutes > 1) minutesARIA = `${minutes} minutes`

    let hoursARIA = 0
    if (hours <= 1) hoursARIA = `${hours} hour`
    if (hours > 1) hoursARIA = `${hours} hours`

    if (minutes === 0) {
        return `${secondsARIA}`
    } else if (minutes > 0) {
        return `${minutesARIA} ${secondsARIA}`
    } else if (hours > 0) {
        return `${hoursARIA} ${minutesARIA} ${secondsARIA}`
    } else {
        return 'Less than a second'
    }
}

// Playback and Media Session
playpauseButton.addEventListener('click', togglePlay)
videoFit.addEventListener('click', togglePlay)

async function togglePlay() {
    if (video.currentTime === video.duration && video.paused) {
        if (contextMenu.classList.contains('show')) return
        if (settingsContextMenu.classList.contains('pressed')) return

        videoContainer.classList.remove('ended')
        video.currentTime = 0
    }
    if (context.state === 'suspended') context.resume()

    if (video.paused || video.ended) {
        await video.play()
    } else {
        await video.pause()
    }
}

const qualityLabels = [
    {
        label: '8K',
        size: 7860,
        length: 4320
    },
    {
        label: '6K',
        size: 6144,
        length: 3456
    },
    {
        label: '5K',
        size: 5120,
        length: 2880
    },
    {
        label: '4K',
        size: 3840,
        length: 2160
    },
    {
        label: 'QHD',
        size: 2560,
        length: 1440
    },
    {
        label: 'FHD',
        size: 1920,
        length: 1080
    },
    {
        label: 'HD',
        size: 1280,
        length: 720
    },
    {
        label: 'SD',
        size: 640,
        length: 360
    },
    {
        label: 'LD',
        size: 320,
        length: 180
    },
]

function qualityCheck(sizeWidth, sizeHeight) {
    if (!sizeWidth && !sizeHeight || sizeWidth < 0 && sizeHeight < 0) return 'N/A'
    let label
    sizeWidth >= sizeHeight
        ? label = qualityLabels.find((l) => l.size <= sizeWidth)
        : label = qualityLabels.find((l) => l.length <= sizeHeight)
    return label.label
}

const qualityLabelsShort = [
    {
        label: 'UHD',
        size: 3840,
        length: 2160
    },
    {
        label: 'QHD',
        size: 2560,
        length: 1440
    },
    {
        label: 'FHD',
        size: 1920,
        length: 1080
    },
    {
        label: 'HD',
        size: 1280,
        length: 720
    },
    {
        label: 'SD',
        size: 640,
        length: 360
    },
]

function qualityCheckShort(sizeWidth, sizeHeight) {
    if (!sizeWidth && !sizeHeight || sizeWidth < 0 && sizeHeight < 0) return 'N/A'
    let label
    sizeWidth >= sizeHeight
        ? label = qualityLabelsShort.find((l) => l.size <= sizeWidth)
        : label = qualityLabelsShort.find((l) => l.length <= sizeHeight)
    return label.label
}

function update_resolution() {
    var elm = document.getElementById("yourResolution");
    if (!elm)
        return;

    var w = screen.width;
    var h = screen.height;

    var minw = 1024;
    var minh = 768;
    var ref_year = 2015;
    var refer = document.referrer;
    if (refer.indexOf("small") != -1) {
        minw = 320;
        minh = 240;
        refer = "small";
    } else
        refer = "big";


    var res_names =
        [
            "320x240", "QVGA 4:3",
            "240x320", "QVGA 3:4",
            "320x396", "iPod 4:5",
            "480x320", "HVGA 3:2",
            "640x480", "VGA 4:3",
            "800x600", "SVGA 4:3",
            "800x480", "WVGA 5:3",
            "1024x768", "XGA 4:3",
            "1152x864", "XGA+ 4:3",
            "1280x1024", "SXGA 5:4",
            "1280x720", "720p 16:9",
            "1280x768", "WXGA 5:3",
            "1280x800", "WXGA 16:10",
            "1280x854", "3:2",
            "1280x960", "4:3",
            "1360x768", "WXGA 16:9",
            "1366x768", "WXGA 16:9",
            "1440x900", "WXGA+ 16:10",
            "1400x1050", "SXGA+ 4:3",
            "1600x1200", "UXGA 4:3",
            "1680x1050", "WSXGA+ 16:10",
            "1920x1080", "FHD 16:9",
            "1920x1200", "WUXGA 16:10",
            "2048x1152", "QWXGA 16:9",
            "2560x1080", "Unnamed 21:9",
            "2560x1440", "WQHD 16:9",
            "2560x1600", "WQXGA 16:10",
            "3200x1800", "WQXGA+ 16:9",
            "3440x1440", "UWQHD 21:9",
            "3840x2160", "UHD 16:9",
            "5120x2880", "UHD+ 16:9"
        ];

    if (w && h) {
        var res = w + "x" + h;
        var longres = res;
        var comment = "";
        var common = 0;
        for (i = 0; i < res_names.length; i += 2) {
            if (res_names[i] == res) {
                if (res_desc[res])
                    comment = res_desc[res] + " (" + resmsg_as_of(ref_year) + ')';
                else
                    comment = '';
                longres = "<b>" + res + "</b> &nbsp; (" + res_names[i + 1] + ")";
                common = 1;
                break;
            }
        }
    } else {
        elm.innerHTML = res_msg["unknown"];
    }
}

function updatePositionState() {
    navigator.mediaSession.setPositionState({
        duration: video.duration,
        playbackRate: video.playbackRate,
        position: video.currentTime
    })
}

function bufferedLength(e) {
    const buffers = e.buffered
    let buffered = 0
    for (let i = 0; i < buffers.length; i++) {
        buffered = buffers.end(i) - buffers.start(i)
    }
    return buffered
}

async function mediaSessionToggle() {
    try {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title,
                artist: author,
                artwork: [{
                    src: `${mediaSessionMetadata.thumb_96}`,
                    sizes: '96x96',
                    type: mediaSessionMetadata.type
                },
                {
                    src: `${mediaSessionMetadata.thumb_128}`,
                    sizes: '128x128',
                    type: mediaSessionMetadata.type
                },
                {
                    src: `${mediaSessionMetadata.thumb_192}`,
                    sizes: '192x192',
                    type: mediaSessionMetadata.type
                },
                {
                    src: `${mediaSessionMetadata.thumb_256}`,
                    sizes: '256x256',
                    type: mediaSessionMetadata.type
                },
                {
                    src: `${mediaSessionMetadata.thumb_384}`,
                    sizes: '384x384',
                    type: mediaSessionMetadata.type
                },
                {
                    src: `${mediaSessionMetadata.thumb_512}`,
                    sizes: '512x512',
                    type: mediaSessionMetadata.type
                }
                ]
            })
        }
    } catch (error) {
        console.error(error)
    }

    const actionHandlers = [
        [
            'play',
            async function () {
                if (video.paused) await togglePlay()
            }
        ],
        [
            'pause',
            async function () {
                if (!video.paused) await togglePlay()
            }
        ],
        [
            'stop',
            function () {
                if (!video.paused) togglePlay()
                video.currentTime = 0
            }
        ],
        [
            'seekbackward',
            (d) => {
                video.currentTime -= d.seekOffset || 10
                timelineInner.style.setProperty('--progress-position', video.currentTime / video.duration)
                currentTime.innerText = formatDuration(video.currentTime)
            }
        ],
        [
            'seekforward',
            (d) => {
                video.currentTime += d.seekOffset || 10
                timelineInner.style.setProperty('--progress-position', video.currentTime / video.duration)
                currentTime.innerText = formatDuration(video.currentTime)
            }
        ],
        [
            'seekto',
            (d) => {
                if (d.fastSeek && 'fastSeek' in video) {
                    video.fastSeek(d.seekTime)
                    return
                }
                video.currentTime = d.seekTime
            }
        ]
    ]

    for (const [action, handler] of actionHandlers) {
        try {
            navigator.mediaSession.setActionHandler(action, handler)
            updatetime()
            updatePositionState()
        } catch (error) {
            console.log(`The media session action "${action}" is unavailable.`)
        }
    }
}

if (window.WebKitPlaybackTargetAvailabilityEvent) {
    video.addEventListener(
        'webkitplaybacktargetavailabilitychanged',
        function (e) {
            switch (e.availability) {
                case 'available':
                    video.setAttribute('x-webkit-airplay', 'allow')
                    AirPlayTooltip.removeAttribute('hidden')
                    break

                default:
                    AirPlayTooltip.setAttribute('hidden', '')
                    break
            }

            AirPlayButton.addEventListener('click', function () {
                if ('mediaSession' in navigator) mediaSessionToggle()
                video.webkitShowPlaybackTargetPicker()
            })
        }
    )
} else {
    AirPlayTooltip.setAttribute('hidden', '')
}

if (window.chrome && !window.chrome.cast && video.readyState > 0) {
    window.__onGCastApiAvailable = function (isAvailable) {
        if (isAvailable) {
            initializeCastApi()
        } else {
            return false
        }
    }

    initializeCastApi = function () {
        cast.framework.CastContext.getInstance().setOptions({
            autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
            receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
            resumeSavedSession: false,
            androidReceiverCompatible: true
        })
    }

    function mimeType() {
        if ((video.currentSrc = videoMetadata.HLS_src)) {
            return videoMetadata.HLS_codec
        } else if ((video.currentSrc = videoMetadata.Fallback_src)) {
            return videoMetadata.Fallback_codec
        } else {

        }
    }

    const castSession =
        cast.framework.CastContext.getInstance().getCurrentSession()
    const mediaInfo = new chrome.cast.media.MediaInfo(video.currentSrc, mimeType)

    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata()
    mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED
    mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC
    mediaInfo.metadata.title = title
    mediaInfo.metadata.subtitle = author
    mediaInfo.duration = video.duration

    const request = new chrome.cast.media.LoadRequest(mediaInfo)
    request.autoplay = true
    request.currentTime = startTime

    var textTrackStyle = new chrome.cast.media.TextTrackStyle()
    const tracksInfoRequest = new chrome.cast.media.EditTracksInfoRequest(
        textTrackStyle
    )
    media.editTracksInfo(tracksInfoRequest, successCallback, errorCallback)
    var textTrackStyle = new chrome.cast.media.TextTrackStyle()
    textTrackStyle.foregroundColor = '#FFFFFF'
    textTrackStyle.backgroundColor = '#00000099'
    textTrackStyle.fontStyle = 'NORMAL'

    castSession.loadMedia(request).then(
        function () {
            console.log('Load succeed')
        },
        function (errorCode) {
            console.log('Error code: ' + errorCode)
        }
    )

    let sessionId

    function rejoinCastSession() {
        chrome.cast.requestSessionById(sessionId)
    }
    CastButton.addEventListener('click', function () {
        if ('mediaSession' in navigator) mediaSessionToggle()
        if (sessionId == null) {
            const castSession =
                cast.framework.CastContext.getInstance().getCurrentSession()
            if (castSession) {
                const mediaInfo = createMediaInfo()
                const request = new chrome.cast.media.LoadRequest(mediaInfo)
                castSession.loadMedia(request)

                sessionId = CastSession.getSessionId()
            } else {
                console.log('Error: Attempting to play media without a Cast Session')
            }
        } else {
            rejoinCastSession()
        }
    })

    const player = new cast.framework.RemotePlayer()
    const playerController = new cast.framework.RemotePlayerController(player)

    function changeVolume(newVolume) {
        player.volumeLevel = newVolume
        playerController.setVolume()
    }

    playerController.addEventListener(
        cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
        function () {
            const session =
                cast.framework.CastContext.getInstance().getCurrentSession()

            if (!session) {
                return
            }

            const mediaStatus = session.getMediaSession()
            if (!mediaStatus) {
                return
            }

            const mediaInfo = mediaStatus.media
        }
    )

    var context = cast.framework.CastContext.getInstance()
    context.addEventListener(cast.framework, function (e) {
        switch (e.castState) {
            case cast.framework.SessionState.NO_DEVICES_AVAILABLE:
                CastTooltip.setAttribute('hidden', '')
                break
            case cast.framework.SessionState.NOT_CONNECTED:
                CastTooltip.removeAttribute('hidden')
                break
            case cast.framework.SessionState.CONNECTED:
                videoContainer.classList.add('casted-session')
                break
        }
    })
    context.addEventListener(
        cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
        function (e) {
            switch (e.sessionState) {
                case cast.framework.SessionState.SESSION_STARTED:
                case cast.framework.SessionState.SESSION_RESUMED:
                    break
                case cast.framework.SessionState.SESSION_ENDED:
                    videoContainer.classList.remove('casted-session')
                    break
            }
        }
    )

    playerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        function () {
            if (!player.isConnected) {
                console.log('RemotePlayerController: Player disconnected')
            }
        }
    )

    function stopCasting() {
        const castSession =
            cast.framework.CastContext.getInstance().getCurrentSession()
        castSession.endSession(true)
    }
}

// Keyboard shortcuts
playfulVideoPlayer.addEventListener('keydown', (e) => {
    const tagName = document.activeElement.tagName.toLowerCase()

    if (tagName === 'input') return
    if (
        e.getModifierState('Fn') ||
        e.getModifierState('Hyper') ||
        e.getModifierState('OS') ||
        e.getModifierState('Super') ||
        e.getModifierState('Win')
    ) {

    } else if (
        e.getModifierState('Control') +
        e.getModifierState('Alt') +
        e.getModifierState('Meta') >
        1
    ) {

    } else {
        function checkActive() {
            videoContainer.classList.add('hovered')
            activity()
        }
        switch (e.key.toLowerCase()) {
            case '':
                if (tagName === 'button') break
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                checkActive()
                skipPercent(e.key / 10)
                break
            case 'home':
            case 'end':
                videoContainer.classList.add('seeking')
                if (e.key === 'home') video.currentTime = 0
                if (e.key === 'end') video.currentTime = video.duration
                checkActive()
                break
            case 'k':
            case ' ':
                checkActive()
                e.preventDefault()
                togglePlay()
                break
            case 'f':
                if (fullscreenButton.hasAttribute('unsupported')) break
                checkActive()
                toggleFullScreen()
                break
            case 'c':
                checkActive()
                toggleCaptions()
                break
            case 'i':
                if (pipPlayerButton.hasAttribute('unsupported')) break
                checkActive()
                togglePIPPlayerMode()
                break
            case 'm':
                checkActive()
                toggleVolume()
                break
            case 'arrowleft':
            case 'arrowright':
                videoContainer.classList.add('seeking')
                if (e.key.toLowerCase() === 'arrowleft') skip(-5)
                if (e.key.toLowerCase() === 'arrowright') skip(5)
                checkActive()
                break
            case 'arrowup':
            case 'arrowdown':
                e.preventDefault()
                volumeControlKeyboard(e.key, 0.1)
                checkActive()
                break;
            case 'j':
            case 'l':
                videoContainer.classList.add('seeking')
                if (e.key.toLowerCase() === 'j') skip(-10)
                if (e.key.toLowerCase() === 'l') skip(10)
                checkActive()
                break
            case ',':
            case '.':
                videoContainer.classList.add('seeking')
                if (e.key === ',') frameSeeking(`-${videoMetadata.video_FPS}`)
                if (e.key === '.') frameSeeking(videoMetadata.video_FPS)
                checkActive()
                break
        }
    }
})

const isURL = str => {
    try {
        return Boolean(new URL(`https://${str}`))
    } catch (e) {
        return false
    }
}

const eventListeners = [
    [
        'play',
        () => {
            videoContainer.classList.add('played')
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'playing'
                video.addEventListener('timeupdate', mediaSessionToggle())
            }
            playpauseTooltipContainer.setAttribute('data-tooltip-text', 'Pause' + ' (k)')
            intervalDivideWorker()
            if (Hls.isSupported() && video.currentTime === 0) hls.startLoad()
            window.requestAnimationFrame(updateMetadata)
            videoContainer.addEventListener('pointerover', () => {
                activity()
                checkElement()
                if (videoContainer.classList.contains('hovered')) { window.cancelAnimationFrame(updateMetadata) }
            })
            videoContainer.addEventListener('pointermove', () => {
                activity()
                checkElement()
                if (videoContainer.classList.contains('hovered')) { window.cancelAnimationFrame(updateMetadata) }
            })
            videoContainer.addEventListener('pointerleave', () => {
                if (settingsContextMenu.classList.contains('pressed')) return
                videoContainer.classList.remove('hovered')
                video.classList.add('inactive')
                window.cancelAnimationFrame(updatetime)
                window.requestAnimationFrame(updateMetadata)
            })
            videoContainer.classList.remove('paused')

            if (playfulVideoPlayer.querySelector('.video-container').classList.contains('played')) {
                playfulVideoPlayer.querySelectorAll('.right-side button svg, .video-container:not(.caption) .caption-button svg, .video-container:not(.pip-player) .pip-button svg, .video-container:not(.casted-session) .gcast-button svg').forEach(element => {
                    element.style.animationDelay = 'calc(var(--animation-order) * 64ms)'
                    element.style.animationPlayState = 'running'
                    element.style.opacity = 1
                })
                playfulVideoPlayer.querySelector('.right-side button svg:last-child').addEventListener('animationend', () => {
                    setTimeout(() => {
                        rightVideoControls.querySelectorAll('button svg').forEach(element => {
                            element.style.animationDelay = '0s'
                        })
                    }, parseFloat(window.getComputedStyle(rightVideoControls.lastChild.parentElement.querySelector('svg')).animationDelay) * 15000)
                })
            }
        }
    ],
    [
        'pause',
        () => {
            stopIntervalDivideWorker()
            videoContainer.addEventListener('pointerleave', () => {
                window.cancelAnimationFrame(updatetime)
                window.cancelAnimationFrame(updateMetadata)
            })
            if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused'
            playpauseTooltipContainer.setAttribute('data-tooltip-text', 'Play' + ' (k)')
            video.classList.remove('inactive')
            clearTimeout(timeout)
            videoContainer.classList.add('paused')
        }
    ],
    [
        'ended',
        () => {
            videoContainer.classList.add('ended')
        }
    ],
    [
        'progress',
        () => {
            if (video.buffered.length > 0) {
                timelineInner.style.setProperty(
                    '--buffered-position',
                    bufferedLength(video) / video.duration
                )
            }
        }
    ],
    [
        'canplay',
        () => {
            if (video.buffered.length > 0) {
                timelineInner.style.setProperty(
                    '--buffered-position',
                    bufferedLength(video) / video.duration
                )
            }
        }
    ],
    [
        'waiting',
        () => {
            videoContainer.classList.add('buffering')
        }
    ],
    [
        'playing',
        () => {
            videoContainer.classList.remove('buffering')
            videoControls.removeAttribute('hidden')
        }
    ],
    [
        'seeking',
        () => {
            currentTime.innerText = formatDuration(video.currentTime)
        }
    ],
    [
        'seeked',
        () => {
            window.requestAnimationFrame(updatetime)
            videoContainer.classList.add('played')
            videoContainer.classList.remove('seeking')
            seekingPreview.classList.remove('loading')
            videoContainer.classList.remove('buffering-scrubbing')
            updatetime()
            currentTime.innerText = formatDuration(video.currentTime)
        }
    ],
    [
        'timeupdate',
        () => {
            currentTime.innerText = formatDuration(video.currentTime)
            durationContainer.setAttribute(
                'aria-label',
                `${formatDurationARIA(
                    video.currentTime
                )} elapsed of ${formatDurationARIA(video.duration)}`
            )
            videoPercent = video.currentTime / video.duration
            if (video.currentTime >= video.duration - 1) timelineInner.style.setProperty('--progress-position', video.currentTime / video.duration)
            videoContainer.classList[video.currentTime === video.duration ? 'add' : 'remove']('ended')
        }
    ],
    [
        'loadstart',
        () => {
            playfulVideoPlayerContainer.classList.remove('preload')
        }
    ],
    [
        'loadedmetadata',
        () => {
            videoPercent = video.currentTime / video.duration
            playfulVideoPlayer.classList.remove('loading')
            video.textTracks[0].mode = 'hidden'
            if (isURL(videoMetadata.video_thumbs) === false) {
                seekingThumbnail.setAttribute('hidden', '')
            }
            seekingThumbnail.style.backgroundImage = `url("${videoMetadata.video_thumbs}")`
            videoThumbPreview.style.backgroundImage = `url("${videoMetadata.video_thumbs}")`
            durationContainer.setAttribute(
                'aria-label',
                `${formatDurationARIA(
                    video.currentTime
                )} elapsed of ${formatDurationARIA(video.duration)}`
            )

            orientationInfluence = video.videoWidth / video.videoHeight || 16 / 9

            if (video.videoWidth > video.videoHeight) playfulVideoPlayerContainer.setAttribute('aria-orientation', 'landscape')
            if (video.videoWidth < video.videoHeight) playfulVideoPlayerContainer.setAttribute('aria-orientation', 'portait')

            qualityBadgeContainer.dataset.quality = qualityCheckShort(video.videoWidth, video.videoHeight)
            qualityBadgeText.innerText = qualityCheck(video.videoWidth, video.videoHeight)

            playfulVideoPlayerContainer.style.setProperty(
                '--aspect-ratio-size',
                orientationInfluence
            )
            playfulVideoPlayerContainer.style.setProperty(
                '--aspect-ratio-size-inverse',
                video.videoHeight / video.videoWidth || 9 / 16
            )
            loadedMetadata()

            if (!playfulVideoPlayer.querySelector('.video-container').classList.contains('played')) {
                playfulVideoPlayer.querySelectorAll('.right-side button svg, .video-container:not(.caption) .caption-button svg, .video-container:not(.pip-player) .pip-button svg, .video-container:not(.casted-session) .gcast-button svg').forEach(element => {
                    element.style.animationDelay = 'calc(var(--animation-order) * 64ms)'
                    element.style.animationPlayState = 'running'
                    element.style.webkitAnimationPlayState = 'running'
                    element.style.mozAnimationPlayState = 'running'
                    element.style.oAnimationPlayState = 'running'
                    element.style.opacity = 1
                })
                playfulVideoPlayer.querySelector('.right-side button svg:last-child').addEventListener('animationend', () => {
                    setTimeout(() => {
                        rightVideoControls.querySelectorAll('button svg').forEach(element => {
                            element.style.animationDelay = '0s'
                        })
                    }, parseFloat(window.getComputedStyle(rightVideoControls.lastChild.parentElement.querySelector('svg')).animationDelay) * 15000)
                })
            }
        }
    ],
    [
        'volumechange',
        () => {
            let volumeLevel
            if (video.muted || video.volume === 0) {
                volumeLevel = 'mute'
                volumeTooltipContainer.setAttribute('data-tooltip-text', 'Unmute' + ' (m)')
            } else if (video.volume >= 0.6) {
                volumeLevel = 'full'
                volumeTooltipContainer.setAttribute('data-tooltip-text', 'Mute' + ' (m)')
            } else if (video.volume >= 0.3) {
                volumeLevel = 'mid'
                volumeTooltipContainer.setAttribute('data-tooltip-text', 'Mute' + ' (m)')
            } else {
                volumeLevel = 'low'
                volumeTooltipContainer.setAttribute('data-tooltip-text', 'Mute' + ' (m)')
            }
            videoContainer.dataset.volumeLevel = volumeLevel
        }
    ]
]

for (const [action, event] of eventListeners) {
    try {
        video.addEventListener(action, event)
    } catch (error) {
        console.log(`The video event listener action "${action}" is unavailable.`)
    }
}
