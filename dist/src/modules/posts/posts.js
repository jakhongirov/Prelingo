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
const jwt_1 = __importDefault(require("../../lib/jwt"));
const model_1 = __importDefault(require("./model"));
const POSTS_LIST = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        if (limit && page) {
            const postsList = yield model_1.default.postsList(limit, page);
            if (postsList && postsList.length > 0) {
                res.status(200).json({
                    status: 200,
                    message: 'Success',
                    data: postsList,
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
const POST_ID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id
            ? Number(req.params.id)
            : undefined;
        if (id !== undefined && isNaN(id)) {
            res.status(400).json({
                status: 400,
                message: 'Invalid ID',
            });
            return;
        }
        const postByID = yield model_1.default.postByID(id);
        if (postByID) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: postByID,
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
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: 'Interval Server Error',
        });
        return;
    }
});
const USER_POSTS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.headers.token;
        let userId = (_a = Number(req.query.limit)) !== null && _a !== void 0 ? _a : null;
        if (!token) {
            userId = Number(req.query.limit);
            return;
        }
        const userStatus = new jwt_1.default(token).verify();
        userId = userStatus.id;
        const foundUserPosts = yield model_1.default.foundUserPosts(userId);
        if (foundUserPosts && foundUserPosts.length > 0) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: foundUserPosts,
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
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: 'Interval Server Error',
        });
        return;
    }
});
const ADD_POST = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postData = req.body;
        const token = req.headers.token;
        const uploadFile = req.file;
        if (!token) {
            res.status(401).json({
                status: 401,
                message: 'Unauthorized',
            });
            return;
        }
        const userStatus = new jwt_1.default(token).verify();
        const imgUrl = uploadFile
            ? `${process.env.URL}/${uploadFile === null || uploadFile === void 0 ? void 0 : uploadFile.filename}`
            : null;
        const imgName = uploadFile ? uploadFile === null || uploadFile === void 0 ? void 0 : uploadFile.filename : null;
        const addPost = yield model_1.default.addPost(postData, imgUrl, imgName, userStatus.id);
        if (addPost) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: addPost,
            });
            return;
        }
        else {
            res.status(400).json({
                status: 400,
                message: 'Bad request',
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
    POSTS_LIST,
    POST_ID,
    USER_POSTS,
    ADD_POST,
};
