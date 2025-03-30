"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = require("../../lib/postgres");
const usersList = (limit, page) => {
    const QUERY = `
      SELECT
         *
      FROM
         users
      ORDER BY
         id DESC
      LIMIT $1
      OFFSET $2;
   `;
    return (0, postgres_1.fetchALL)(QUERY, limit, Number((page - 1) * limit));
};
const userByID = (id) => {
    const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         id = $1;
   `;
    return (0, postgres_1.fetch)(QUERY, id);
};
const userByToken = (token) => {
    const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         $1 = ANY (app_token);
   `;
    return (0, postgres_1.fetch)(QUERY, token);
};
const createUser = (userData, password, referral_code) => {
    const QUERY = `
      INSERT INTO
         users (
            phone_number,
            password,
            referral_code,
            app_token
         ) VALUES (
            $1, 
            $2, 
            $3,
            ARRAY [$4]
         ) RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, userData.phone_number, password, referral_code, userData.app_token);
};
const foundUserByEmail = (email) => {
    const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         email = $1;
   `;
    return (0, postgres_1.fetch)(QUERY, email);
};
const foundUserEmail = (email, id) => {
    const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         email = $1 or email_id = $2;
   `;
    return (0, postgres_1.fetch)(QUERY, email, id);
};
const addToken = (id, app_token) => {
    const QUERY = `
      UPDATE
         users
      SET
         app_token = array_append(app_token, $2)
      WHERE
         id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id, app_token);
};
const createUserEmail = (email, app_token) => {
    const QUERY = `
      INSERT INTO
         users (
            email,
            app_token
         ) VALUES (
            $1,
            ARRAY[$2]
         ) RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, email, app_token);
};
const addUser = (id, email, name, phone) => {
    const QUERY = `
      INSERT INTO
         users (
            email_id,
            email,
            name,
            phone_number
         ) VALUES (
            $1, 
            $2, 
            $3, 
            $4 
         ) RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id, email, name, phone);
};
const foundUser = (data) => {
    const QUERY = `
      SELECT
         *
      FROM
         users
      WHERE
         phone_number = $1 OR email = $1;
   `;
    return (0, postgres_1.fetch)(QUERY, data);
};
const editSurname = (id, surnmae) => {
    const QUERY = `
      UPDATE
         users
      SET
         surname = $2
      WHERE
         id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id, surnmae);
};
const editName = (id, name) => {
    const QUERY = `
      UPDATE
         users
      SET
         name = $2
      WHERE
         id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id, name);
};
const editPhoneNumber = (id, phone_number) => {
    const QUERY = `
      UPDATE
         users
      SET
         phone_number = $2
      WHERE
         id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id, phone_number);
};
const editEmail = (id, email) => {
    const QUERY = `
      UPDATE
         users
      SET
         email = $2
      WHERE
         id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id, email);
};
const editPassword = (id, password) => {
    const QUERY = `
      UPDATE
         users
      SET
         password = $2
      WHERE
         id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id, password);
};
const editCountry = (id, country) => {
    const QUERY = `
      UPDATE
         users
      SET
         country = $2
      WHERE
         id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id, country);
};
const editRegion = (id, region) => {
    const QUERY = `
      UPDATE
         users
      SET
         region = $2
      WHERE
         id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id, region);
};
const editCountStars = (id, count_starts) => {
    const QUERY = `
      UPDATE
         users
      SET
         count_stars = $2
      WHERE
         id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id, count_starts);
};
const editBalance = (id, balance) => {
    const QUERY = `
      UPDATE
         users
      SET
         balance = $2
      WHERE
         id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id, balance);
};
const deleteUser = (id) => {
    const QUERY = `
      DELETE FROM
         users
      WHERE
         id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id);
};
exports.default = {
    usersList,
    userByID,
    userByToken,
    createUser,
    foundUserByEmail,
    foundUserEmail,
    addToken,
    createUserEmail,
    addUser,
    foundUser,
    editSurname,
    editName,
    editPhoneNumber,
    editEmail,
    editPassword,
    editCountry,
    editRegion,
    editCountStars,
    editBalance,
    deleteUser,
};
