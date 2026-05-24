const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DOWNLOADS =
path.join(__dirname, "downloads");

if (!fs.existsSync(DOWNLOADS)) {
  fs.mkdirSync(DOWNLOADS);
}

app.post("/download", (req, res) => {

  const url = req.body.url;

  if (!url) {

    return res.json({
      success:false
    });

  }

  const fileName =
  "video_" + Date.now() + ".mp4";

  const output =
  path.join(DOWNLOADS, fileName);

  const command =
  `yt-dlp -o "${output}" "${url}"`;

  exec(command, (error) => {

    if(error){

      console.log(error);

      return res.json({
        success:false
      });

    }

    res.json({
      success:true,
      video:"/file/" + fileName
    });

  });

});

app.get("/file/:name", (req, res) => {

  const file =
  path.join(
    DOWNLOADS,
    req.params.name
  );

  res.download(file);

});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Running");
});
  