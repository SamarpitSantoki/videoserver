"use strict";
exports.__esModule = true;
exports.deleteFolder = void 0;
var fs_1 = require("fs");
var deleteFolder = function (videoPath) {
    if (fs_1["default"].existsSync(videoPath)) {
        fs_1["default"].rmSync(videoPath, { recursive: true });
    }
};
exports.deleteFolder = deleteFolder;
