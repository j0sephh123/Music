const express = require("express");
const fs = require("fs");
const app = express();

app.use(require("cors")());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json(JSON.parse(fs.readFileSync("./music.json", "utf8")));
});

app.post("/", (req, res) => {
  if (!req.body.youtubeId || !req.body.title) {
    return res.status(404).send("Title and/or youtubeId missing from request");
  }

  if (req.body.youtubeId.length !== 11) {
    return res.status(404).send("Invalid youtubeId");
  }

  if (req.body.title.length < 5) {
    return res.status(404).send("Title needs to be at least 5 characters");
  }

  const music = JSON.parse(fs.readFileSync("./music.json", "utf8"));
  const tryToFind = music.find(
    ({ youtubeId }) => youtubeId === req.body.youtubeId
  );

  if (tryToFind) {
    return res.status(404).send("youtubeId exists");
  }

  try {
    fs.writeFileSync(
      "./music.json",
      JSON.stringify([req.body, ...music]),
      "utf8"
    );

    res.json({ success: true });
  } catch (e) {
    res.status(404).send("Error with writing to database");
  }
});

// score
// liked
app.put("/upvote/:youtubeid", (req, res) => {
  if (!req.params.youtubeid) {
    return res.status(404).send("No youtubeId provided");
  }

  const music = JSON.parse(fs.readFileSync("./music.json", "utf8"));
  const foundIndex = music.findIndex(
    ({ youtubeId }) => youtubeId === req.params.youtubeid
  );

  if (foundIndex === -1) {
    return res.status(404).send("No such element found");
  }

  if (!music[foundIndex]["score"]) {
    music[foundIndex]["score"] = 1;
  } else {
    music[foundIndex]["score"] += 1;
  }

  try {
    fs.writeFileSync("./music.json", JSON.stringify(music), "utf8");

    res.json({ score: music[foundIndex]["score"] });
  } catch (e) {
    res.status(404).send("Error with writing to database");
  }
});
app.put("/downvote/:youtubeid", (req, res) => {
  if (!req.params.youtubeid) {
    return res.status(404).send("No youtubeId provided");
  }

  const music = JSON.parse(fs.readFileSync("./music.json", "utf8"));
  const foundIndex = music.findIndex(
    ({ youtubeId }) => youtubeId === req.params.youtubeid
  );

  if (foundIndex === -1) {
    return res.status(404).send("No such element found");
  }

  if (!music[foundIndex]["score"]) {
    music[foundIndex]["score"] = -1;
  } else {
    music[foundIndex]["score"] -= 1;
  }

  try {
    fs.writeFileSync("./music.json", JSON.stringify(music), "utf8");

    res.json({ score: music[foundIndex]["score"] });
  } catch (e) {
    res.status(404).send("Error with writing to database");
  }
});

app.listen(5000);
