const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send(fs.readFileSync('index.html').toString());
});

app.get('/watch', (req, res) => {
    res.send(fs.readFileSync('watch.html').toString());
});

app.get('/get', (req, res) => {
    const videoUrl = req.query.url; // Get YouTube video URL from query parameter

    // Check if the URL is valid
    if (ytdl.validateURL(videoUrl)) {
        ytdl.getInfo(videoUrl, (err, info) => {
            if (err) {
                res.status(500).send('Error getting video info');
                return;
            }

            const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });

            res.header('Content-Disposition', `inline; filename="${info.title}.mp4"`);
            ytdl(videoUrl, {
                format: format,
            }).pipe(res);
        });
    } else {
        res.status(400).send('Invalid YouTube video URL');
    }
});

app.listen(port, () => {
    console.log('Server running at port ' + port + '.');
});