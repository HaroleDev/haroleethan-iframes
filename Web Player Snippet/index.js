const playpauseButton = document.querySelector('.play-pause-button')
const videoContainer = document.querySelector('.video-container')
const video = document.querySelector('video')

const currentTime = document.querySelector('.current-time')
const totalTime = document.querySelector('.total-time')
const cuetimeTooltip = document.querySelector('.cuetime-tooltip')
const cuetime = document.querySelector('.cuetime');

const captionButton = document.querySelector(".caption-button")
const settingsButton = document.querySelector('.settings-button')
const settingsContextMenu = document.querySelector('.settings-context-menu')

const loopItem = document.querySelector('.loop-item')
const eqItem = document.querySelector('.eq-item')
const eqContainer = document.querySelector('.eq-dialog-container')
const dialog = document.querySelector('.dialog')
const Item = document.querySelector('.item')
const closeDialog = document.querySelector('.close-dialog')

const dialogOverlay = document.querySelector('.dialog-overlay')

const fullscreenButton = document.querySelector('.full-screen-button')
const pipPlayerButton = document.querySelector(".pip-button")

const timelineContainer = document.querySelector(".timeline-container")

window.addEventListener('load', () => {
    video.src = video.currentSrc
})

//Context Menu
const contextMenu = document.querySelector(".video-context-menu")

function showContextMenu(show = true) {
    show ? contextMenu.classList.add('show') : contextMenu.classList.remove('show')
}

videoContainer.addEventListener('contextmenu', e => {
    e.preventDefault();
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target)) {
        settingsButton.classList.remove('pressed')
        settingsContextMenu.classList.remove('pressed')
    }
    showContextMenu()

    contextMenu.style.top = e.y + contextMenu.offsetHeight > window.innerHeight ? window.innerHeight - contextMenu.offsetHeight + 'px' : e.y + 'px';
    contextMenu.style.left = e.x + contextMenu.offsetWidth > window.innerWidth ? window.innerWidth - contextMenu.offsetWidth + 'px' : e.x + 'px';
})

videoContainer.addEventListener('click', (e) => {
    showContextMenu(show = false)
    if (!settingsButton.contains(e.target) && !settingsContextMenu.contains(e.target)) {
        settingsButton.classList.remove('pressed')
        settingsContextMenu.classList.remove('pressed')
    }
})

Item.addEventListener('click', () => {
    showContextMenu(show = false)
})

//Playback
playpauseButton.addEventListener('click', togglePlay)
video.addEventListener('click', togglePlay)

document.addEventListener('DOMContentLoaded', () => {
    if (!('pictureInPictureEnabled' in document)) {
        pipPlayerButton.classList.add('hidden');
    }
});

settingsButton.addEventListener('click', () => {
    settingsButton.classList.toggle('pressed')
    settingsContextMenu.classList.toggle('pressed')
})

//EQ
var ctx = window.AudioContext || window.webkitAudioContext;
var context = new ctx();
var sourceNode = context.createMediaElementSource(document.querySelector('video'));

var filters = [];

[60, 125, 250, 500, 800, 1000, 2000, 4000, 8000, 16000].forEach(function (freq, i) {
    var eq = context.createBiquadFilter();
    eq.frequency.value = freq;
    eq.type = "peaking";
    eq.gain.value = 0;
    filters.push(eq);
});

sourceNode.connect(filters[0]);
for (var i = 0; i < filters.length - 1; i++) {
    filters[i].connect(filters[i + 1]);
}

filters[filters.length - 1].connect(context.destination);

function changeGain(sliderVal, nbFilter) {
    var value = parseFloat(sliderVal);
    filters[nbFilter].gain.value = value;
}

//EQ dialog
eqItem.addEventListener('click', () => {
    eqContainer.classList.add("opened")
})

//Dialog
function closedDialog() {
    if (eqContainer.classList.contains('opened')) {
        eqContainer.classList.remove("opened")
    }
}

dialogOverlay.addEventListener('click', () => {
    closedDialog()
})

closeDialog.addEventListener('click', () => {
    closedDialog()
})

//Loop function
function loopVideo() {
    if (!loopItem.classList.contains("enabled")) {
        video.loop = true;
        loopItem.classList.add("enabled")
    } else {
        video.loop = false;
        loopItem.classList.remove("enabled")
    }
}

loopItem.addEventListener('click', loopVideo)

//Keyboard shortcuts
document.addEventListener('keydown', e => {
    switch (e.key) {
        case ' ':
        case 'k': case 'K':
            togglePlay()
            break
        case 'f': case 'F':
            videoContainer.classList.add('hovered')
            activity()
            toggleFullScreen()
            break
        case 'c': case 'C':
            videoContainer.classList.add('hovered')
            activity()
            toggleCaptions()
            break
        case 'i': case 'I':
            videoContainer.classList.add('hovered')
            activity()
            togglePIPPlayerMode()
            break
        case 'ArrowLeft':
            videoContainer.classList.add('hovered')
            activity()
            skip(-5)
            break
        case 'ArrowRight':
            videoContainer.classList.add('hovered')
            activity()
            skip(5)
            break
    }
})

