import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { convertToHslFormat, convertToMultiFormat } from "./helpers/convert";

const app = express();
app.use(cors());
app.use(fileUpload());

app.use(express.static("processed"));

app.post("/upload", async (req, res) => {
  console.log(req.files?.video);
  console.log(req.body.name);

  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  // write it in upload folder
  const file = req.files?.video as any;
  console.log();

  //  move this file to uploads folder with fs module and rename it
  const uploadPath = path.join(__dirname, "../uploads/", req.body.name);
  const uploadPathWithExtension = uploadPath + ".mp4";

  // move file to uploads folder
  fs.writeFileSync(uploadPathWithExtension, file.data);

  const videoName = req.body.name;

  res.send("OK");

  await convertToMultiFormat(videoName);

  console.log("Video done");

  await convertToHslFormat(videoName);

  console.log("Video hsl done");

  // upload everything inside a folder to s3
  // const s3 = new S3({
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // });

  // const files = fs.readdirSync(uploadPath);

  // files.forEach((file) => {
  //   const filePath = path.join(uploadPath, file);
  // });

  // // delete folder
  // const deleteFolderRecursive = function (uploadPathWithExtension: string) {
  //   if (fs.existsSync(uploadPathWithExtension)) {
  //     fs.rmSync(uploadPathWithExtension, { recursive: true });

  //   }
  // };
});

app.post("/startProcess", (req, res) => {
  const { videoName } = req.body;

  console.log("Start processing video");

  res.send("OK");
});

// get link to processed video
app.get("/getVideo", (req, res) => {
  const videoName = "002-Course Introduction.mp4";
  const videoPath = path.join(__dirname, "../processed/", videoName);
  const videoLink = `http://localhost:3000/${videoPath}.m3u8`;

  res.send(videoLink);
});

// serve html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/static/index.html");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
