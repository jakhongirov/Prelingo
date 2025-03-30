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
const functions_1 = require("../../lib/functions");
const GET_LIST = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        if (limit && page) {
            const referralList = yield model_1.default.referralList(limit, page);
            if (referralList && referralList.length > 0) {
                res.status(200).json({
                    status: 200,
                    message: 'Success',
                    data: referralList,
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
const GET_REFERRALS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const referral_code = req.params.referral_code
            ? req.params.referral_code
            : undefined;
        const referralsList = yield model_1.default.referralsList(referral_code);
        const referringUser = yield model_1.default.referringUser(referral_code);
        const data = yield (0, functions_1.buildTree)(referralsList);
        if (referralsList && referralsList.length > 0) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: data,
                referraling_user: referringUser,
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
const CREATE_REFERRAL = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const referralData = req.body;
        const values = referralData.referral_code.split('/');
        const foundUserByReferralCode = yield model_1.default.foundUserByReferralCode(values[0]);
        if (foundUserByReferralCode) {
            const checkActive = yield model_1.default.checkActive(foundUserByReferralCode.referral_code
                ? foundUserByReferralCode.referral_code
                : '');
            const checkReferral = yield model_1.default.checkReferral(foundUserByReferralCode.referral_code
                ? foundUserByReferralCode.referral_code
                : '');
            if (checkReferral && checkReferral.length < 2) {
                const createReferral = yield model_1.default.createReferral(referralData.user_id, values[0], foundUserByReferralCode.id, values[1]);
                if (createReferral) {
                    if (checkActive && checkActive.max_level < 5) {
                        yield model_1.default.editUserBalance(foundUserByReferralCode.id, 20);
                        yield model_1.default.addHistoryBalance(foundUserByReferralCode.id, 20);
                    }
                    res.status(200).json({
                        status: 200,
                        message: 'Success',
                        data: createReferral,
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
            else if (values.length == 3) {
                const createReferral = yield model_1.default.createReferral(referralData.user_id, values[0], values[2], values[1]);
                if (createReferral) {
                    yield model_1.default.editUserBalance(foundUserByReferralCode.id, 20);
                    yield model_1.default.addHistoryBalance(foundUserByReferralCode.id, 20);
                    res.status(200).json({
                        status: 200,
                        message: 'Success',
                        data: createReferral,
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
            else {
                res.status(400).json({
                    status: 400,
                    message: 'Choose one user',
                    data: referralData,
                });
                return;
            }
        }
        else {
            res.status(400).json({
                status: 400,
                message: "This month's limit has expired.",
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
    GET_REFERRALS,
    CREATE_REFERRAL,
};
