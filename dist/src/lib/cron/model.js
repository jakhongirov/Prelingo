"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = require("../postgres");
const ALL_USER_QUERY = `
   SELECT
      id,
      referral_code
   FROM
      users
   ORDER BY
      id ASC;
`;
const userPosition = (id, position) => {
    const QUERY = `
      SELECT
         u.id,
         u.referral_code
      FROM
         referrals r
      JOIN
         users u 
      ON 
         u.id = r.user_id
      WHERE
         r.parent_id = $1 AND position = $2;
   `;
    return (0, postgres_1.fetch)(QUERY, id, position);
};
const countUser = (referral_code) => {
    const QUERY = `
      WITH RECURSIVE referral_chain AS (
         SELECT 
            r.id, 
            u.id AS user_id, 
            u.name, 
            r.referral_code, 
            r.parent_id,
            r.position,
            1 AS level
         FROM 
            referrals r
         JOIN 
            users u ON u.id = r.user_id
         WHERE 
            r.parent_id = (SELECT id FROM users WHERE referral_code = $1)

         UNION ALL

         SELECT 
            r.id, 
            u.id, 
            u.name, 
            r.referral_code,
            r.parent_id,
            r.position,
            rc.level + 1
         FROM 
            referrals r
         JOIN 
            users u ON u.id = r.user_id
         JOIN 
            referral_chain rc 
         ON 
            rc.user_id = r.parent_id
      )
      SELECT COUNT(DISTINCT user_id) FROM referral_chain;
   `;
    return (0, postgres_1.fetch)(QUERY, referral_code);
};
const historyUser = (id) => {
    const QUERY = `
      SELECT
         *
      FROM
         histories
      WHERE
         user_id = $1;
   `;
    return (0, postgres_1.fetch)(QUERY, id);
};
const addHistory = (id, canculatedAmount, canculatedUser) => {
    const QUERY = `
      UPDATE
         histories
      SET
         amount = $2,
         user_count = $3
      WHERE
         user_id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id, canculatedAmount, canculatedUser);
};
const addHistoryBalance = (id, canculatedAmount) => {
    const QUERY = `
      INSERT INTO
         histories_balance (
            user_id,
            amount,
            category
         ) VALUES (
            $1,
            $2,
            'BB'
         ) RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id, canculatedAmount);
};
const createHistory = (id, canculatedAmount, canculatedUser) => {
    const QUERY = `
      INSERT INTO
         histories (
            user_id,
            amount,
            user_count
         ) VALUES (
            $1,
            $2,
            $3
         ) RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, id, canculatedAmount, canculatedUser);
};
const editUserBalance = (user_id, amount) => {
    const QUERY = `
      UPDATE
         users
      SET
         balance = balance + $2
      WHERE
         id = $1
      RETURNING *;
   `;
    return (0, postgres_1.fetch)(QUERY, user_id, amount);
};
exports.default = {
    ALL_USER_QUERY,
    userPosition,
    countUser,
    historyUser,
    addHistory,
    addHistoryBalance,
    createHistory,
    editUserBalance,
};
