const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  videoUploads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  subscribed: {
    type: Array,
  },
  subscribers: {
    type: Array,
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
});

const User = mongoose.model('YoutubeUser', UserSchema);

module.exports = User;
