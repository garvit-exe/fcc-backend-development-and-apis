let express = require("express");
let app = express();
require("dotenv").config();
let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

// console.log("Hello World");

// app.get("/", (req, res) => {
//     res.send("Hello Express");
// });

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/views/index.html");
// });

// app.use("/public", (req, res) => {
//     express.static(__dirname + "/public")(req, res, (err) => {
//         if (err) {
//             res.status(404).send("File not found");
//         }
//     });
// });

// app.get("/json", (req, res) => {
//     let response = { message: "Hello json" };
//     if (process.env.MESSAGE_STYLE === "uppercase") {
//         response.message = response.message.toUpperCase();
//     }
//     res.json(response);
// });

// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path} - ${req.ip}`);
//     next();
// });

// app.get(
//     "/now",
//     (req, res, next) => {
//         req.time = new Date().toString();
//         next();
//     },
//     (req, res) => {
//         res.json({ time: req.time });
//     }
// );

// app.get("/:word/echo", (req, res) => {
//     const word = req.params.word;
//     res.json({ echo: word });
// });

app.route("/name")
    .get((req, res) => {
        res.json({ name: `${req.query.first} ${req.query.last}` });
    })
    .post((req, res) => {
        res.json({ name: `${req.body.first} ${req.body.last}` });
    });

module.exports = app;
