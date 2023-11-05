// required packages

const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

// creating the express server

const app = express();

// server port number

const PORT = process.env.PORT || 3000;

// setting template engine

app.set("view engine", "ejs");
app.use(express.static("views"));

// required for parsing html data for POST request

app.use(express.urlencoded({
  extended: true
}))
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index")
})

app.post("/youty-mp3", async (req, res) => {
  const videoIdx = req.body.videoID;
  const videoId = videoIdx.slice(videoIdx.length - 11, videoIdx.length);
  if (
    videoId === undefined ||
    videoId === "" ||
    videoId === null
  ) {
    return res.render("index", {success : false, message : "Enter a valid video URL"});
  } else {
      const fetchAPI = await fetch(`https://youtube-mp3-download1.p.rapidapi.com/dl?id=${videoId}`, {
        "method" : "GET",
        "headers": {
          "x-rapidapi-key" : process.env.API_KEY,
          "x-rapidapi-host" : process.env.API_HOST
        }
      });

      const fetchResponse = await fetchAPI.json();

      if (fetchResponse.status === "ok")
        return res.render("index", {success : true,song_title: fetchResponse.title, song_link : fetchResponse.link});
      else
        return res.render("index", {success : false, message : fetchResponse.msg})
  }
})

// starting the server

app.listen(PORT, () => {
  console.log(`Server strated on port ${PORT}...`);
})
