const videoMetadata = {
    video_thumbs:
        "//res.cloudinary.com/harole/image/upload/q_auto:low/v1659426432/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_THUMBNAILS_shmsny.jpg",
    video_thumbs_count: "45",
    video_poster:
        "//res.cloudinary.com/harole/video/upload/s--p6nXm3qO--/c_fill,h_720,q_auto:low,w_1280/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    HLS_src: "./media/hls%20stream/playlist.m3u8",
    HLS_codec: "application/x-mpegURL",
    is_live: false,
    Fallback_src:
        "//link.storjshare.io/jwrbyl67eqxrubohnqibyqwsx75q/harole-video%2F2022%2FSample%20Videos%2FJuly%2022%202022%2FIMG_1175_FALLBACKSTREAM.mp4?wrap=0",
    Fallback_codec: 'video/mp4; codecs="avc1.4d0020"',
    video_FPS: "59.940",
}
const mediaSessionMetadata = {
    thumb_512:
        "//res.cloudinary.com/harole/video/upload/s--Vjfp8q3F--/c_fill,h_512,q_auto:eco,w_512/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    thumb_384:
        "//res.cloudinary.com/harole/video/upload/s--GSclQ4pU--/c_fill,h_384,q_auto:eco,w_384/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    thumb_256:
        "//res.cloudinary.com/harole/video/upload/s--Il1IjHMZ--/c_fill,h_256,q_auto:eco,w_256/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    thumb_192:
        "//res.cloudinary.com/harole/video/upload/s--XGk0fUrZ--/c_fill,h_192,q_auto:eco,w_192/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    thumb_128:
        "//res.cloudinary.com/harole/video/upload/s--G8UlljUd--/c_fill,h_128,q_auto:eco,w_128/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    thumb_96:
        "//res.cloudinary.com/harole/video/upload/s--d8U6mcP6--/c_fill,h_96,q_auto:eco,w_96/v1658949913/Harole%27s%20Videos/Sample%20Videos/Feeding%20fish%20in%20Hue/IMG_1175_H264STREAM_vfelcj.jpg",
    type: "image/jpeg",
}
const videoSettings = {
    bandwidth_default_estimate: 730000,
    fragment_duration: 4,
}
const liveSettings = {
    delay_compensation: 10,
    live_interval: 15,
}
export default {
    videoMetadata,
    mediaSessionMetadata,
    liveSettings,
    videoSettings,
}
