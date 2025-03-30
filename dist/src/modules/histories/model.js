"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = require("../../lib/postgres");
const historiesList = (limit, page) => {
    const QUERY = `
      SELECT
         h.user_id,
         u.name,
         u.phone_number,
         u.email,
         h.user_count,
         h.amount,
         h.create_at
      FROM
         histories h
      JOIN
         users u
      ON
         h.user_id = u.id
      ORDER BY
         h.id DESC
      LIMIT $1
      OFFSET $2;
   `;
    return (0, postgres_1.fetchALL)(QUERY, limit, Number((page - 1) * limit));
};
const foundHistories = (id) => {
    const QUERY = `
      SELECT
         h.user_id,
         u.name,
         u.phone_number,
         u.email,
         u.balance,
         h.user_count,
         h.amount,
         h.create_at
      FROM
         histories h
      JOIN
         users u
      ON
         h.user_id = u.id
      WHERE
         h.user_id = $1
      ORDER BY
         h.id DESC;
   `;
    return (0, postgres_1.fetchALL)(QUERY, id);
};
exports.default = {
    historiesList,
    foundHistories,
};
