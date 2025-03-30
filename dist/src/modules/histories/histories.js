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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __importDefault(require("./model"));
const GET_LIST = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        if (limit && page) {
            const historiesList = yield model_1.default.historiesList(limit, page);
            if (historiesList && historiesList.length > 0) {
                res.status(200).json({
                    status: 200,
                    message: 'Success',
                    data: historiesList,
                });
                return;
            }
            else {
                res.status(404).json({
                    status: 404,
                    message: 'Not found',
                });
                return;
            }
        }
        else {
            res.status(400).json({
                status: 400,
                message: 'Bad request (limit and page is not exist)',
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: 'Interval Server Error',
        });
        return;
    }
});
const GET_USER_ID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.user_id);
        const foundHistories = yield model_1.default.foundHistories(id);
        if (foundHistories) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: foundHistories,
            });
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'Not found',
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: 'Interval Server Error',
        });
        return;
    }
});
exports.default = {
    GET_LIST,
    GET_USER_ID,
};
