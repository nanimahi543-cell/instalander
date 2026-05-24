const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

const DOWNLOADS = path.join(__dirname, "downloads");

if (!fs.existsSync(DOWNLOADS)) {
  fs.mkdirSync(DOWNLOADS);
}

app.use("/file", express.static(DOWNLOADS));

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

app.get("/", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public",
      "index.html"
    )
  );
});

app.post("/download", (req, res) => {

  const url = req.body.url;

  if (!url) {
    return res.json({
      success: false
    });
  }

  const fileName =
    "video_" + Date.now() + ".mp4";

  const output =
    path.join(DOWNLOADS, fileName);

  const command =
    `python -m yt_dlp -f mp4 -o "${output}" "${url}"`;

  exec(command, (error) => {

    if (error) {

      console.log(error);

      return res.json({
        success: false
      });

    }

    return res.json({
      success: true,
      video: "/file/" + fileName
    });

  });

});

app.listen(
  process.env.PORT || 3000,
  () => {
    console.log("Server Running");
  }
);