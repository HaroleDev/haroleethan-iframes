import '//cdn.jsdelivr.net/npm/core-js-bundle@latest/index.min.js'
import { cleanHTML } from './utils/html-cleanser.min.js'
import metaVideo from './metadata.config.js'
import { debounce, throttle } from './utils/debounceAndThrottle.js'
import consoleLog from './utils/consoleLog.js'
import './utils/reqAnimFrameWhenPageVisible.js'

const deviceMem = 'deviceMemory' in navigator && navigator.deviceMemory
const isMotionReduced = () => window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true || false
const isLowEnd = deviceMem < 4 ? true : false
function loadScript(url) {
    return new Promise(function (resolve) {
        const script = document.createElement('script')
        script.src = url
        script.defer = true

        script.addEventListener('load', resolve(true))

        document.body.appendChild(script)
    })
}

function waterfall(promises) {
    return promises.reduce(
        function (p, c) {
            return p.then(function () {
                return c.then(function () {
                    return true
                })
            })
        },
        Promise.resolve([])
    )
}

function loadScriptsInOrder(arrayOfJS) {
    const promises = arrayOfJS.map(function (url) {
        return loadScript(url)
    })
    return waterfall(promises)
}

const generateUUID = () => {
    let
        d = new Date().getTime(),
        d2 = (performance && performance.now && (performance.now() * 1000)) || 0
    return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, c => {
        let r = Math.random() * 16
        if (d > 0) {
            r = (d + r) % 16 | 0
            d = Math.floor(d / 16)
        } else {
            r = (d2 + r) % 16 | 0
            d2 = Math.floor(d2 / 16)
        }
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16)
    })
}

var HLSconfig = {
    startPosition: -1,
    debug: true,
    backBufferLength: 90,
    enableWorker: true,
    enableWebVTT: true,
    enableWorker: false,
    minAutoBitrate: 1000,
    maxBufferHole: 1,
}

var HLSOptimalconfig = {
    abrEwmaDefaultEstimate: Number(metaVideo.videoSettings.bandwidth_default_estimate),
    lowLatencyMode: true,
    liveSyncDurationCount: Number(metaVideo.videoMetadata.delay_compensation),
    liveMaxLatencyDurationCount: Number(metaVideo.videoMetadata.live_interval),
    maxLiveSyncPlaybackRate: {
        default: 1,
        min: 0.25,
        max: 4,
    },
    maxBufferSize: Number(metaVideo.videoSettings.bandwidth_default_estimate / 1000 / metaVideo.videoSettings.fragment_duration),
}

var pfvConfiguration = Object.assign({}, HLSconfig, HLSOptimalconfig)

const PLAY_BUTTON_KEY = 'k',
    FULLSCREEN_BUTTON_KEY = 'f',
    PICTUREINPICTURE_TOGGLE_KEY = 'i',
    MUTE_TOGGLE_KEY = 'm',
    SUBTITLES_CLOSEDCAPTION_TOGGLE_KEY = 'c'

const hls = new Hls(pfvConfiguration)

const FRAMES_PER_SECOND = metaVideo.videoMetadata.video_FPS || 30

const playfulVideoPlayerContainer = document.querySelector('.playful-video-player-container')
const playfulVideoPlayer = playfulVideoPlayerContainer.querySelector('.playful-video-player')
const playfulVideoPlayerAspectRatio = playfulVideoPlayerContainer.querySelector('.playful-video-player-aspect-ratio')

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
const liveContainer = playfulVideoPlayer.querySelector('.live-container')
const timeTooltip = playfulVideoPlayer.querySelector('.seeking-preview__time-tooltip')

const EQswitchToggle = playfulVideoPlayer.querySelector('.eq-switch')
const rangeEQInputs = playfulVideoPlayer.querySelectorAll('.dialog .eq-control input')
const eqContainer = playfulVideoPlayer.querySelector('.eq-dialog-container')
const loopItem = playfulVideoPlayer.querySelectorAll('.loop-item')
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
const qualityItem = playfulVideoPlayer.querySelector('.quality-item')
const transcriptItem = playfulVideoPlayer.querySelector('.transcript-item')
const backPageSettings = playfulVideoPlayer.querySelectorAll('.back-page')

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
const qualityBadgeContainer = playfulVideoPlayer.querySelector('[pfv-badge="quality"]')
const qualityBadgeText = playfulVideoPlayer.querySelector('[pfv-badge="quality"] .quality')
const AirPlayTooltip = playfulVideoPlayer.querySelector('.airplay-tooltip')
const AirPlayButton = playfulVideoPlayer.querySelector('.airplay-button')
const CastButton = playfulVideoPlayer.querySelector('.gcast-button')
const CastTooltip = playfulVideoPlayer.querySelector('.gcast-tooltip')

let orientationInfluence, videoPercent

const title = document.querySelector('meta[property="og:title"]') ? document.querySelector('meta[property="og:title"]').getAttribute('content') : null
const author = document.querySelector('meta[property="og:author"]') ? document.querySelector('meta[property="og:author"]').getAttribute('content') : null
const description = document
    .querySelector('meta[property="og:description"]')
    .getAttribute('content')

consoleLog()

function init() {
    if (video.hasAttribute('controls')) {
        videoControlsContainer.removeAttribute('hidden')
        if (!title && !author) {
            videoInformationOverlay.setAttribute('hidden', '')
        } else {
            videoInformationOverlay.removeAttribute('hidden')
        }
        video.removeAttribute('controls')
    } else {
        videoControlsContainer.setAttribute('hidden', '')
        videoInformationOverlay.setAttribute('hidden', '')
        video.removeAttribute('controls')
    }

    playfulVideoPlayer.querySelector('#mosaic feMorphology.dilate').setAttribute('radius',
        (playfulVideoPlayer.querySelector('#mosaic feComposite.comp').getAttribute('width') / 2) - 1)

    playfulVideoPlayer.querySelector('#mosaic feComposite.comp').setAttribute('height',
        playfulVideoPlayer.querySelector('#mosaic feComposite.comp').getAttribute('width'))
}

init()

function canFullscreenEnabled() {
    return document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullscreenEnabled ||
        document.msFullscreenEnabled ||
        false
}

const isiPadOSSafari = () => {
    window.AuthenticatorAssertionResponse === undefined
        && window.AuthenticatorAttestationResponse === undefined
        && window.AuthenticatorResponse === undefined
        && window.Credential === undefined
        && window.CredentialsContainer === undefined
        && window.DeviceMotionEvent !== undefined
        && window.DeviceOrientationEvent !== undefined
        && navigator.maxTouchPoints === 5
        && navigator.platform !== "iPhone" ||

        (navigator.userAgent.match(/Mac/) || navigator.platform === 'MacIntel') &&
        navigator.maxTouchPoints &&
        navigator.maxTouchPoints > 2
}

