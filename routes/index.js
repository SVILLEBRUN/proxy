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
        const imageResponse = await needle('get', imageUrl, { follow_max: 5 });

        if (process.env.NODE_ENV !== 'production') {
            console.info('Image REQUEST : ', imageUrl);
        }

        // Check Content-Type to ensure it's an image
        const contentType = imageResponse.headers['content-type'];
        if (!contentType || !contentType.startsWith('image/')) {
            return res.status(400).json({ success: false, message: 'The URL does not return an image' });
        }

        // Set the Content-Type of the response
        res.setHeader('Content-Type', contentType);

        // Optionally set the Content-Length if available
        const contentLength = imageResponse.headers['content-length'];
        if (contentLength) {
            res.setHeader('Content-Length', contentLength);
        }

        // Send the raw response directly
        res.send(imageResponse.raw);
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