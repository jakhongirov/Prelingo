"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
class JWT {
    constructor(data) {
        this.data = data;
    }
    sign() {
        if (!SECRET_KEY) {
            throw new Error('SECRET_KEY is not defined in environment variables');
        }
        return (0, jsonwebtoken_1.sign)(this.data, SECRET_KEY);
    }
    verify() {
        if (!SECRET_KEY) {
            throw new Error('SECRET_KEY is not defined in environment variables');
        }
        return (0, jsonwebtoken_1.verify)(this.data, SECRET_KEY);
        ;
    }
}
exports.default = JWT;
