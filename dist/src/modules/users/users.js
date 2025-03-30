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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const model_1 = __importDefault(require("./model"));
const GET_LIST = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        if (limit && page) {
            const usersList = yield model_1.default.usersList(limit, page);
            if (usersList && usersList.length > 0) {
                res.status(200).json({
                    status: 200,
                    message: 'Success',
                    data: usersList,
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
        const userByID = yield model_1.default.userByID(id);
        if (userByID) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: userByID,
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
const GET_USER_TOKEN = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token
            ? req.params.token
            : undefined;
        const userByToken = yield model_1.default.userByToken(token);
        if (userByToken) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: userByToken,
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
const REGISTER_USER = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const referral_code = (0, uuid_1.v4)();
        let pass_hash = '';
        if (userData.password) {
            pass_hash = yield bcryptjs_1.default.hash(userData === null || userData === void 0 ? void 0 : userData.password, 10);
        }
        else {
            res.status(400).json({
                status: 400,
                message: 'Bad request',
            });
            return;
        }
        const createUser = yield model_1.default.createUser(userData, pass_hash, referral_code);
        if (createUser) {
            const token = yield new jwt_1.default({
                id: createUser === null || createUser === void 0 ? void 0 : createUser.id,
            }).sign();
            res.status(201).json({
                status: 201,
                message: 'Success',
                data: createUser,
                token: token,
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
const REGISTER_EMAIL = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, app_token } = req.body;
        const foundUserByEmail = yield model_1.default.foundUserByEmail(email);
        if (foundUserByEmail) {
            yield model_1.default.addToken(foundUserByEmail.id, app_token);
            const token = yield new jwt_1.default({
                id: foundUserByEmail === null || foundUserByEmail === void 0 ? void 0 : foundUserByEmail.id,
            }).sign();
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: foundUserByEmail,
                token: token,
            });
            return;
        }
        else {
            const createUserEmail = yield model_1.default.createUserEmail(email, app_token);
            if (createUserEmail) {
                const token = yield new jwt_1.default({
                    id: createUserEmail === null || createUserEmail === void 0 ? void 0 : createUserEmail.id,
                }).sign();
                res.status(201).json({
                    status: 201,
                    message: 'Success',
                    data: createUserEmail,
                    token: token,
                });
                return;
            }
            else {
                res.status(400).json({
                    status: 400,
                    message: 'Bad requestF',
                });
                return;
            }
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
const GOOGLE = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({
                status: 401,
                message: 'Unauthorized',
            });
            return;
        }
        const user = req.user;
        const foundUserByEmail = yield model_1.default.foundUserEmail(user.email, user.id);
        if (foundUserByEmail) {
            // await model.addToken(foundUserByEmail!.id, app_token);
            const token = yield new jwt_1.default({
                id: foundUserByEmail === null || foundUserByEmail === void 0 ? void 0 : foundUserByEmail.id,
            }).sign();
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: foundUserByEmail,
                token: token,
            });
            return;
        }
        else {
            const addUser = yield model_1.default.addUser(user.id, user.email, user.name, user.phone);
            if (addUser) {
                const token = yield new jwt_1.default({
                    id: addUser === null || addUser === void 0 ? void 0 : addUser.id,
                }).sign();
                res.status(201).json({
                    status: 201,
                    message: 'Success',
                    data: addUser,
                    token: token,
                });
                return;
            }
            else {
                res.status(400).json({
                    status: 400,
                    message: 'Bad requestF',
                });
                return;
            }
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
const APPLE = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({
                status: 401,
                message: 'Unauthorized',
            });
            return;
        }
        const user = req.user;
        const foundUserByEmail = yield model_1.default.foundUserEmail(user.email, user.id);
        if (foundUserByEmail) {
            // await model.addToken(foundUserByEmail!.id, app_token);
            const token = yield new jwt_1.default({
                id: foundUserByEmail === null || foundUserByEmail === void 0 ? void 0 : foundUserByEmail.id,
            }).sign();
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: foundUserByEmail,
                token: token,
            });
            return;
        }
        else {
            const addUser = yield model_1.default.addUser(user.id, user.email, user.name, user.phone);
            if (addUser) {
                const token = yield new jwt_1.default({
                    id: addUser === null || addUser === void 0 ? void 0 : addUser.id,
                }).sign();
                res.status(201).json({
                    status: 201,
                    message: 'Success',
                    data: addUser,
                    token: token,
                });
                return;
            }
            else {
                res.status(400).json({
                    status: 400,
                    message: 'Bad requestF',
                });
                return;
            }
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
const LOGIN = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userData = req.body;
        const contact = (_a = userData.email) !== null && _a !== void 0 ? _a : userData.phone_number;
        const foundUser = yield model_1.default.foundUser(contact);
        if (foundUser && foundUser.password) {
            const validPass = yield bcryptjs_1.default.compare(userData.password, foundUser.password);
            if (validPass) {
                yield model_1.default.addToken(foundUser.id, userData.app_token);
                const token = yield new jwt_1.default({
                    id: foundUser === null || foundUser === void 0 ? void 0 : foundUser.id,
                }).sign();
                res.status(200).json({
                    status: 200,
                    message: 'Success',
                    data: foundUser,
                    token: token,
                });
                return;
            }
            else {
                res.status(401).json({
                    status: 401,
                    message: 'Invalid password',
                });
                return;
            }
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
const EDIT_USER = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const userByID = yield model_1.default.userByID(userData.id);
        if (userByID) {
            if (userData.surname) {
                yield model_1.default.editSurname(userData.id, userData.surname);
            }
            if (userData.name) {
                yield model_1.default.editName(userData.id, userData.name);
            }
            if (userData.phone_number) {
                yield model_1.default.editPhoneNumber(userData.id, userData.phone_number);
            }
            if (userData.email) {
                yield model_1.default.editEmail(userData.id, userData.email);
            }
            if (userData.password) {
                const pass_hash = yield bcryptjs_1.default.hash(userData === null || userData === void 0 ? void 0 : userData.password, 10);
                yield model_1.default.editPassword(userData.id, pass_hash);
            }
            if (userData.country) {
                yield model_1.default.editCountry(userData.id, userData.country);
            }
            if (userData.region) {
                yield model_1.default.editRegion(userData.id, userData.region);
            }
            if (userData.count_stars) {
                yield model_1.default.editCountStars(userData.id, userData.count_stars);
            }
            if (userData.balance) {
                yield model_1.default.editBalance(userData.id, userData.balance);
            }
            const userByID = yield model_1.default.userByID(userData.id);
            if (userByID) {
                res.status(200).json({
                    status: 200,
                    message: 'Success',
                    data: userByID,
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
            res.status(404).json({
                status: 404,
                message: 'Bad request',
            });
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
const DELETE_USER = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const deleteUser = yield model_1.default.deleteUser(id);
        if (deleteUser) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: deleteUser,
            });
        }
        else {
            res.status(400).json({
                status: 400,
                message: 'Bad request',
            });
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
    GET_USER_TOKEN,
    REGISTER_USER,
    REGISTER_EMAIL,
    GOOGLE,
    APPLE,
    LOGIN,
    EDIT_USER,
    DELETE_USER,
};
