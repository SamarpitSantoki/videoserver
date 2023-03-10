import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { Request, Response } from "express";
import { convertToHslFormat, convertToMultiFormat } from "../helpers/convert";

const uploadFile = async (req: Request, res: Response) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files?.video as any;

  // check for uploads folder
  if (!fs.existsSync(path.join(__dirname, "../../uploads"))) {
    fs.mkdirSync(path.join(__dirname, "../../uploads"));
  }

  // get file path to upload file
  const uploadPath = path.join(__dirname, "../../uploads/", req.body.name);
  const uploadPathWithExtension = uploadPath + ".mp4";

  await file.mv(uploadPathWithExtension);

  // move file to uploads folder
  // fs.writeFileSync(uploadPathWithExtension, file.data);

  const videoName = req.body.name;

  res.send("OK");

  // create a worker and process the video
  const workerProcess = exec(
    `node ${path.join(
      __dirname,
      "../workers/processingWorker.js"
    )} ${videoName}`
  );
};

export default uploadFile;
