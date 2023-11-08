const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UserModel = require("./model/user.model");
const VideoModel = require("./model/video.model");

const uploadDir = path.join(__dirname, '/uploads');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


mongoose.connect(
		process.env.MONGO_URL,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			connectTimeoutMS: 10000,
		}
    )
.then((connection) => console.log("Connected to MongoDB"));

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, SECRET);

        let cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, "_");
        cb(null, decoded.id + '-' + cleanFileName);
    }
});

const upload = multer({ storage: storage });


app.post(`/api/user/sign-up/`, async (req, res) => {
    try {
        let newUser = req.body;

        const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
        newUser.password = hashedPassword;

        const savedUser = await UserModel.create(newUser);

        return res.json(savedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post(`/api/user/sign-in/`, async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await UserModel.findOne({ username: username });

        if (!user) {
            return res.status(400).json({ error: 'Benutzername oder Passwort ist falsch' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ error: 'Benutzername oder Passwort ist falsch' });
        }

        const payload = { id: user._id, username: user.username };

        const token = jwt.sign(payload, 'yourSecretKey', { expiresIn: '740h' });

        return res.json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get(`/api/user/profile/`, async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        res.json({
            username: user.username,
        });
    });
});

app.post('/upload', upload.single('videoFile'), async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, SECRET);

    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const video = new VideoModel({
        user: user._id,
        path: req.file.filename,
        title: req.body.title,
        description: req.body.description,
        username: req.body.username,
    });

    const savedVideo = await video.save();

    user.videoUploads.push(savedVideo._id);
    await user.save();

    res.json({ message: "Video uploaded successfully", video: savedVideo });
});


app.get(`/api/video/get-all/`, async (req, res) => {
    try {
        const videos = await VideoModel.find({});
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get(`/api/video/:videoId/`, async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const video = await VideoModel.findById(videoId);
        res.json(video);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post(`/api/post/comment/`, async (req, res) => {
    try {
        const body = req.body;
        const videoId = body.videoId;
        const comment = body.comment;
        const username = body.username;

        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, SECRET);
    
        const user = await UserModel.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const video = await VideoModel.findById(videoId);

        video.comments.push({
            comment: comment,
            user: user._id,
            username: username,
        });

        video.save();

        res.json(video);

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' });
    }
});

app.get(`/api/video/:id/comment/get-all/`, async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const video = await VideoModel.findById(videoId);
        res.json(video.comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put(`/api/add/abo/`, async (req, res) => {
    try {
        const uploaderId = req.body.uploader;

        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, SECRET);

        const userId = decoded.id;
    
        const user = await UserModel.findById(userId);
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const uploader = await UserModel.findById(uploaderId);
        if (!uploader) return res.status(404).json({ message: "Uploader not found" });

        if (!user.subscribed.includes(uploaderId)) {
            await UserModel.updateOne({ _id: userId }, { $push: { subscribed: uploaderId } });
        }

        if (!uploader.subscribers.includes(userId)) {
            await UserModel.updateOne({ _id: uploaderId }, { $push: { subscribers: userId } });
        }

        res.send(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.get(`/api/user/get-info/`, async (req, res) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, SECRET);
    
        const user = await UserModel.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        res.json(user);
});


app.get(`/api/uploads/video/:videoId`, async (req, res) => {
    const videoId = req.params.videoId;

    const video = await VideoModel.findById(videoId);

    if (!video) {
        return res.status(404).json({ error: 'Video not found' });
    }

    const imagePath = path.join(__dirname, '/uploads/', video.path);

    if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: 'Video not found' });
    }

    res.set('Content-Type', 'video/mp4');

    const readStream = fs.createReadStream(imagePath);
    readStream.pipe(res);
});

app.get(`/api/user/:username/channel-view/`, async (req, res) => {
    try {
        const username = req.params.username;
        const video = await VideoModel.find({ username: username });
        res.json(video);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get(`/api/video-uploader/get-info/:videoUserId`, async (req, res) => {
    try {
        const uploaderId = req.params.videoUserId;
        const uploader = await UserModel.findById(uploaderId);

        res.send(uploader);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})

app.post(`/api/video/like/`, async (req, res) => {
    try {
        const body = req.body;
        const videoId = body.videoId;

        const video = await VideoModel.findById(videoId);

        if (video.likes === undefined) {
            video.likes = 0;
        }

        video.likes += 1;
        video.save();
        res.json(video);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})

app.put(`/api/add/abo/mobile`, async (req, res) => {
    try {
        const uploaderName = req.body.uploader;

        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, SECRET);

        const userId = decoded.id;
    
        const user = await UserModel.findById(userId);
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const uploader = await UserModel.find({ username: uploaderName });
        if (!uploader) return res.status(404).json({ message: "Uploader not found" });

        if (!user.subscribed.includes(uploader._id)) {
            await UserModel.updateOne({ _id: userId }, { $push: { subscribed: uploader._id } });
        }

        if (!uploader.subscribers.includes(userId)) {
            await UserModel.updateOne({ _id: uploader._id }, { $push: { subscribers: userId } });
        }

        res.send(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

const buildPath = path.join(__dirname, "..", "build");
app.use(express.static(buildPath));
app.get("*", (req, res) => {
	res.sendFile(path.resolve(buildPath, "index.html"));
});



app.listen(3001, function () {
    console.log("App is listening on port 3001!");
});