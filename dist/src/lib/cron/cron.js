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
exports.countBonus = void 0;
const model_1 = __importDefault(require("./model"));
const postgres_1 = require("../postgres");
const pg_cursor_1 = __importDefault(require("pg-cursor"));
function calculatePercentage(amount, percentage) {
    return (amount * percentage) / 100;
}
const countBonus = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield postgres_1.pool.connect();
    try {
        const cursor = client.query(new pg_cursor_1.default(model_1.default.ALL_USER_QUERY));
        function readNext() {
            cursor.read(100, (err, rows) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.error('Error reading from cursor:', err);
                    cursor.close(() => client.release());
                }
                if (rows.length === 0) {
                    cursor.close(() => client.release());
                    return;
                }
                yield Promise.all(rows.map(processUser));
                setImmediate(readNext);
            }));
        }
        readNext();
    }
    catch (error) {
        console.error(error);
        client.release();
    }
});
exports.countBonus = countBonus;
function processUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const userLeftPosition = yield model_1.default.userPosition(user.id, 'left');
        const userRightPosition = yield model_1.default.userPosition(user.id, 'right');
        const countUserLeft = yield model_1.default.countUser(userLeftPosition === null || userLeftPosition === void 0 ? void 0 : userLeftPosition.referral_code);
        const countUserRight = yield model_1.default.countUser(userRightPosition === null || userRightPosition === void 0 ? void 0 : userRightPosition.referral_code);
        const minCount = Math.min(countUserLeft ? Number(countUserLeft === null || countUserLeft === void 0 ? void 0 : countUserLeft.count) + 1 : 0, countUserRight ? Number(countUserRight === null || countUserRight === void 0 ? void 0 : countUserRight.count) + 1 : 0);
        const historyUser = yield model_1.default.historyUser(user.id);
        if (historyUser) {
            const canculatedUser = minCount - historyUser.user_count;
            const canculatedAmount = calculatePercentage(canculatedUser * 100, 20);
            yield model_1.default.addHistory(user.id, canculatedAmount, canculatedUser);
            yield model_1.default.addHistoryBalance(user.id, canculatedAmount);
            yield model_1.default.editUserBalance(user.id, canculatedAmount);
        }
        else {
            const canculatedAmount = calculatePercentage(minCount * 100, 20);
            yield model_1.default.createHistory(user.id, canculatedAmount, minCount);
            yield model_1.default.addHistoryBalance(user.id, canculatedAmount);
            yield model_1.default.editUserBalance(user.id, canculatedAmount);
        }
        yield new Promise((resolve) => setTimeout(resolve, 100));
    });
}