window.addEventListener('DOMContentLoaded', () => {
    if (typeof window != 'object' && typeof document != 'object') return
    if (window.chrome && !window.chrome.cast) loadScriptsInOrder(['//gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'])
    videoPoster.src = metaVideo.videoMetadata.video_poster
    if (metaVideo.videoMetadata.is_live === true && ((video.canPlayType('application/x-mpegURL') || video.canPlayType('application/vnd.apple.mpegURL') || Hls.isSupported()))) {
        playfulVideoPlayer.setAttribute('pfv-live-stream', 'true')
        durationContainer.setAttribute('hidden', '')
        liveContainer.removeAttribute('hidden')
        videoThumbPreview.setAttribute('hidden', '')
    } else {
        playfulVideoPlayer.setAttribute('pfv-live-stream', 'false')
    }

    if (!Hls.isSupported()) {
        //For HLS container
        hls.attachMedia(video)
        hls.loadSource(metaVideo.videoMetadata.HLS_src)
        video.setAttribute('type', metaVideo.videoMetadata.HLS_codec)
        hls.on(Hls.Events.MANIFEST_LOADED, function () {
            loadedMetadata()
        })
        playfulVideoPlayer.querySelectorAll('track').forEach(element => {
            element.setAttribute('type', 'application/octet-stream')
        })
        /*} else if (!video.canPlayType('application/vnd.apple.mpegurl') || !video.canPlayType('application/x-mpegURL')) {
            source.setAttribute('src', metaVideo.videoMetadata.HLS_src)
            source.setAttribute('type', metaVideo.videoMetadata.HLS_codec)
            video.load()
            qualityItem.setAttribute('pfv-unsupported', '')*/
    } else {
        //For MP4 container
        source.setAttribute('src', metaVideo.videoMetadata.Fallback_src)
        source.setAttribute('type', metaVideo.videoMetadata.Fallback_codec)
        video.load()
        qualityItem.setAttribute('pfv-unsupported', '')
    }

    video.addEventListener('durationchange', updatetime)
    rangeEQInputs.forEach(element => {
        element.disabled = true
        element.value = 0
    })

    if (!('pictureInPictureEnabled' in document)) {
        pipPlayerButton.parentElement.setAttribute('hidden', '')
    }

    if (canFullscreenEnabled() === false) {
        fullscreenButton.parentElement.setAttribute('pfv-unsupported', '')
        fullscreenTooltip.setAttribute('pfv-tooltip-text', 'Full screen is unavailable')
    }

    playfulVideoPlayer.setAttribute('pfv-device', 'Desktop')
    if (/Mobi/.test(window.navigator.userAgent)) playfulVideoPlayer.setAttribute('pfv-device', 'Mobile')
    if (isiPadOSSafari()) playfulVideoPlayer.setAttribute('pfv-device', 'iPadOS')

    // Disable features for mobile users
    if (playfulVideoPlayer.getAttribute('pfv-device') === ('Mobile' || 'iPadOS')) {
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
                    s += 'The video is missing or is in a format not supported by your browser.'
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
        console.log(`The video event listener action '${action}' is unavailable.`)
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
    target.style.setProperty('--gradient', `linear-gradient(${bg < 50
        ? `-90deg, transparent 50%, var(--bright-accent-color) 50%, var(--accent-color) ${100 - bg}%, transparent ${100 - bg}%`
        : `90deg, transparent 50%, var(--accent-color) 50%, var(--bright-accent-color) ${bg}%, transparent ${bg}%`})`)
}

// Context menu
function showContextMenu(show = true) {
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
        settingsTooltipContainer.setAttribute('pfv-tooltip', 'right')
        seekingPreview.removeAttribute('hidden')
        closeDialog(e.target)
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

    if (x + cmWidth > winWidth - 8) x = eventPos.offsetX - cmWidth
    if (y + cmHeight > winHeight - 8) y = winHeight - cmHeight - 8

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
        settingsTooltipContainer.setAttribute('pfv-tooltip', 'right')
        seekingPreview.removeAttribute('hidden')
        closeDialog(e.target)
    }
}

function showSettingsMenu(show) {
    if (show === void 0) show = true
    show
        ? (settingsButton.classList.add('pressed'),
            settingsContextMenu.classList.add('pressed'),
            seekingPreview.setAttribute('hidden', ''),
            settingsTooltipContainer.removeAttribute('pfv-tooltip'))
        : (settingsButton.classList.remove('pressed'),
            settingsContextMenu.classList.remove('pressed'),
            seekingPreview.removeAttribute('hidden'),
            settingsTooltipContainer.setAttribute('pfv-tooltip', 'right'))
}

document.addEventListener('click', (e) => {
    showContextMenu(false)
    if (
        !settingsButton.contains(e.target) &&
        !settingsContextMenu.contains(e.target) &&
        !transcriptPanel.contains(e.target)
    ) {
        showSettingsMenu(false)
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
        showSettingsMenu(true)
    } else {
        showSettingsMenu(false)
    }
})

backPageSettings.forEach(element => {
    element.addEventListener('click', backPageSettingsFn)
})

function backPageSettingsFn() {
    const oldContent = settingsContextMenu.querySelectorAll('.page:not(.front-page)')
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
    const fileType = metaVideo.videoMetadata.Fallback_codec.split('/')[1].split(';')[0]
    downloadFile(
        metaVideo.videoMetadata.Fallback_src,
        `${title || 'download'}.${fileType}`
    )
    settingsButton.classList.remove('pressed')
    settingsContextMenu.classList.remove('pressed')
    settingsTooltipContainer.setAttribute('pfv-tooltip', 'right')
})

playbackSpeedItem.addEventListener('click', () => {
    const parent = playbackSpeedItem.parentElement.parentElement
    parent.setAttribute('hidden', '')
    const content = playfulVideoPlayer.querySelector('.playback-speed-settings')
    content.removeAttribute('hidden')
})

qualityItem.addEventListener('click', () => {
    const parent = playbackSpeedItem.parentElement.parentElement
    parent.setAttribute('hidden', '')
    const content = playfulVideoPlayer.querySelector('.quality-settings')
    content.removeAttribute('hidden')
})

var BY_MULTIPLY = '&#160;&#215;'
function decodeHTMLCharCodes(str) {
    return str.replace(/(&#(\d+);)/g, function (_match, _capture, charCode) {
        return String.fromCharCode(charCode)
    })
}
BY_MULTIPLY = decodeHTMLCharCodes(BY_MULTIPLY)

