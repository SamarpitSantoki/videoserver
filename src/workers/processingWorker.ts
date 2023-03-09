// worker file for processing the data
// worker accepts a video file name and return ok if the file is processed successfully
// This will also update the video status to processing and done

import { convertToHslFormat, convertToMultiFormat } from "../helpers/convert";

const start = async (filename: string) => {
  if (!filename) {
    console.log("No filename provided");
    return;
  }

  // TODO: make a api call and update status to processing

  // process the video
  // convet to multiple formats and save to converted folder

  // TODO: add options for quality and format
  await convertToMultiFormat(filename);

  // TODO: seperate the upload to s3 part
  // convert to hls format and save to processed folder and upload to s3
  await convertToHslFormat(filename);

  // make a api call and update status to done
  // return ok
};

start(process.argv[2]);
