const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YoutubeUser'
    },
    path: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    comments: {
        type: Array,
    },
    username: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