for (var i = 0; i < playbackSpeedItemControls.length; i++) {
    const dataSpeed = playbackSpeedItemControls[i].getAttribute('pfv-speed')
    playbackSpeedItemControls[i].classList.add(`speed__${dataSpeed}`)
    playbackSpeedItemControls[i].querySelector('.span:last-child').innerText = `${dataSpeed}${BY_MULTIPLY}`
    video.playbackRate = playfulVideoPlayer.getAttribute('pfv-speed')

    playfulVideoPlayer.querySelector('.page.playback-speed-settings .item[pfv-speed="1"] .span:last-child').innerText = `(${playfulVideoPlayer.querySelector('.page.playback-speed-settings .item[pfv-speed="1"]').getAttribute('pfv-speed')}${BY_MULTIPLY})`
    playfulVideoPlayer.querySelector('.page.playback-speed-settings .item .span.normal-speed').innerText = 'Normal'

    playbackSpeedItem.querySelector('.span.current-speed').innerText = `${video.playbackRate}${BY_MULTIPLY}`
    playfulVideoPlayer.querySelector(`.page.playback-speed-settings .item[pfv-speed='${playfulVideoPlayer.getAttribute('pfv-speed')}']`).setAttribute('aria-checked', true)
}

playbackSpeedItemControls.forEach(element => {
    element.addEventListener('click', () => {
        playbackSpeedItemControls.forEach(element => {
            element.removeAttribute('aria-checked')
        })
        if (playfulVideoPlayer.querySelector('.page-contents.playback-speed-settings .item[class*="speed__"]')) {
            video.playbackRate = element.getAttribute('pfv-speed')
            playfulVideoPlayer.setAttribute('pfv-speed', video.playbackRate)
            playbackSpeedItem.querySelector('.span.current-speed').innerText = `${video.playbackRate}${BY_MULTIPLY}`
            element.setAttribute('aria-checked', true)
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
    eqItem.setAttribute('pfv-unsupported', '')
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
    rangeEQInputs[i].setAttribute('pfv-input', i)
}

rangeEQInputs.forEach(element => {
    element.addEventListener('input', () => {
        changeGain(element.value, element.getAttribute('pfv-input'))
    })
})

// Dialog
function closeDialog(e) {
    if (e.classList.contains('opened')) e.classList.remove('opened')
}

dialogOverlay.forEach(element => {
    element.addEventListener('click', (e) => {
        closeDialog(e.target.parentElement)
    })
})

closeDialogBtn.forEach(element => {
    element.addEventListener('click', (e) => {
        closeDialog(e.target.parentElement.parentElement.parentElement)
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
    hls.subtitleDisplay = hls.subtitleDisplay === false ? 'true' : 'false'
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
        const clickableTranscriptText =
            `<div class="cue-container" pfv-start-time="${cue.startTime}" role="button" aria-pressed="false" tabindex="0">
            <div class="cue-time span">${formatTime.format(cue.startTime)}</div>
            <div class="cues span">${cleanHTML(transcriptText, '<div><p><span>')}</div>
        </div>`
        addToTranscript(clickableTranscriptText)
        cueContainers = playfulVideoPlayer.querySelectorAll('.cue-container')
    }
}

function getVoices(speech) {
    const voices = []
    let pos = speech.indexOf('<v')
    while (pos !== -1) {
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
    div.innerText = text
    return div.innerText || div.innerText || ''
}

function jumpToTranscript(time) {
    video.currentTime = time
    timelineInner.style.setProperty('--progress-position', video.currentTime / video.duration)
    playfulVideoPlayer.querySelectorAll('.cue-container').forEach(element => element.classList.remove('current'))
    playfulVideoPlayer.querySelector(`.cue-container[pfv-start-time="${time}"]`).classList.add('current')
}

function clearTranscriptDiv() {
    transcriptDiv.innerHTML = ''
}

function addToTranscript(htmlText) {
    cleanHTML(htmlText, '')
    transcriptDiv.innerHTML += htmlText
}

function addCueListeners(cue) {
    cue.addEventListener('enter', function () {
        const transcriptText = playfulVideoPlayer.querySelector(`.cue-container[pfv-start-time='${this.startTime}']`)
        transcriptText.classList.add('current')
        transcriptText.parentElement.scrollTop =
            transcriptText.offsetTop - transcriptText.parentElement.offsetTop
    })
    cue.addEventListener('exit', function () {
        const transcriptText = playfulVideoPlayer.querySelector(`.cue-container[pfv-start-time='${this.startTime}']`)
        transcriptText.classList.remove('current')
    })
}

transcriptDiv.addEventListener('keydown', (e) => {
    if (e.key !== ' ' &&
        e.key !== 'Enter' &&
        e.key !== 'Spacebar') { toggleBtn(e.target) }
})

transcriptDiv.addEventListener('click', (e) => {
    cueContainers.forEach(element => {
        if (element.contains(e.target)) jumpToTranscript(element.getAttribute('pfv-start-time'))
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
        showSettingsMenu(false)
    }
})

transcriptPanel.addEventListener('contextmenu', (e) => closeSettingsMenu(e))
transcriptPanel.addEventListener('click', (e) => closeSettingsMenu(e))

// Loop function
function loopVideo() {
    loopItem.forEach(element => {
        if (!element.hasAttribute('aria-checked')) {
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
            element.setAttribute('aria-checked', 'true')
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
            element.removeAttribute('aria-checked')
        }
    })
}

function checkElement() {
    loopItem.forEach(element => {
        video.loop
            ? element.setAttribute('aria-checked', 'true')
            : element.removeAttribute('aria-checked')
    })
    if (video.hasAttribute('controls')) {
        videoControlsContainer.setAttribute('hidden', '')
        if (!title && !author) {
            videoInformationOverlay.setAttribute('hidden', '')
        } else {
            videoInformationOverlay.removeAttribute('hidden')
        }
        video.removeAttribute('controls')
    } else {
        videoControlsContainer.removeAttribute('hidden')
        videoInformationOverlay.removeAttribute('hidden')
    }
}

loopItem.forEach(element => {
    element.addEventListener('click', () => {
        loopVideo()
        showSettingsMenu(false)
        showContextMenu(false)
    })
})

// Skip time
class seekByTime {
    skip(time) {
        video.currentTime += time
        this.update()
    }

    skipPercent(time) {
        video.currentTime = video.duration * time
        this.update()
    }

    frameSeeking(fps) {
        video.currentTime += 1 / fps
        this.update()
    }

    update() {
        currentTime.innerText = formatTime.format(videoPercent * video.duration)
        timelineInner.style.setProperty('--progress-position', video.currentTime / video.duration)
    }
}

// Time divider animation
let divide
function intervalDivideWorker() {
    if (typeof (Worker) !== 'undefined' && metaVideo.videoMetadata.is_live === false) {
        if (typeof (divide) === 'undefined') {
            divide = new Worker('./utils/timeDivider.js')
        }
        divide.onmessage = function (e) {
            playfulVideoPlayer.querySelector('.divider-time').innerText = e.data
        }
    } else {
        playfulVideoPlayer.querySelector('.divider-time').innerText = '/'
    }
}

function stopIntervalDivideWorker() {
    if (typeof (Worker) === 'undefined' || typeof (divide) === 'undefined') return
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
            cancelAnimationUpdateTime()
            window.cancelAnimationFrame(updateMetadata)
            videoContainer.classList.add('hovered')
            videoControlsContainer.classList.remove('inactive')
            video.classList.remove('inactive')
        } else {
            timeout = setTimeout(function () {
                cancelAnimationUpdateTime()
                reqAnimFrameMetadata()
                videoContainer.classList.remove('hovered')
                videoControlsContainer.classList.add('inactive')
                video.classList.add('inactive')
            }, 3000)
        }
    }
}

// Full screen and picture-in-picture
fullscreenButton.addEventListener('click', toggleFullScreen)
videoFit.addEventListener('dblclick', toggleFullScreen)

const Fullscreen = {
    fullscreenElement: function () {
        return document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement ||
            false
    },
    requestFullscreen: function (element) {
        return element.requestFullscreen
            ? element.requestFullscreen()
            : element.webkitRequestFullscreen
                ? ("function" == typeof element.then && element.webkitRequestFullscreen(),
                    element.webkitRequestFullscreen())
                : element.mozRequestFullScreen
                    ? element.mozRequestFullScreen()
                    : element.msRequestFullscreen
                        ? element.msRequestFullscreen()
                        : element.querySelector && video && video.webkitEnterFullScreen
                            ? video.webkitEnterFullScreen()
                            : element.webkitEnterFullScreen
                            && element.webkitEnterFullScreen()
    },
    exitFullscreen: function (element = document) {
        element.exitFullscreen
            ? element.exitFullscreen()
            : element.webkitCancelFullScreen
                ? element.webkitCancelFullScreen()
                : element.webkitExitFullscreen
                    ? element.webkitExitFullscreen()
                    : element.mozCancelFullScreen
                        ? element.mozCancelFullScreen()
                        : element.msExitFullscreen
                        && element.msExitFullscreen()
    }
}
function toggleFullScreen() {
    if (Fullscreen.fullscreenElement()) {
        Fullscreen.exitFullscreen()
        fullscreenTooltip.setAttribute('pfv-tooltip-text', `Full screen (${FULLSCREEN_BUTTON_KEY})`)
    } else if (!Fullscreen.fullscreenElement()) {
        Fullscreen.requestFullscreen(playfulVideoPlayer)
        fullscreenTooltip.setAttribute('pfv-tooltip-text', `Exit full screen (${FULLSCREEN_BUTTON_KEY})`)
    } else {
        fullscreenButton.parentElement.setAttribute('pfv-unsupported', '')
        fullscreenTooltip.setAttribute('pfv-tooltip-text', 'Full screen is unavailable')
    }
    if (context.state === 'suspended') context.resume()
}

function togglePIPPlayerMode() {
    try {
        if (document.pictureInPictureEnabled && !video.disablePictureInPicture) {
            if (
                videoContainer.classList.contains('pip-player') &&
                !video.pictureInPictureElement
            ) {
                document.exitPictureInPicture()
                pipTooltip.setAttribute('pfv-tooltip-text', `Picture in picture (${PICTUREINPICTURE_TOGGLE_KEY})`)
            } else {
                video.requestPictureInPicture()
                pipTooltip.setAttribute('pfv-tooltip-text', `Exit picture in picture (${PICTUREINPICTURE_TOGGLE_KEY})`)
            }
        } else {
            pipPlayerButton.setAttribute('pfv-unsupported', '')
            pipTooltip.setAttribute('pfv-tooltip-text', 'Picture in picture is unavailable.')
        }
    } catch (error) {
        console.error(error)
    }
}

function fullScreenToggleChange() {
    playfulVideoPlayer.classList.toggle('full-screen', Fullscreen.fullscreenElement())
}

document.addEventListener('fullscreenchange', fullScreenToggleChange, Fullscreen.fullscreenElement())
document.addEventListener('mozfullscreenchange', fullScreenToggleChange, Fullscreen.fullscreenElement())
document.addEventListener('webkitfullscreenchange', fullScreenToggleChange, Fullscreen.fullscreenElement())
document.addEventListener('msfullscreenchange', fullScreenToggleChange, Fullscreen.fullscreenElement())

video.addEventListener('webkitenterfullscreen', () => {
    playfulVideoPlayer.classList.add('full-screen')
    fullscreenTooltip.setAttribute('pfv-tooltip-text', `Exit full screen (${FULLSCREEN_BUTTON_KEY})`)
})

video.addEventListener('webkitendfullscreen', () => {
    playfulVideoPlayer.classList.remove('full-screen')
    fullscreenTooltip.setAttribute('pfv-tooltip-text', `Full screen (${FULLSCREEN_BUTTON_KEY})`)
})

function togglePIPClass() {
    if (videoContainer.classList.contains('pip-player')) {
        videoContainer.classList.remove('pip-player')
        fullscreenTooltip.setAttribute('pfv-tooltip-text', `Full screen (${FULLSCREEN_BUTTON_KEY})`)
    } else {
        videoContainer.classList.add('pip-player')
        fullscreenTooltip.setAttribute('pfv-tooltip-text', 'Full screen is unavailable')
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
        settingsTooltipContainer.setAttribute('pfv-tooltip', 'right')
        seekingPreview.removeAttribute('hidden')
        showContextMenu(false)
        if (e.button === 0) volumeUpdate(e)
    }, true)
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
    return volumeTooltipContainer.setAttribute('pfv-tooltip-text',
        video.muted
            ? `Unmute (${MUTE_TOGGLE_KEY})`
            : `Mute (${MUTE_TOGGLE_KEY})`)
}

function volumeControlKeyboard(key, value) {
    if (key.toLowerCase() === 'arrowup') video.volume = Math.min(1, video.volume + value)
    if (key.toLowerCase() === 'arrowdown') video.volume = Math.max(0, video.volume - value)
    volumeSliderContainer.style.setProperty('--volume-position', video.volume)
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
    videoControls.setAttribute('pfv-underlay', '')
    handleTimelineUpdate(e)
    timelineInner.addEventListener('pointerleave', () => {
        timelineInner.releasePointerCapture(e.pointerId)
        seekingPreview.classList.remove('hovered')
        videoControls.removeAttribute('pfv-underlay')
    })
    timelineInner.addEventListener('pointerdown', (e) => {
        timelineInner.setPointerCapture(e.pointerId)
        if (e.button === 0) {
            settingsButton.classList.remove('pressed')
            settingsContextMenu.classList.remove('pressed')
            settingsTooltipContainer.setAttribute('pfv-tooltip', 'right')
            seekingPreview.removeAttribute('hidden')
            showContextMenu(false)
            if (!isScrubbing) toggleScrubbing(e)
        }
    }, true)
    if (isScrubbing) {
        videoControls.setAttribute('pfv-underlay', '')
    }
    timelineInner.addEventListener('pointerup', (e) => {
        timelineInner.releasePointerCapture(e.pointerId)
        if (isScrubbing) {
            toggleScrubbing(e)
            seekingPreview.classList.remove('hovered')
            videoControls.removeAttribute('pfv-underlay')
            videoContainer.classList.add('buffering-scrubbing')
        }
    })
})

let isScrubbing = false
let wasPaused

const LIVE_WINDOW = metaVideo.liveSettings.live_interval + metaVideo.liveSettings.delay_compensation

function toggleScrubbing(e) {
    const rect = timelineInner.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    isScrubbing = (e.buttons && 1) === 1
    let seekTime = percent * video.duration
    const checkInvertedTime =
        metaVideo.videoMetadata.is_live
            ? seekTime - video.duration
            : seekTime
    const delaySeek =
        metaVideo.videoMetadata.is_live
            ? checkInvertedTime - metaVideo.liveSettings.delay_compensation
            : checkInvertedTime
    const seekingTime = metaVideo.videoMetadata.is_live
        ? seekTime - metaVideo.liveSettings.delay_compensation
        : seekTime
    timeTooltip.innerText = formatTime.format(delaySeek)
    videoContainer.classList.toggle('scrubbing', isScrubbing)

    if (isScrubbing) {
        wasPaused = video.paused
        video.pause()
    } else {
        video.currentTime = seekingTime
        if (!wasPaused) video.play()
    }

    handleTimelineUpdate(e)
}

function getThumbCanvas() {
    var canvas = document.createElement('canvas')
    canvas.height = 144
    canvas.width = canvas.height * orientationInfluence
    var canctx = canvas.getContext('2d')
    canctx.drawImage(video, 0, 0, canvas.width, canvas.height)
}

function handleTimelineUpdate(e) {
    const rect = timelineInner.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    const thumbPosition = (Math.trunc(percent * video.duration) / metaVideo.videoMetadata.video_thumbs_count) * 100
    timelineInner.style.setProperty('--preview-position', percent)

    let seekTime = percent * video.duration
    const checkInvertedTime = metaVideo.videoMetadata.is_live ? seekTime - video.duration : seekTime
    const delaySeek = metaVideo.videoMetadata.is_live ? checkInvertedTime - metaVideo.liveSettings.delay_compensation : checkInvertedTime
    timeTooltip.innerText = formatTime.format(delaySeek)

    if (metaVideo.videoMetadata.is_live === false) seekingThumbnail.style.backgroundPositionY = `${thumbPosition}%`

    seekingPreviewPosition(e)

    if (seekTime < 0) seekTime = 0
    if (seekTime > video.duration - 1) seekTime = parseFloat(video.duration - 1)

    if (isScrubbing) {
        cancelAnimationUpdateTime()
        e.preventDefault()
        if (metaVideo.videoMetadata.is_live === false) videoThumbPreview.style.backgroundPositionY = `${thumbPosition}%`
        timelineInner.style.setProperty('--progress-position', percent)
        timeTooltip.innerText = formatTime.format(delaySeek)
        currentTime.innerText = formatTime.format(delaySeek)
    }
}

// Load and update data
function loadedMetadata() {
    totalTime.innerText = formatTime.format(video.duration)
    currentTime.innerText = formatTime.format(video.currentTime)
    qualityBadgeContainer.setAttribute('pfv-quality', qualityCheckShortLabel(video.videoWidth, video.videoHeight))

    qualityBadgeContainer.setAttribute('title', qualityCheckLongLabel(video.videoWidth, video.videoHeight))

    qualityBadgeText.innerText = qualityCheck(video.videoWidth, video.videoHeight)
}

function updatetime() {
    videoPercent = video.currentTime / video.duration
    var liveCompensation =
        metaVideo.videoMetadata.is_live && getComputedStyle(timelineInner).getPropertyValue('--progress-position') >= 1
            ? 1 - videoPercent
            : metaVideo.videoMetadata.is_live
                ? metaVideo.liveSettings.delay_compensation / video.duration
                : 0
    if (!video.paused && videoContainer.classList.contains('hovered')) {
        timelineInner.style.setProperty('--progress-position', videoPercent + liveCompensation)
        if (metaVideo.videoMetadata.is_live === false) currentTime.innerText = formatTime.format(video.currentTime)
        window.requestAnimationFrame(updatetime)
    }
    cancelAnimationUpdateTime()
}

function updateMetadata() {
    const updateThrottleMetadata = throttle(() => {
        orientationInfluence = video.videoWidth / video.videoHeight || 16 / 9
        playfulVideoPlayerAspectRatio.style.setProperty(
            '--aspect-ratio-size',
            orientationInfluence
        )
        playfulVideoPlayerAspectRatio.style.setProperty(
            '--aspect-ratio-size-inverse',
            video.videoHeight / video.videoWidth || 9 / 16
        )
    }, 10000)
    updateThrottleMetadata()
    window[videoContainer.classList.contains('hovered') && !isLowEnd ? 'cancelAnimationFrame' : 'requestAnimationFrame'](updateMetadata)
}

// Formatting time
const
    SECONDS_PER_MINUTE = 60,
    MINUTES_PER_HOUR = 60,
    HOURS_PER_DAY = 24,
    DAYS_PER_WEEK = 7

class timeCode {
    constructor(time) {
        this.time = time
    }

    get seconds() {
        return Math.trunc(this.time % SECONDS_PER_MINUTE, 0)
    }

    get minutes() {
        return Math.trunc(this.time / SECONDS_PER_MINUTE % MINUTES_PER_HOUR, 0)
    }

    get hours() {
        return Math.trunc(this.time / SECONDS_PER_MINUTE / MINUTES_PER_HOUR % HOURS_PER_DAY, 0)
    }

    get days() {
        return Math.trunc(this.time / SECONDS_PER_MINUTE / MINUTES_PER_HOUR / HOURS_PER_DAY % DAYS_PER_WEEK, 0)
    }

    get weeks() {
        return Math.trunc(this.time / SECONDS_PER_MINUTE / MINUTES_PER_HOUR / HOURS_PER_DAY / DAYS_PER_WEEK, 0)
    }
}

const formatTime = {
    format: function (time) {
        if (!isFinite(time)) return '-:--'
        const timeSecs = Number(Math.abs(time))
        const code = new timeCode(timeSecs)
        const
            seconds = code.seconds,
            minutes = code.minutes,
            hours = code.hours,
            days = code.days,
            weeks = code.weeks
        const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
            minimumIntegerDigits: 2,
        })

        return `${time < 0 ? '-' : ''}${[
            [(weeks > 0 ? weeks : ''),
            (weeks > 0 ? leadingZeroFormatter.format(days) : days > 0 ? days : ''),
            (days > 0 ? leadingZeroFormatter.format(hours) : days > 0 ? hours : '')]
                .filter(Boolean).join(':'),
            [(hours > 0 ? leadingZeroFormatter.format(minutes) : minutes),
            (leadingZeroFormatter.format(seconds))].join(':')
        ].filter(Boolean).join(':')}`
    },
    dateTime: function (time) {
        if (!isFinite(time)) return '0s'
        const timeSecs = Number(Math.abs(time))
        const code = new timeCode(timeSecs)
        const
            seconds = code.seconds,
            minutes = code.minutes,
            hours = code.hours,
            days = code.days,
            weeks = code.weeks

        return `${[
            [(weeks > 0 ? `${weeks}w` : ''),
            (days > 0 ? `${days}d` : ''),
            (hours > 0 ? `${hours}h` : '')]
                .filter(Boolean).join(':'),
            [(minutes > 0 ? `${minutes}m` : ''),
            (`${seconds}s`)].filter(Boolean).join(' ')
        ].filter(Boolean).join(' ')}`
    },
    ARIA: function (time) {
        if (!isFinite(time)) return '0s'
        const timeSecs = Number(Math.abs(time))
        const code = new timeCode(timeSecs)
        const
            seconds = code.seconds,
            minutes = code.minutes,
            hours = code.hours,
            days = code.days,
            weeks = code.weeks

        return `${[
            [(weeks > 0 ? `${weeks}w` : ''),
            (days > 0 ? `${days}d` : ''),
            (hours > 0 ? `${hours}h` : '')]
                .filter(Boolean).join(':'),
            [(minutes > 0 ? `${minutes}m` : ''),
            (`${seconds}s`)].filter(Boolean).join(' ')
        ].filter(Boolean).join(' ')}`
    },
}

// Playback and Media Session
playpauseButton.addEventListener('click', togglePlay)
videoFit.addEventListener('click', (e) => {
    if (e.pointerType === 'touch' &&
        videoContainer.classList.contains('hovered') &&
        videoContainer.classList.contains('played')) return
    togglePlay()
})

function togglePlay() {
    if (video.currentTime === video.duration && video.paused && !metaVideo.videoMetadata.is_live) {
        if (contextMenu.classList.contains('show') || settingsContextMenu.classList.contains('pressed')) return

        videoContainer.classList.remove('ended')
        video.currentTime = 0
    }

    video.paused || video.ended && !metaVideo.videoMetadata.is_live
        ? video.play()
        : video.pause()
    if (context.state === 'suspended') context.resume()
}

const qualityLabels = [
    {
        label: 'LD',
        size: 320,
        length: 180
    },
    {
        label: 'SD',
        size: 640,
        length: 360
    },
    {
        label: 'HD',
        size: 1280,
        length: 720
    },
    {
        label: 'FHD',
        size: 1920,
        length: 1080
    },
    {
        label: 'QHD',
        size: 2560,
        length: 1440
    },
    {
        label: '4K',
        size: 3840,
        length: 2160
    },
    {
        label: '5K',
        size: 5120,
        length: 2880
    },
    {
        label: '6K',
        size: 6144,
        length: 3456
    },
    {
        label: '8K',
        size: 7860,
        length: 4320
    },

]

function qualityCheck(sizeWidth, sizeHeight) {
    if (!sizeWidth && !sizeHeight || sizeWidth < 0 && sizeHeight < 0) return 'N/A'
    let label
    sizeWidth >= sizeHeight
        ? label = qualityLabels.find((l) => l.size >= sizeWidth)
        : label = qualityLabels.find((l) => l.length >= sizeHeight)
    return label.label
}

const qualityLabelsShort = [
    {
        label: 'LD',
        full_label: 'Low Definition',
        size: 320,
        length: 180
    },
    {
        label: 'SD',
        full_label: 'Standard Definition',
        size: 640,
        length: 360
    },
    {
        label: 'HD',
        full_label: 'High Definition',
        size: 1280,
        length: 720
    },
    {
        label: 'FHD',
        full_label: 'Full High Definition',
        size: 1920,
        length: 1080
    },
    {
        label: 'QHD',
        full_label: 'Quad High Definition',
        size: 2560,
        length: 1440
    },
    {
        label: 'UHD',
        full_label: 'Ultra High Definition',
        size: 3840,
        length: 2160
    },
]

function qualityCheckShortLabel(sizeWidth, sizeHeight) {
    if (!sizeWidth && !sizeHeight ||
        sizeWidth < 0 && sizeHeight < 0)
        return 'N/A'
    let label
    sizeWidth >= sizeHeight
        ? label = qualityLabelsShort.find((l) => l.size >= sizeWidth)
        : label = qualityLabelsShort.find((l) => l.length >= sizeHeight)
    return label.label
}

function qualityCheckLongLabel(sizeWidth, sizeHeight) {
    if (!sizeWidth && !sizeHeight ||
        sizeWidth < 0 && sizeHeight < 0)
        return 'Not Available'
    let label
    sizeWidth >= sizeHeight
        ? label = qualityLabelsShort.find((l) => l.size >= sizeWidth)
        : label = qualityLabelsShort.find((l) => l.length >= sizeHeight)
    return label.full_label
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
                    src: metaVideo.mediaSessionMetadata.thumb_96,
                    sizes: '96x96',
                    type: metaVideo.mediaSessionMetadata.type,
                },
                {
                    src: metaVideo.mediaSessionMetadata.thumb_128,
                    sizes: '128x128',
                    type: metaVideo.mediaSessionMetadata.type,
                },
                {
                    src: metaVideo.mediaSessionMetadata.thumb_192,
                    sizes: '192x192',
                    type: metaVideo.mediaSessionMetadata.type,
                },
                {
                    src: metaVideo.mediaSessionMetadata.thumb_256,
                    sizes: '256x256',
                    type: metaVideo.mediaSessionMetadata.type,
                },
                {
                    src: metaVideo.mediaSessionMetadata.thumb_384,
                    sizes: '384x384',
                    type: metaVideo.mediaSessionMetadata.type,
                },
                {
                    src: metaVideo.mediaSessionMetadata.thumb_512,
                    sizes: '512x512',
                    type: metaVideo.mediaSessionMetadata.type,
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
            async function () {
                if (!video.paused) await togglePlay()
                video.currentTime = 0
            }
        ],
        [
            'seekbackward',
            (d) => {
                video.currentTime -= d.seekOffset || 10
                timelineInner.style.setProperty('--progress-position', video.currentTime / video.duration)
                currentTime.innerText = formatTime.format(video.currentTime)
            }
        ],
        [
            'seekforward',
            (d) => {
                video.currentTime += d.seekOffset || 10
                timelineInner.style.setProperty('--progress-position', video.currentTime / video.duration)
                currentTime.innerText = formatTime.format(video.currentTime)
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
            console.log(`The media session action '${action}' is unavailable.`)
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
        if (video.currentSrc === metaVideo.videoMetadata.HLS_src) {
            return metaVideo.videoMetadata.HLS_codec
        } else if (video.currentSrc === metaVideo.videoMetadata.Fallback_src) {
            return metaVideo.videoMetadata.Fallback_codec
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
                    videoContainer.classList.add('casted-session')
                    break
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
                videoContainer.classList.remove('casted-session')
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

    if (tagName === 'input') {
        return
    } else {
        function checkActive() {
            videoContainer.classList.add('hovered')
            activity()
        }
        const percentNumbers = (typeof Number(e.key) === 'number' && e.key < 10 && e.key >= 0) && e.key
        switch (e.key.toLowerCase()) {
            case '':
                if (tagName === 'button') break
            case percentNumbers:
                checkActive()
                new seekByTime().skipPercent(e.key / 10)
                break
            case 'home':
            case 'end':
                videoContainer.classList.add('seeking')
                if (e.key.toLowerCase() === 'home') video.currentTime = 0
                if (e.key.toLowerCase() === 'end') video.currentTime = video.duration
                checkActive()
                break
            case PLAY_BUTTON_KEY:
            case ' ':
                checkActive()
                e.preventDefault()
                togglePlay()
                break
            case FULLSCREEN_BUTTON_KEY:
                if (fullscreenButton.hasAttribute('pfv-unsupported')) break
                checkActive()
                toggleFullScreen()
                break
            case SUBTITLES_CLOSEDCAPTION_TOGGLE_KEY:
                checkActive()
                toggleCaptions()
                break
            case PICTUREINPICTURE_TOGGLE_KEY:
                if (pipPlayerButton.hasAttribute('pfv-unsupported')) break
                checkActive()
                togglePIPPlayerMode()
                break
            case MUTE_TOGGLE_KEY:
                checkActive()
                toggleVolume()
                break
            case 'arrowleft':
            case 'arrowright':
                videoContainer.classList.add('seeking')
                if (e.key.toLowerCase() === 'arrowleft') new seekByTime().skip(-5)
                if (e.key.toLowerCase() === 'arrowright') new seekByTime().skip(5)
                checkActive()
                break
            case 'arrowup':
            case 'arrowdown':
                e.preventDefault()
                volumeControlKeyboard(e.key, 0.1)
                checkActive()
                break
            case 'j':
            case 'l':
                videoContainer.classList.add('seeking')
                if (e.key.toLowerCase() === 'j') new seekByTime().skip(-10)
                if (e.key.toLowerCase() === 'l') new seekByTime().skip(10)
                checkActive()
                break
            case ',':
            case '.':
                videoContainer.classList.add('seeking')
                if (e.key === ',') new seekByTime().frameSeeking((FRAMES_PER_SECOND) * -1)
                if (e.key === '.') new seekByTime().frameSeeking((FRAMES_PER_SECOND))
                checkActive()
                break
        }
    }
})

const reducedMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

reducedMediaQuery.addEventListener('change', () => {
    isMotionReduced() ? totalTime.innerText = formatTime.format(video.duration) : totalTime.innerText = formatTime.format(video.duration)
})

const isURL = str => {
    try {
        return Boolean(new URL(`https://${str}`)) ||
            Boolean(new URL(`http://${str}`))
    } catch (e) {
        return false
    }
}

const cancelAnimationUpdateTime = () => debounce(window.cancelAnimationFrame(updatetime), 600)

hls.on(Hls.Events.ERROR, function (event, data) {
    if (data.fatal) {
        switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad()
                break
            case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError()
                break
            default:
                hls.destroy()
                break
        }
    }
})

const reqAnimFrameMetadata = () => !isLowEnd || isMotionReduced() && window.requestAnimationFrame(updateMetadata)

const eventListeners = [
    [
        'play',
        () => {
            videoContainer.classList.remove('paused')
            videoContainer.classList.add('played')
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'playing'
                video.addEventListener('timeupdate', mediaSessionToggle())
            }
            playpauseTooltipContainer.setAttribute('pfv-tooltip-text', `Pause (${PLAY_BUTTON_KEY})`)
            intervalDivideWorker()

            hls.on(Hls.Events.LEVEL_SWITCHED, updateMetadata)
            reqAnimFrameMetadata()
            videoContainer.addEventListener('pointerover', () => {
                activity()
                checkElement()
                if (videoContainer.classList.contains('hovered')) window.cancelAnimationFrame(updateMetadata)
            })
            videoContainer.addEventListener('pointerup', (e) => {
                if (e.pointerType === 'touch' && !videoContainer.classList.contains('hovered')) {
                    activity()
                    checkElement()
                    if (videoContainer.classList.contains('hovered')) window.cancelAnimationFrame(updateMetadata)
                } else if (e.pointerType === 'touch' && videoContainer.classList.contains('hovered')) {
                    debounce(cancelAnimationUpdateTime(), 600)
                    reqAnimFrameMetadata()
                    videoContainer.classList.remove('hovered')
                    videoControlsContainer.classList.add('inactive')
                    video.classList.add('inactive')
                }
            })
            videoContainer.addEventListener('pointermove', () => {
                activity()
                checkElement()
                if (videoContainer.classList.contains('hovered')) window.cancelAnimationFrame(updateMetadata)
            })
            videoContainer.addEventListener('pointerleave', (e) => {
                if (settingsContextMenu.classList.contains('pressed')) return
                if (e.pointerType === 'touch' &&
                    videoContainer.classList.contains('hovered')) return
                if (!video.paused) {
                    videoContainer.classList.remove('hovered')
                    video.classList.add('inactive')
                    debounce(cancelAnimationUpdateTime(), 600)
                    reqAnimFrameMetadata()
                }
            })

            if (playfulVideoPlayer.querySelector('.video-container').classList.contains('played')) {
                rightVideoControls.querySelectorAll('button svg').forEach(element => {
                    element.style.animationDelay = '0s'
                })
            } else {
                playfulVideoPlayer.querySelectorAll(`
                .right-side button svg, .video-container:not(.caption) .caption-button svg, 
                .video-container:not(.pip-player) .pip-button svg, 
                .video-container:not(.casted-session) .gcast-button svg
                `).forEach(element => {
                    element.style.animationDelay = 'calc(var(--animation-order) * 64ms)'
                    element.style['animationPlayState' || 'webkitAnimationPlayState' || 'mozAnimationPlayState' || 'oAnimationPlayState'] = 'running'
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
            videoContainer.classList.add('paused')
            videoContainer.classList.add('hovered')
            stopIntervalDivideWorker()
            videoContainer.addEventListener('pointerleave', () => {
                cancelAnimationUpdateTime()
                window.cancelAnimationFrame(updateMetadata)
            })
            if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused'
            playpauseTooltipContainer.setAttribute('pfv-tooltip-text', `Play (${PLAY_BUTTON_KEY})`)
            video.classList.remove('inactive')
            clearTimeout(timeout)
        }
    ],
    [
        'ended',
        () => {
            if (metaVideo.videoMetadata.is_live === false) videoContainer.classList.add('ended')
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
            const checkInvertedTime =
                metaVideo.videoMetadata.is_live
                    ? video.currentTime - video.duration
                    : video.currentTime
            currentTime.innerText = formatTime.format(checkInvertedTime)
        }
    ],
    [
        'seeked',
        () => {
            window.requestAnimationFrame(updatetime)
            if (metaVideo.videoMetadata.is_live === false) videoContainer.classList.add('played')
            videoContainer.classList.remove('seeking')
            seekingPreview.classList.remove('loading')
            videoContainer.classList.remove('buffering-scrubbing')
            videoContainer.classList.remove('buffering')
            videoControls.removeAttribute('hidden')
            updatetime()
            const checkInvertedTime =
                metaVideo.videoMetadata.is_live
                    ? video.currentTime - video.duration
                    : video.currentTime
            currentTime.innerText = formatTime.format(checkInvertedTime)

            videoContainer.addEventListener('pointerover', () => {
                activity()
                checkElement()
                if (videoContainer.classList.contains('hovered')) window.cancelAnimationFrame(updateMetadata)
            })
            videoContainer.addEventListener('pointerup', (e) => {
                if (e.pointerType === 'touch' && !videoContainer.classList.contains('hovered')) {
                    activity()
                    checkElement()
                    if (videoContainer.classList.contains('hovered')) window.cancelAnimationFrame(updateMetadata)
                } else if (e.pointerType === 'touch' && videoContainer.classList.contains('hovered')) {
                    cancelAnimationUpdateTime()
                    reqAnimFrameMetadata()
                    videoContainer.classList.remove('hovered')
                    videoControlsContainer.classList.add('inactive')
                    video.classList.add('inactive')
                }
            })
            videoContainer.addEventListener('pointermove', () => {
                activity()
                checkElement()
                if (videoContainer.classList.contains('hovered')) window.cancelAnimationFrame(updateMetadata)
            })
            videoContainer.addEventListener('pointerleave', (e) => {
                if (settingsContextMenu.classList.contains('pressed') ||
                    e.pointerType === 'touch'
                    && videoContainer.classList.contains('hovered')) return
                if (!video.paused) {
                    videoContainer.classList.remove('hovered')
                    video.classList.add('inactive')
                    cancelAnimationUpdateTime()
                    reqAnimFrameMetadata()
                }
            })
        }
    ],
    [
        'timeupdate',
        () => {
            const checkInvertedTime = metaVideo.videoMetadata.is_live ? video.currentTime - video.duration : video.currentTime
            if (metaVideo.videoMetadata.is_live === false) currentTime.innerText = formatTime.format(checkInvertedTime)
            durationContainer.setAttribute(
                'aria-label',
                `${metaVideo.videoMetadata.is_live ? 'Live stream. Delayed by ' : ''}${formatTime.ARIA(metaVideo.videoMetadata.is_live ? video.duration - video.currentTime : video.currentTime)}${!metaVideo.videoMetadata.is_live ? ` elapsed of ${formatTime.ARIA(video.duration)}` : ''}`
            )

            currentTime.setAttribute(
                'datetime',
                formatTime.dateTime(video.currentTime)
            )

            qualityBadgeContainer.setAttribute('pfv-quality', qualityCheckShortLabel(video.videoWidth, video.videoHeight))

            qualityBadgeContainer.setAttribute('title', qualityCheckLongLabel(video.videoWidth, video.videoHeight))

            qualityBadgeText.innerText = qualityCheck(video.videoWidth, video.videoHeight)

            videoPercent = video.currentTime / video.duration

            if (video.currentTime >= video.duration - 1) timelineInner.style.setProperty('--progress-position', video.currentTime / video.duration)

            if (video.currentTime >= video.duration - LIVE_WINDOW) {
                liveContainer.setAttribute('pfv-rewind', 'false')
            } else {
                liveContainer.setAttribute('pfv-rewind', 'true')
            }
            videoContainer.classList[video.currentTime === video.duration ? 'add' : 'remove']('ended')
        }
    ],
    [
        'loadstart',
        () => {
            playfulVideoPlayerContainer.classList.remove('preload')
            video.playbackRate = playfulVideoPlayer.getAttribute('pfv-speed')
        }
    ],
    [
        'loadedmetadata',
        () => {
            videoPercent = video.currentTime / video.duration
            playfulVideoPlayer.classList.remove('loading')
            video.textTracks[0].mode = 'hidden'
            if (isURL(metaVideo.videoMetadata.video_thumbs) === false || metaVideo.videoMetadata.is_live === true) seekingThumbnail.setAttribute('hidden', '')

            seekingThumbnail.style.backgroundImage = `url('${metaVideo.videoMetadata.video_thumbs}')`
            videoThumbPreview.style.backgroundImage = `url('${metaVideo.videoMetadata.video_thumbs}')`
            durationContainer.setAttribute(
                'aria-label',
                `${formatTime.ARIA(
                    video.currentTime
                )} elapsed of ${formatTime.ARIA(video.duration)}`
            )

            totalTime.setAttribute(
                'datetime',
                formatTime.dateTime(video.duration)
            )

            orientationInfluence = video.videoWidth / video.videoHeight || 16 / 9

            playfulVideoPlayerContainer.setAttribute('aria-orientation', video.videoWidth > video.videoHeight ? 'landscape' : video.videoWidth < video.videoHeight && 'portait')

            playfulVideoPlayerAspectRatio.style.setProperty(
                '--aspect-ratio-size',
                orientationInfluence
            )
            playfulVideoPlayerAspectRatio.style.setProperty(
                '--aspect-ratio-size-inverse',
                video.videoHeight / video.videoWidth || 9 / 16
            )
            loadedMetadata()

            if (!playfulVideoPlayer.querySelector('.video-container').classList.contains('played')) {
                playfulVideoPlayer.querySelectorAll(`
                .right-side button svg, .video-container:not(.caption) .caption-button svg, 
                .video-container:not(.pip-player) .pip-button svg, 
                .video-container:not(.casted-session) .gcast-button svg
                `).forEach(element => {
                    element.style.animationDelay = 'calc(var(--animation-order) * 64ms)'
                    element.style['animationPlayState' || 'webkitAnimationPlayState' || 'mozAnimationPlayState' || 'oAnimationPlayState'] = 'running'
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
            video.muted || video.volume === 0
                ? (volumeLevel = 'mute')
                : video.volume >= 0.6
                    ? (volumeLevel = 'full')
                    : video.volume >= 0.3
                        ? (volumeLevel = 'mid')
                        : video.volume > 0
                        && (volumeLevel = 'low')
            video.muted || video.volume === 0
                ? volumeTooltipContainer.setAttribute('pfv-tooltip-text', `Unmute (${MUTE_TOGGLE_KEY})`)
                : volumeTooltipContainer.setAttribute('pfv-tooltip-text', `Mute (${MUTE_TOGGLE_KEY})`)
            videoContainer.setAttribute('pfv-volume-level', volumeLevel)
        }
    ]
]

for (const [action, event] of eventListeners) {
    try {
        video.addEventListener(action, event)
    } catch (error) {
        console.log(`The video event listener action '${action}' is unavailable.`)
    }
}