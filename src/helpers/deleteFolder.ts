import fs from "fs";
export const deleteFolder = function (videoPath: string) {
  if (fs.existsSync(videoPath)) {
    fs.rmSync(videoPath, { recursive: true });
  }
};
