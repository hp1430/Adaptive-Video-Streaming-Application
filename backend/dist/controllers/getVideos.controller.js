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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideosController = void 0;
const getVideos_service_1 = require("../services/getVideos.service");
const getVideosController = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, getVideos_service_1.getVideos)();
    res.status(200).json(response);
    return;
});
exports.getVideosController = getVideosController;
