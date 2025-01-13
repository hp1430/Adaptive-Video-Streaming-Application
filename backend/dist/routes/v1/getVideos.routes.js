"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getVideos_controller_1 = require("../../controllers/getVideos.controller");
const getVideosRouter = express_1.default.Router();
getVideosRouter.get('/', getVideos_controller_1.getVideosController);
exports.default = getVideosRouter;
