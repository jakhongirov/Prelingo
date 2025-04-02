import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
const app = express();
const server = http.createServer(app);
import PORT from './src/config';
import router from './src/modules/index';
import { CronJob } from 'cron';
import { countBonus } from './src/lib/cron/cron';
import { readFileSync } from 'fs';
import TelegramBot from 'node-telegram-bot-api';
import model from './model';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import session from 'express-session';
import passport from './src/lib/passport';

const publicFolderPath = path.join(__dirname, 'public');
const imagesFolderPath = path.join(publicFolderPath, 'images');

if (!fs.existsSync(publicFolderPath)) {
	fs.mkdirSync(publicFolderPath);
	console.log('Public folder created successfully.');
} else {
	console.log('Public folder already exists.');
}

if (!fs.existsSync(imagesFolderPath)) {
	fs.mkdirSync(imagesFolderPath);
	console.log('Images folder created successfully.');
} else {
	console.log('Images folder already exists within the public folder.');
}

const botText = JSON.parse(readFileSync('./text.json', 'utf-8'));
const bot = new TelegramBot(process.env.BOT_TOKEN!, {
	polling: true,
});

bot.onText(/\/start ?(.*)?/, async (msg, match) => {
	const chatId: number = msg.chat.id;
	const param = match ? match[1]?.trim() : null;
	const foundUser = await model.foundUser(chatId);

	if (param) {
		if (foundUser) {
			if (!foundUser?.app_token?.includes(param)) {
				await model.addToken(foundUser?.id, param);
			}
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
			}).then(async () => {
				await model.editStep(chatId, 'contact');
			});
		} else if (foundUser && foundUser.bot_lang == 'RU') {
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
			}).then(async () => {
				await model.editStep(chatId, 'contact');
			});
		} else if (foundUser && foundUser.bot_lang == 'ENG') {
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
			}).then(async () => {
				await model.editStep(chatId, 'contact');
			});
		} else {
			const foundUserByParam = await model.foundUserByParam(param);
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
			}).then(async () => {
				if (foundUser) {
					await model.editStep(chatId, 'language');
				} else if (foundUserByParam) {
					await model.addChatIDUser(
						foundUserByParam.id!,
						chatId,
						'language',
					);
				} else {
					await model.createUser(chatId, param, 'language');
				}
			});
		}
	}
});

bot.on('message', async (msg) => {
	const chatId = msg.chat.id;
	const text = msg.text;
	const foundUser = await model.foundUser(chatId);

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
			}).then(async () => {
				await model.addBotLang(chatId, 'UZ');
				await model.editStep(chatId, 'contact');
			});
		} else if (text == '🇷🇺 Ру') {
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
			}).then(async () => {
				await model.addBotLang(chatId, 'RU');
				await model.editStep(chatId, 'contact');
			});
		} else if (text == '🇬🇧 Eng') {
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
			}).then(async () => {
				await model.addBotLang(chatId, 'ENG');
				await model.editStep(chatId, 'contact');
			});
		}
	}
});

bot.on('contact', async (msg) => {
	const chatId = msg.chat.id;
	const foundUser = await model.foundUser(chatId);
	let phoneNumber = msg.contact!.phone_number;

	if (!phoneNumber.startsWith('+')) {
		phoneNumber = `+${phoneNumber}`;
	}

	if (foundUser && foundUser.bot_step == 'contact') {
		if (msg.contact!.user_id == msg.from!.id) {
			const addPhoneNumber = await model.addPhoneNumber(chatId, phoneNumber);

			if (addPhoneNumber) {
				if (foundUser && foundUser.bot_lang == 'UZ') {
					bot.sendMessage(chatId, botText.successfullyAddedUz).then(
						async () => {
							await model.editStep(chatId, 'success_add');
						},
					);
				} else if (foundUser && foundUser.bot_lang == 'RU') {
					bot.sendMessage(chatId, botText.successfullyAddedRu).then(
						async () => {
							await model.editStep(chatId, 'success_add');
						},
					);
				} else if (foundUser && foundUser.bot_lang == 'ENG') {
					bot.sendMessage(chatId, botText.successfullyAddedEng).then(
						async () => {
							await model.editStep(chatId, 'success_add');
						},
					);
				}
			}
		} else {
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
			} else if (foundUser && foundUser.bot_lang == 'RU') {
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
			} else if (foundUser && foundUser.bot_lang == 'ENG') {
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
});

const job = new CronJob('0 4 * * *', async () => {
	await countBonus();
	console.log('worked at 4 AM');
});

job.start();

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
				url: 'https://prelingo.admob.uz/api/v1',
			},
		],
	},
	apis: ['./src/modules/index.ts'],
};

const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(
	cors({
		origin: '*',
	}),
);
app.use(express.json());
app.use(
	session({
		secret: 'your-secret-key',
		resave: false,
		saveUninitialized: false,
	}),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use('/public', express.static(path.resolve(__dirname, 'public')));
app.use('/api/v1', router);

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
