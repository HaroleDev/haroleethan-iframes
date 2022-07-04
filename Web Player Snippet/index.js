const playpauseButton = document.querySelector('.play-pause-button')
const videoContainer = document.querySelector('.video-container')
const video = document.querySelector('video')

const currentTime = document.querySelector('.current-time')
const totalTime = document.querySelector('.total-time')
const seekTooltip = document.getElementById('seek-tooltip');

const captionButton = document.querySelector(".caption-button")

const fullscreenButton = document.querySelector('.full-screen-button')

const timelineContainer = document.querySelector(".timeline-container")

playpauseButton.addEventListener('click', togglePlay)
video.addEventListener('click', togglePlay)

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

function activity() {
    var timeout;
    var duration = 1000;
    videoContainer.addEventListener("mousemove", () => {
        videoContainer.classList.add('hovered')
        clearTimeout(timeout);
    });
    timeout = setTimeout(function () {
        videoContainer.classList.remove('hovered')
    }, duration)
}

fullscreenButton.addEventListener('click', toggleFullScreen)

function toggleFullScreen() {
    if (document.fullscreenElement == null) {
        videoContainer.requestFullscreen()
        videoContainer.classList.add('full-screen')
    } else {
        document.exitFullscreen()
        videoContainer.classList.remove('full-screen')
    }
}

timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
timelineContainer.addEventListener("mousedown", toggleScrubbing)

document.addEventListener("mouseup", e => {
    if (isScrubbing) toggleScrubbing(e)
})

document.addEventListener("mousemove", e => {
    if (isScrubbing) handleTimelineUpdate(e)
})

let isScrubbing = false
let wasPaused
function toggleScrubbing(e) {
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
    if (isScrubbing) {
        e.preventDefault()
        timelineContainer.style.setProperty("--progress-position", percent)
    }
}

video.addEventListener('loadeddata', () => {
    totalTime.textContent = formatDuration(video.duration)
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
    video.paused ? video.play() : video.pause()
}

video.addEventListener("play", () => {
    videoContainer.addEventListener("mouseover", activity);
    videoContainer.addEventListener('mouseleave', () => {
        videoContainer.classList.remove('hovered')
    })
    videoContainer.classList.remove('paused')
})

video.addEventListener("pause", () => {
    video.classList.remove('inactive')
    videoContainer.classList.add('paused')
})