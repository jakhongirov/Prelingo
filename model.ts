import { fetch } from './src/lib/postgres';
import { IOtp } from './src/types/otp';
import { IUsers } from './src/types/users';

const foundUser = (chatId: number): Promise<IUsers | null> => {
	const QUERY: string = `
      SELECT
         *
      FROM
         users
      WHERE
         chat_id = $1;
   `;

	return fetch<IUsers>(QUERY, chatId);
};
const addChatIDUser = (
	id: string,
	chatId: number,
	step: string,
): Promise<IUsers | null> => {
	const QUERY: string = `
      UPDATE
         users
      SET
         chat_id = $2,
         bot_step = $3,
         telegram = true
      WHERE
         id = $1
      RETURNING *;
   `;

	return fetch<IUsers>(QUERY, id, chatId, step);
};
const createUser = (chatId: number, step: string): Promise<IUsers | null> => {
	const QUERY: string = `
      INSERT INTO
         users (
            chat_id,
            bot_step,
            telegram
         ) VALUES (
            $1,
            $2,
            true
         ) RETURNING *;
   `;

	return fetch<IUsers>(QUERY, chatId, step);
};
const editStep = (chatId: number, step: string): Promise<IUsers | null> => {
	const QUERY: string = `
      UPDATE
         users
      SET
         bot_step = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

	return fetch<IUsers>(QUERY, chatId, step);
};
const addBotLang = (chatId: number, lang: string): Promise<IUsers | null> => {
	const QUERY: string = `
      UPDATE
         users
      SET
         bot_lang = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

	return fetch<IUsers>(QUERY, chatId, lang);
};
const addPhoneNumber = (
	chatId: number,
	phoneNumber: string,
): Promise<IUsers | null> => {
	const QUERY: string = `
      UPDATE
         users
      SET
         phone_number = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;

	return fetch<IUsers>(QUERY, chatId, phoneNumber);
};
const addOtp = (otpCode: string, chatId: number) => {
	const QUERY: string = `
      INSERT INTO
         otp (
            code,
            chat_id
         )  VALUES (
            $1,
            $2
         ) RETURNING *;
   `;

	return fetch<IOtp>(QUERY, otpCode, chatId);
};

export default {
	foundUser,
	addChatIDUser,
	createUser,
	editStep,
	addBotLang,
	addPhoneNumber,
	addOtp,
};
