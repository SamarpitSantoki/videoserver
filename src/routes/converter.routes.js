"use strict";
exports.__esModule = true;
var express_1 = require("express");
var converter_controller_1 = require("../controllers/converter.controller");
var router = (0, express_1.Router)();
router.post("/upload", converter_controller_1["default"]);
exports["default"] = router;
