"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.uploadFolderToS3 = exports.convertToHslFormat = exports.convertToMultiFormat = void 0;
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var path_1 = require("path");
var s3_1 = require("aws-sdk/clients/s3");
var recursive_readdir_1 = require("recursive-readdir");
var async_1 = require("async");
var deleteFolder_1 = require("./deleteFolder");
var convertToMultiFormat = function (videoName) { return __awaiter(void 0, void 0, void 0, function () {
    var videoPath, uploadPath, commands;
    return __generator(this, function (_a) {
        videoPath = path_1["default"].join(__dirname, "../../uploads/", videoName);
        uploadPath = path_1["default"].join(__dirname, "../../converted/", videoName);
        // create the folder if not exist
        if (!fs_1["default"].existsSync(path_1["default"].join(__dirname, "../../converted/", videoName))) {
            fs_1["default"].mkdirSync(path_1["default"].join(__dirname, "../../converted/", videoName));
        }
        commands = [
            "ffmpeg -i \"".concat(videoPath, ".mp4\" -vf scale=640:360 -c:a copy \"").concat(uploadPath, "/_360p.mp4\""),
            "ffmpeg -i \"".concat(videoPath, ".mp4\" -vf scale=854:480 -c:a copy \"").concat(uploadPath, "/_480p.mp4\""),
            "ffmpeg -i \"".concat(videoPath, ".mp4\" -vf scale=1280:720 -c:a copy \"").concat(uploadPath, "/_720p.mp4\""),
            "ffmpeg -i \"".concat(videoPath, ".mp4\" -vf scale=1920:1080 -c:a copy \"").concat(uploadPath, "/_1080p.mp4\""),
        ];
        commands.forEach(function (command) {
            (0, child_process_1.execSync)(command);
        });
        (0, deleteFolder_1.deleteFolder)(videoPath);
        console.log("Video converted successfully");
        return [2 /*return*/];
    });
}); };
exports.convertToMultiFormat = convertToMultiFormat;
var convertToHslFormat = function (videoName) { return __awaiter(void 0, void 0, void 0, function () {
    var videoPath, uploadPath, commands;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                videoPath = path_1["default"].join(__dirname, "../../converted/", videoName);
                uploadPath = path_1["default"].join(__dirname, "../../processed/", videoName);
                // create folder if not exist
                if (!fs_1["default"].existsSync(path_1["default"].join(__dirname, "../../processed/", videoName))) {
                    fs_1["default"].mkdirSync(path_1["default"].join(__dirname, "../../processed/", videoName));
                }
                commands = [
                    "ffmpeg -i \"".concat(videoPath, "/_360p.mp4\" -codec: copy -start_number 0 -hls_time 15 -hls_list_size 0 -f hls \"").concat(uploadPath, "/_360p.m3u8\""),
                    "ffmpeg -i \"".concat(videoPath, "/_480p.mp4\" -codec: copy -start_number 0 -hls_time 15 -hls_list_size 0 -f hls \"").concat(uploadPath, "/_480p.m3u8\""),
                    "ffmpeg -i \"".concat(videoPath, "/_720p.mp4\" -codec: copy -start_number 0 -hls_time 15 -hls_list_size 0 -f hls \"").concat(uploadPath, "/_720p.m3u8\""),
                    "ffmpeg -i \"".concat(videoPath, "/_1080p.mp4\" -codec: copy -start_number 0 -hls_time 15 -hls_list_size 0 -f hls \"").concat(uploadPath, "/_1080p.m3u8\""),
                ];
                commands.forEach(function (command) {
                    (0, child_process_1.execSync)(command);
                });
                (0, deleteFolder_1.deleteFolder)(videoPath);
                console.log("Video converted successfully");
                // upload everything inside a folder to s3
                return [4 /*yield*/, (0, exports.uploadFolderToS3)(uploadPath, videoName)];
            case 1:
                // upload everything inside a folder to s3
                _a.sent();
                if (fs_1["default"].existsSync(uploadPath)) {
                    fs_1["default"].rmSync(uploadPath, { recursive: true });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.convertToHslFormat = convertToHslFormat;
var uploadFolderToS3 = function (folderPath, videoName) { return __awaiter(void 0, void 0, void 0, function () {
    function getFiles(folderPath) {
        return fs_1["default"].existsSync(folderPath) ? (0, recursive_readdir_1["default"])(folderPath) : [];
    }
    function deploy(upload) {
        return __awaiter(this, void 0, void 0, function () {
            var filesToUpload;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getFiles(path_1["default"].resolve(__dirname, upload))];
                    case 1:
                        filesToUpload = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                async_1["default"].eachOfLimit(filesToUpload, 10, async_1["default"].asyncify(function (file) { return __awaiter(_this, void 0, void 0, function () {
                                    var rootFolder, Key;
                                    return __generator(this, function (_a) {
                                        console.log(file);
                                        rootFolder = path_1["default"].resolve(__dirname, "../../processed/".concat(videoName, "/"));
                                        Key = file.replace(rootFolder, "");
                                        console.log("uploading: [".concat(Key, "]"));
                                        return [2 /*return*/, new Promise(function (res, rej) {
                                                // S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
                                                // Please convert to `await client.upload(params, options).promise()`, and re-run aws-sdk-js-codemod.
                                                s3.upload({
                                                    Key: Key,
                                                    Bucket: "test-vp/" + videoName.split("/").at(-1),
                                                    Body: fs_1["default"].readFileSync(file)
                                                }, function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                        return rej(new Error(err));
                                                    }
                                                    res({ result: true });
                                                });
                                            })];
                                    });
                                }); }), function (err) {
                                    if (err) {
                                    }
                                    resolve({ result: true });
                                });
                            })];
                }
            });
        });
    }
    var s3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                s3 = new s3_1["default"]({
                    region: process.env.REGION,
                    accessKeyId: process.env.ACCESS_KEY,
                    secretAccessKey: process.env.SECRET_KEY,
                    signatureVersion: "v4"
                });
                return [4 /*yield*/, deploy(folderPath)];
            case 1:
                _a.sent();
                (0, deleteFolder_1.deleteFolder)(folderPath);
                return [2 /*return*/];
        }
    });
}); };
exports.uploadFolderToS3 = uploadFolderToS3;
