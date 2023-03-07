import { exec, execSync } from "child_process";
import fs from "fs";
import path from "path";
import S3 from "aws-sdk/clients/s3";
import readdir from "recursive-readdir";
import async from "async";

export const convertToMultiFormat = async (videoName: string) => {
  const videoPath = path.join(__dirname, "../../uploads/", videoName);

  // convert video to 360p, 480p, 720p, 1080p
  const uploadPath = path.join(__dirname, "../../converted/", videoName);
  // create folder if not exist
  if (!fs.existsSync(path.join(__dirname, "../../converted/", videoName))) {
    fs.mkdirSync(path.join(__dirname, "../../converted/", videoName));
  }

  const commands = [
    `ffmpeg -i "${videoPath}.mp4" -vf scale=640:360 -c:a copy "${uploadPath}/_360p.mp4"`,
    `ffmpeg -i "${videoPath}.mp4" -vf scale=854:480 -c:a copy "${uploadPath}/_480p.mp4"`,
    `ffmpeg -i "${videoPath}.mp4" -vf scale=1280:720 -c:a copy "${uploadPath}/_720p.mp4"`,
    `ffmpeg -i "${videoPath}.mp4" -vf scale=1920:1080 -c:a copy "${uploadPath}/_1080p.mp4"`,
  ];

  commands.forEach((command) => {
    execSync(command);
  });

  const deleteFolderRecursive = function (videoPath: string) {
    if (fs.existsSync(videoPath)) {
      fs.rmSync(videoPath, { recursive: true });
    }
  };
  deleteFolderRecursive(videoPath);
  console.log("Video converted successfully");
};

export const convertToHslFormat = async (videoName: string) => {
  const videoPath = path.join(__dirname, "../../converted/", videoName);

  const uploadPath = path.join(__dirname, "../../processed/", videoName);
  // create folder if not exist
  if (!fs.existsSync(path.join(__dirname, "../../processed/", videoName))) {
    fs.mkdirSync(path.join(__dirname, "../../processed/", videoName));
  }

  // const command = `ffmpeg -i "${videoPath}" -codec: copy -start_number 0 -hls_time 15 -hls_list_size 0 -f hls "${outputPath}.m3u8"`;

  const commands = [
    `ffmpeg -i "${videoPath}/_360p.mp4" -codec: copy -start_number 0 -hls_time 15 -hls_list_size 0 -f hls "${uploadPath}/_360p.m3u8"`,
    `ffmpeg -i "${videoPath}/_480p.mp4" -codec: copy -start_number 0 -hls_time 15 -hls_list_size 0 -f hls "${uploadPath}/_480p.m3u8"`,
    `ffmpeg -i "${videoPath}/_720p.mp4" -codec: copy -start_number 0 -hls_time 15 -hls_list_size 0 -f hls "${uploadPath}/_720p.m3u8"`,
    `ffmpeg -i "${videoPath}/_1080p.mp4" -codec: copy -start_number 0 -hls_time 15 -hls_list_size 0 -f hls "${uploadPath}/_1080p.m3u8"`,
  ];

  commands.forEach((command) => {
    execSync(command);
  });

  const deleteFolderRecursive = function (videoPath: string) {
    if (fs.existsSync(videoPath)) {
      fs.rmSync(videoPath, { recursive: true });
    }
  };
  deleteFolderRecursive(videoPath);

  console.log("Video converted successfully");

  // upload everything inside a folder to s3
  const s3 = new S3({
    region: "us-west-2",
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    signatureVersion: "v4",
  });

  await uploadFolderToS3(s3, uploadPath, videoName);

  if (fs.existsSync(uploadPath)) {
    fs.rmSync(uploadPath, { recursive: true });
  }
};

export const uploadFolderToS3 = async (
  s3: S3,
  folderPath: string,
  videoName: string
) => {
  function getFiles(folderPath: any) {
    return fs.existsSync(folderPath) ? readdir(folderPath) : [];
  }

  async function deploy(upload: any) {
    const filesToUpload = await getFiles(path.resolve(__dirname, upload));

    return new Promise((resolve, reject) => {
      async.eachOfLimit(
        filesToUpload,
        10,
        async.asyncify(async (file: any) => {
          console.log(file);
          const rootFolder = path.resolve(
            __dirname,
            `../../processed/${videoName}/`
          );

          const Key = file.replace(rootFolder, "");
          console.log(`uploading: [${Key}]`);
          return new Promise((res, rej) => {
            s3.upload(
              {
                Key,
                Bucket: "test-vp/" + videoName,
                Body: fs.readFileSync(file),
              },
              (err: any) => {
                if (err) {
                  console.log(err);

                  return rej(new Error(err));
                }
                res({ result: true });
              }
            );
          });
        }),
        (err) => {
          if (err) {
          }
          resolve({ result: true });
        }
      );
    });
  }

  await deploy(folderPath);
};