function skip(duration) {
    video.currentTime += duration
}

let timeout = null;
function activity() {
    clearTimeout(timeout);
    video.classList.remove('inactive')
    videoContainer.classList.add('hovered')
    if (videoContainer.classList.contains("hovered"))
        timeout = setTimeout(function () {
            videoContainer.classList.remove('hovered')
            video.classList.add('inactive')
        }, 2000)
}

fullscreenButton.addEventListener('click', toggleFullScreen)

function toggleFullScreen() {
    if (document.fullscreenElement == null) {
        videoContainer.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

async function togglePIPPlayerMode() {
    try {
        if (videoContainer.classList.contains("pip-player")) {
            videoContainer.classList.add("pip-player")
            await document.exitPictureInPicture();
        } else {
            videoContainer.classList.remove("pip-player")
            await video.requestPictureInPicture();
        }
    } catch (error) {
        console.error(error)
    }
}

document.addEventListener("fullscreenchange", () => {
    videoContainer.classList.toggle("full-screen", document.fullscreenElement)
})

video.addEventListener("enterpictureinpicture", () => {
    videoContainer.classList.add("pip-player")
})

video.addEventListener("leavepictureinpicture", () => {
    videoContainer.classList.remove("pip-player")
})

pipPlayerButton.addEventListener('click', togglePIPPlayerMode)

timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
timelineContainer.addEventListener("mousedown", toggleScrubbing)

document.addEventListener("mouseup", e => {
    if (isScrubbing) toggleScrubbing(e)
})

document.addEventListener("mousemove", e => {
    if (isScrubbing) {
        handleTimelineUpdate(e)
    }
})

let isScrubbing = false
let wasPaused
function toggleScrubbing(e) {
    timelineContainer.style.setProperty("--preview-position", 0)
    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    isScrubbing = (e.buttons & 1) === 1
    videoContainer.classList.toggle("scrubbing", isScrubbing)
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
    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    timelineContainer.style.setProperty("--preview-position", percent)
    if (isScrubbing) {
        e.preventDefault()
        timelineContainer.style.setProperty("--progress-position", percent)
    }
}

function updateCueTimeTooltip(e) {
    const skipTo = (e.offsetX / e.target.clientWidth) * parseInt(e.target.getAttribute('max'))
    cuetimeTooltip.textContent = formatDuration(skipTo)
}

cuetime.addEventListener('mousemove', updateCueTimeTooltip);

function loadedMetadata() {
    totalTime.textContent = formatDuration(video.duration)
    currentTime.textContent = formatDuration(video.currentTime)
    cuetime.setAttribute('max', video.duration);
}

video.addEventListener("loadedmetadata", () => {
    loadedMetadata()
})

video.addEventListener("timeupdate", () => {
    currentTime.textContent = formatDuration(video.currentTime)
    updatetime()
})

function updatetime() {
    const percent = video.currentTime / video.duration
    timelineContainer.style.setProperty("--progress-position", percent)
    if (video.duration) {
        timelineContainer.style.setProperty('--buffered-position', (1 / video.duration) * video.buffered.end(0));
    }
    reqId = requestAnimationFrame(updatetime);
}

const leading0Formatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
})

function formatDuration(time) {
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600)
    if (hours === 0) {
        return `${minutes}:${leading0Formatter.format(seconds)}`
    } else {
        return `${hours}:${leading0Formatter.format(minutes)}:${leading0Formatter.format(seconds)}`
    }
}

const captions = video.textTracks[0]
captions.mode = "hidden"

captionButton.addEventListener("click", toggleCaptions)

function toggleCaptions() {
    const isHidden = captions.mode === "hidden"
    captions.mode = isHidden ? "showing" : "hidden"
    videoContainer.classList.toggle("caption", isHidden)
}

function togglePlay() {
    if (context.state === 'suspended') {
        context.resume();
    }
    if (contextMenu.classList.contains("show")) {
        return
    } if (settingsContextMenu.classList.contains("pressed")) {
        return
    }
    video.paused ? video.play() : video.pause()
}

video.addEventListener("play", () => {
    videoContainer.addEventListener("mousemove", activity);
    videoContainer.addEventListener('mouseleave', () => {
        videoContainer.classList.remove('hovered')
        video.classList.add('inactive')
    })
    videoContainer.classList.remove('paused')
})

video.addEventListener("pause", () => {
    video.classList.remove('inactive')
    clearTimeout(timeout);
    videoContainer.classList.add('paused')
})