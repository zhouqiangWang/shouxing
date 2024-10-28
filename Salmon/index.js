const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/podcast-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
}).catch(err => console.log(err.reason));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Models
const Podcast = mongoose.model('Podcast', new mongoose.Schema({
  title: String,
  audioFile: String,
  subtitles: String,
}));

// Routes
app.post('/upload', upload.single('audio'), async (req, res) => {
  const podcast = new Podcast({
    title: req.body.title,
    audioFile: req.file.filename,
  });
  await podcast.save();
  res.send(podcast);
});

app.post('/subtitles/:id', async (req, res) => {
  const podcast = await Podcast.findById(req.params.id);
  podcast.subtitles = req.body.subtitles;
  await podcast.save();
  res.send(podcast);
});

app.post('/generate-video/:id', async (req, res) => {
  const podcast = await Podcast.findById(req.params.id);
  const audioPath = path.join(__dirname, 'uploads', podcast.audioFile);
  const videoPath = path.join(__dirname, 'public', 'videos', `${podcast._id}.mp4`);

  ffmpeg(audioPath)
    .inputOptions('-loop 1')
    .input('path/to/image.jpg') // Placeholder image
    .outputOptions('-c:v libx264', '-tune stillimage', '-c:a aac', '-b:a 192k', '-shortest')
    .save(videoPath)
    .on('end', () => {
      res.send({ videoUrl: `/videos/${podcast._id}.mp4` });
    });
});

// Serve React frontend
app.use(express.static(path.join(__dirname, 'podcast-manager-client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'podcast-manager-client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});