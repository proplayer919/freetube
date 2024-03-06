const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(__dirname + '/public'));

app.get('/watch', (req, res) => {
    res.sendFile(__dirname + '/public/watch.html');
});

app.get('/video', async (req, res) => {
    try {
        // Get the YouTube video URL from the query parameter
        const videoURL = "https://www.youtube.com/watch?v=" + req.query.url;

        // Validate the YouTube URL
        if (!ytdl.validateURL(videoURL)) {
            return res.status(400).send('Invalid YouTube URL');
        }

        // Get video info
        const info = await ytdl.getInfo(videoURL);

        // Stream the video
        res.header('Content-Disposition', `attachment; filename="${info.title}.mp4"`);
        ytdl(videoURL, {
            format: 'mp4'
        }).pipe(res);

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log('Server running at port ' + port + '.');
});