require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
    res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
const bodyParser = require("body-parser");
const dns = require("dns");

app.use(bodyParser.urlencoded({ extended: false }));
const urlDatabase = {};
app.post("/api/shorturl", function (req, res) {
    const originalUrlString = req.body.url;
    let parsedUrl;

    try {
        parsedUrl = new URL(originalUrlString);
    } catch (e) {
        return res.json({ error: "invalid url" });
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return res.json({ error: "invalid url" });
    }

    dns.lookup(parsedUrl.hostname, (err, address) => {
        if (err || !address) {
            return res.json({ error: "invalid url" });
        }

        const shortUrl = Object.keys(urlDatabase).length + 1;
        urlDatabase[shortUrl] = originalUrlString;
        res.json({ original_url: originalUrlString, short_url: shortUrl });
    });
});
app.get("/api/shorturl/:shortUrl", function (req, res) {
    const shortUrl = req.params.shortUrl;
    const originalUrl = urlDatabase[shortUrl];

    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.json({ error: "No short URL found for the given input" });
    }
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
