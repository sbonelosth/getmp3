// required packages

const express = require("express")
const axios = require('axios')
require("dotenv").config()

// creating the express server

const app = express()

// server port number

const PORT = process.env.PORT || 3000;

// setting template engine

app.set("view engine", "ejs")
app.use(express.static("views"))

// required for parsing html data for POST request

app.use(express.urlencoded({
  extended: true
}))
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index")
})

app.post("/download", async (req, res) => {
  const videoIdx = req.body.videoID;
  const videoIdMatch = videoIdx.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(/(?:[\w-]+?v=|embed\/|live\/|v\/)?)([\w-]+)(\S+)?$/);
  
  const videoId = videoIdMatch ? videoIdMatch[5] : null;
  if (
    videoId === undefined ||
    videoId === "" ||
    videoId === null
  ) {
    console.log('Invalid url')
    return res.render("index", { success: false, message: "Enter a valid YouTube URL" })
  } else {
    const fetchAPI = await axios.request(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": process.env.API_KEY,
        "x-rapidapi-host": process.env.API_HOST
      }
    });
    const fetchResponse = await fetchAPI.data;

    if (fetchResponse.msg === "success") {
      console.log('Success')
      return res.render("index", { success: true, song_title: fetchResponse.title, song_link: fetchResponse.link })
    }
    else {
      console.log('Failed')
      return res.render("index", { success: false, message: fetchResponse.msg })
    }
  }
})

// starting the server

app.listen(PORT, () => {
  console.log(`Server strated on port ${PORT}...`)
})
