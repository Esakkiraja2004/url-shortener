const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const Url = require('../models/url');

// @route POST /shorten
// @desc Create short URL and render the page with the shortened URL
router.post('/', async (req, res) => {
    const { originalUrl } = req.body;
    try {
        let url = await Url.findOne({ originalUrl });

        if (url) {
            res.render('index', { shortenedUrl: `${req.headers.origin}/${url.shortUrl}` });
        } else {
            const shortUrl = shortid.generate();
            url = new Url({ originalUrl, shortUrl });

            await url.save();
            res.render('index', { shortenedUrl: `${req.headers.origin}/${url.shortUrl}` });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Server error');
    }
});

// @route GET /:shortUrl
// @desc Redirect to original URL
router.get('/:shortUrl', async (req, res) => {
    try {
        const url = await Url.findOne({ shortUrl: req.params.shortUrl });

        if (url) {
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json('No URL found');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Server error');
    }
});

module.exports = router;
