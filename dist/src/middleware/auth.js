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
const jwt_1 = __importDefault(require("../lib/jwt"));
const AUTH = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(401).json({
                status: 401,
                message: 'Unauthorized',
            });
            return;
        }
        const userStatus = new jwt_1.default(token).verify();
        if (!userStatus) {
            res.status(401).json({
                status: 401,
                message: 'Unauthorized',
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(401).json({
            status: 401,
            message: 'Unauthorized',
        });
    }
});
exports.default = AUTH;
