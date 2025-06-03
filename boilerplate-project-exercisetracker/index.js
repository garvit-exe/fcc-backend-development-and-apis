const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

let users = [];
let exercises = [];
let userIdCounter = 1;

app.post("/api/users", (req, res) => {
    const username = req.body.username;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    const newUser = {
        username: username,
        _id: (userIdCounter++).toString(),
    };
    users.push(newUser);

    res.json(newUser);
});

app.get("/api/users", (req, res) => {
    res.json(users);
});

app.post("/api/users/:_id/exercises", (req, res) => {
    const userId = req.params._id;
    const { description, duration, date } = req.body;

    const user = users.find((u) => u._id === userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    if (!description || duration === undefined || duration === "") {
        return res
            .status(400)
            .json({ error: "Description and duration are required" });
    }

    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
        return res
            .status(400)
            .json({ error: "Duration must be a positive number" });
    }

    let exerciseDate;
    if (date) {
        exerciseDate = new Date(date);
        if (isNaN(exerciseDate.getTime())) {
            return res
                .status(400)
                .json({ error: "Invalid date format. Use yyyy-mm-dd." });
        }
    } else {
        exerciseDate = new Date();
    }

    const newExercise = {
        userId: userId,
        description: description,
        duration: durationNum,
        date: exerciseDate.toDateString(),
    };
    exercises.push(newExercise);

    res.json({
        _id: user._id,
        username: user.username,
        description: newExercise.description,
        duration: newExercise.duration,
        date: newExercise.date,
    });
});

app.get("/api/users/:_id/logs", (req, res) => {
    const userId = req.params._id;
    const { from, to, limit } = req.query;

    const user = users.find((u) => u._id === userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    let userExercises = exercises.filter((ex) => ex.userId === userId);

    if (from) {
        const fromDate = new Date(from);
        if (!isNaN(fromDate.getTime())) {
            userExercises = userExercises.filter(
                (ex) => new Date(ex.date) >= fromDate
            );
        }
    }
    if (to) {
        const toDate = new Date(to);
        if (!isNaN(toDate.getTime())) {
            userExercises = userExercises.filter(
                (ex) => new Date(ex.date) <= toDate
            );
        }
    }

    if (limit) {
        const limitNum = parseInt(limit);
        if (!isNaN(limitNum) && limitNum > 0) {
            userExercises = userExercises.slice(0, limitNum);
        }
    }

    const log = userExercises.map((ex) => ({
        description: ex.description,
        duration: ex.duration,
        date: ex.date,
    }));

    res.json({
        _id: user._id,
        username: user.username,
        count: log.length,
        log: log,
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
