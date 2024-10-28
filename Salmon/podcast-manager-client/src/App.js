import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [title, setTitle] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [subtitles, setSubtitles] = useState('');
  const [podcastId, setPodcastId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('audio', audioFile);

    const response = await axios.post('/upload', formData);
    setPodcastId(response.data._id);
  };

  const handleAddSubtitles = async () => {
    await axios.post(`/subtitles/${podcastId}`, { subtitles });
  };

  const handleGenerateVideo = async () => {
    const response = await axios.post(`/generate-video/${podcastId}`);
    setVideoUrl(response.data.videoUrl);
  };

  return (
    <div>
      <h1>Podcast Manager</h1>
      <div>
        <h2>Upload Audio</h2>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="file" onChange={(e) => setAudioFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      <div>
        <h2>Add Subtitles</h2>
        <textarea placeholder="Subtitles" value={subtitles} onChange={(e) => setSubtitles(e.target.value)} />
        <button onClick={handleAddSubtitles}>Add Subtitles</button>
      </div>
      <div>
        <h2>Generate Video</h2>
        <button onClick={handleGenerateVideo}>Generate Video</button>
        {videoUrl && <video src={videoUrl} controls />}
      </div>
    </div>
  );
}

export default App;