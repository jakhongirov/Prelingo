"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = require("./src/lib/postgres");
const addToken = (id, param) => {
    const QUERY = `
      UPDATE
         users
      SET
         array_append(app_token, $2)
      WHERE
         id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id, param);
};
const foundUserByParam = (param) => {
    const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         $1 = ANY(app_token);
   `;
    return (0, postgres_1.fetch)(QUERY, param);
};
const foundUser = (chatId) => {
    const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         chat_id = $1;
   `;
    return (0, postgres_1.fetch)(QUERY, chatId);
};
const addChatIDUser = (id, chatId, step) => {
    const QUERY = `
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
    return (0, postgres_1.fetch)(QUERY, id, chatId, step);
};
const createUser = (chatId, param, step) => {
    const QUERY = `
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
    return (0, postgres_1.fetch)(QUERY, chatId, param, step);
};
const editStep = (chatId, step) => {
    const QUERY = `
      UPDATE
         users
      SET
         bot_step = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, chatId, step);
};
const addBotLang = (chatId, lang) => {
    const QUERY = `
      UPDATE
         users
      SET
         bot_lang = $2
      WHERE
         chat_id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, chatId, lang);
};
const addPhoneNumber = (chatId, phoneNumber) => {
    const QUERY = ``;
    return (0, postgres_1.fetch)(QUERY, chatId, phoneNumber);
};
exports.default = {
    addToken,
    foundUserByParam,
    foundUser,
    addChatIDUser,
    createUser,
    editStep,
    addBotLang,
    addPhoneNumber,
};
