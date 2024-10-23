const express = require('express');
const router = express.Router();
const needle = require('needle');
const apicache = require('apicache');

let cache = apicache.middleware;

// Proxy optimized for image requests
router.get('/images', async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) {
        return res.status(400).json({ success: false, message: 'No image URL provided' });
    }
    
    try {
        const imageStream = await needle('get', imageUrl);

        if(process.env.NODE_ENV != 'production') {
            console.info('Image REQUEST : ', imageUrl);
        }

        // Handling errors
        imageStream.on('error', (err) => {
            return res.status(500).json({ success: false, message: 'Error fetching the image', error: err.message });
        });

        // Send the image stream to the client
        imageStream.on('header', (headers) => {
            if (headers['content-type']) {
                res.setHeader('Content-Type', headers['content-type']);  // Set the content type of the response
            }
        });

        // Send the image stream to the client
        imageStream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
})

// Proxy optimized for data requests
router.get('/data', cache('5 minutes'), async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ success: false, message: 'No URL provided' });
    }

    try {
        const response = await needle('get', url);
        const data = response.body;
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
})

module.exports = router