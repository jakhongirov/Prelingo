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
const GET = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        if (limit && page) {
            const devicesList = yield model_1.default.devicesList(limit, page);
            if (devicesList && devicesList.length > 0) {
                res.status(200).json({
                    status: 200,
                    message: 'Success',
                    data: devicesList,
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
        const user_id = req.params.user_id
            ? Number(req.params.user_id)
            : undefined;
        const foundUserDevices = yield model_1.default.foundUserDevices(user_id);
        if (foundUserDevices && foundUserDevices.length > 0) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: foundUserDevices,
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
const ADD_DEVICE = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deviceData = req.body;
        const addDevice = yield model_1.default.addDevice(deviceData.user_id, deviceData.phone_brand, deviceData.phone_lang, deviceData.app_lang, deviceData.platform);
        if (addDevice) {
            res.status(201).json({
                status: 201,
                message: 'Success',
                data: addDevice,
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
const EDIT_DEVICE = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deviceData = req.body;
        if (deviceData.phone_brand) {
            yield model_1.default.editPhoneBrand(deviceData.id, deviceData.user_id, deviceData.phone_brand);
        }
        if (deviceData.phone_lang) {
            yield model_1.default.editPhoneLang(deviceData.id, deviceData.user_id, deviceData.phone_lang);
        }
        if (deviceData.app_lang) {
            yield model_1.default.editAppLang(deviceData.id, deviceData.user_id, deviceData.app_lang);
        }
        if (deviceData.platform) {
            yield model_1.default.editPlatform(deviceData.id, deviceData.user_id, deviceData.platform);
        }
        const foundDevice = yield model_1.default.foundDevice(deviceData.id, deviceData.user_id);
        if (foundDevice) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: foundDevice,
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
const DELETE_DEVICE = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deviceData = req.body;
        const deleteDevice = yield model_1.default.deleteDevice(deviceData.id, deviceData.user_id);
        if (deleteDevice) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: deleteDevice,
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
    GET,
    GET_USER_ID,
    ADD_DEVICE,
    EDIT_DEVICE,
    DELETE_DEVICE,
};
