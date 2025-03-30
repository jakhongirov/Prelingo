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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const config_1 = __importDefault(require("./src/config"));
const index_1 = __importDefault(require("./src/modules/index"));
const cron_1 = require("./src/lib/cron/cron");
const fs_2 = require("fs");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const model_1 = __importDefault(require("./model"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const publicFolderPath = path_1.default.join(__dirname, 'public');
const imagesFolderPath = path_1.default.join(publicFolderPath, 'images');
if (!fs_1.default.existsSync(publicFolderPath)) {
    fs_1.default.mkdirSync(publicFolderPath);
    console.log('Public folder created successfully.');
}
else {
    console.log('Public folder already exists.');
}
if (!fs_1.default.existsSync(imagesFolderPath)) {
    fs_1.default.mkdirSync(imagesFolderPath);
    console.log('Images folder created successfully.');
}
else {
    console.log('Images folder already exists within the public folder.');
}
const botText = JSON.parse((0, fs_2.readFileSync)('./text.json', 'utf-8'));
const bot = new node_telegram_bot_api_1.default(process.env.BOT_TOKEN, {
    polling: true,
});
bot.onText(/\/start ?(.*)?/, (msg, match) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const chatId = msg.chat.id;
    const param = match ? (_a = match[1]) === null || _a === void 0 ? void 0 : _a.trim() : null;
    const foundUser = yield model_1.default.foundUser(chatId);
    if (param) {
        if (!((_b = foundUser === null || foundUser === void 0 ? void 0 : foundUser.app_token) === null || _b === void 0 ? void 0 : _b.includes(param))) {
            yield model_1.default.addToken(foundUser === null || foundUser === void 0 ? void 0 : foundUser.id, param);
        }
        if (foundUser && foundUser.bot_lang == 'UZ') {
            bot.sendMessage(chatId, botText.startUz, {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: botText.contactBtnUz,
                                request_contact: true,
                            },
                        ],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                yield model_1.default.editStep(chatId, 'contact');
            }));
        }
        else if (foundUser && foundUser.bot_lang == 'RU') {
            bot.sendMessage(chatId, botText.startRu, {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: botText.contactBtnRu,
                                request_contact: true,
                            },
                        ],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                yield model_1.default.editStep(chatId, 'contact');
            }));
        }
        else if (foundUser && foundUser.bot_lang == 'ENG') {
            bot.sendMessage(chatId, botText.startEng, {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: botText.contactBtnEng,
                                request_contact: true,
                            },
                        ],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                yield model_1.default.editStep(chatId, 'contact');
            }));
        }
        else {
            const foundUserByParam = yield model_1.default.foundUserByParam(param);
            bot.sendMessage(chatId, botText.startText, {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: '🇺🇿 Uz',
                            },
                            {
                                text: '🇷🇺 Ру',
                            },
                            {
                                text: '🇬🇧 Eng',
                            },
                        ],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                if (foundUser) {
                    yield model_1.default.editStep(chatId, 'language');
                }
                else if (foundUserByParam) {
                    yield model_1.default.addChatIDUser(foundUserByParam.id, chatId, 'language');
                }
                else {
                    yield model_1.default.createUser(chatId, param, 'language');
                }
            }));
        }
    }
}));
bot.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const text = msg.text;
    const foundUser = yield model_1.default.foundUser(chatId);
    if (foundUser) {
        if (text == '🇺🇿 Uz') {
            bot.sendMessage(chatId, botText.startUz, {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: botText.contactBtnUz,
                                request_contact: true,
                            },
                        ],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                yield model_1.default.addBotLang(chatId, 'UZ');
                yield model_1.default.editStep(chatId, 'contact');
            }));
        }
        else if (text == '🇷🇺 Ру') {
            bot.sendMessage(chatId, botText.startRu, {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: botText.contactBtnRu,
                                request_contact: true,
                            },
                        ],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                yield model_1.default.addBotLang(chatId, 'RU');
                yield model_1.default.editStep(chatId, 'contact');
            }));
        }
        else if (text == '🇬🇧 Eng') {
            bot.sendMessage(chatId, botText.startEng, {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: botText.contactBtnEng,
                                request_contact: true,
                            },
                        ],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            }).then(() => __awaiter(void 0, void 0, void 0, function* () {
                yield model_1.default.addBotLang(chatId, 'ENG');
                yield model_1.default.editStep(chatId, 'contact');
            }));
        }
    }
}));
bot.on('contact', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const foundUser = yield model_1.default.foundUser(chatId);
    let phoneNumber = msg.contact.phone_number;
    if (!phoneNumber.startsWith('+')) {
        phoneNumber = `+${phoneNumber}`;
    }
    if (foundUser && foundUser.bot_step == 'contact') {
        if (msg.contact.user_id == msg.from.id) {
            const addPhoneNumber = yield model_1.default.addPhoneNumber(chatId, phoneNumber);
            if (addPhoneNumber) {
                if (foundUser && foundUser.bot_lang == 'UZ') {
                    bot.sendMessage(chatId, botText.successfullyAddedUz).then(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield model_1.default.editStep(chatId, 'success_add');
                    }));
                }
                else if (foundUser && foundUser.bot_lang == 'RU') {
                    bot.sendMessage(chatId, botText.successfullyAddedRu).then(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield model_1.default.editStep(chatId, 'success_add');
                    }));
                }
                else if (foundUser && foundUser.bot_lang == 'ENG') {
                    bot.sendMessage(chatId, botText.successfullyAddedEng).then(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield model_1.default.editStep(chatId, 'success_add');
                    }));
                }
            }
        }
        else {
            if (foundUser && foundUser.bot_lang == 'UZ') {
                bot.sendMessage(chatId, botText.contactErrorUz, {
                    reply_markup: {
                        keyboard: [
                            [
                                {
                                    text: botText.contactBtnUz,
                                    request_contact: true,
                                },
                            ],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    },
                });
            }
            else if (foundUser && foundUser.bot_lang == 'RU') {
                bot.sendMessage(chatId, botText.contactErrorRu, {
                    reply_markup: {
                        keyboard: [
                            [
                                {
                                    text: botText.contactBtnRu,
                                    request_contact: true,
                                },
                            ],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    },
                });
            }
            else if (foundUser && foundUser.bot_lang == 'ENG') {
                bot.sendMessage(chatId, botText.contactErrorEng, {
                    reply_markup: {
                        keyboard: [
                            [
                                {
                                    text: botText.contactBtnEng,
                                    request_contact: true,
                                },
                            ],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    },
                });
            }
        }
    }
}));
// const job = new CronJob('1 * * * *', async () => {
// 	console.log('worked')
// });
// countBonus();
console.log((0, cron_1.countBonus)());
// job.start();
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PRELINGO API documentation',
            version: '1.0.0',
            description: 'by Diyor Jaxongirov',
        },
        servers: [
            {
                url: 'https://prelingo.com/api/v1',
            },
        ],
    },
    apis: ['./src/modules/index.js'],
};
const specs = (0, swagger_jsdoc_1.default)(options);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.use((0, cors_1.default)({
    origin: '*',
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use('/public', express_1.default.static(path_1.default.resolve(__dirname, 'public')));
app.use('/api/v1', index_1.default);
server.listen(config_1.default, () => {
    console.log(`Server is running on http://localhost:${config_1.default}`);
});
