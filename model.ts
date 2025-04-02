import { fetch } from './src/lib/postgres';
import { IUsers } from './src/types/users';

const addToken = (
	id: string | undefined,
	param: string,
): Promise<IUsers | null> => {
	const QUERY: string = `
      UPDATE
         users
      SET
         array_append(app_token, $2)
      WHERE
         id = $1
      RETURNING *;
   `;

	return fetch<IUsers>(QUERY, id, param);
};
const foundUserByParam = (param: string): Promise<IUsers | null> => {
	const QUERY: string = `
      SELECT 
         * 
      FROM 
         users 
      WHERE 
         app_token @> ARRAY[$1];
   `;

	return fetch<IUsers>(QUERY, param);
};
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
const createUser = (
	chatId: number,
	param: string,
	step: string,
): Promise<IUsers | null> => {
	const QUERY: string = `
      INSERT INTO
         users (
            chat_id,
            app_token,
            bot_step,
            telegram
         ) VALUES (
            $1,
            ARRAY [$2],
            $3,
            true
         ) RETURNING *;
   `;

	return fetch<IUsers>(QUERY, chatId, param, step);
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
	const QUERY: string = ``;

	return fetch<IUsers>(QUERY, chatId, phoneNumber);
};

export default {
	addToken,
	foundUserByParam,
	foundUser,
	addChatIDUser,
	createUser,
	editStep,
	addBotLang,
	addPhoneNumber,
};
