import { fetchALL, fetch } from '../postgres';
import { IReferrals, ICount } from '../../types/referrals';
import { IUser, IUsers } from '../../types/users';
import { IHistories } from '../../types/histories';
import { IHistoriesBalance } from '../../types/history-balance';

const ALL_USER_QUERY = `
   SELECT
      id,
      referral_code
   FROM
      users
   ORDER BY
      id ASC;
`;

const userPosition = (
	id: number | string,
	position: string,
): Promise<IUsers | null> => {
	const QUERY: string = `
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

	return fetch<IUsers>(QUERY, id, position);
};
const countUser = (
	referral_code: string | undefined,
): Promise<ICount | null> => {
	const QUERY: string = `
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

	return fetch<ICount>(QUERY, referral_code);
};
const historyUser = (id: number | string): Promise<IHistories | null> => {
	const QUERY: string = `
      SELECT
         *
      FROM
         histories
      WHERE
         user_id = $1;
   `;

	return fetch<IHistories>(QUERY, id);
};
const addHistory = (
	id: string | number,
	canculatedAmount: number,
	canculatedUser: number,
): Promise<IHistories | null> => {
	const QUERY: string = `
      UPDATE
         histories
      SET
         amount = $2,
         user_count = $3
      WHERE
         user_id = $1
      RETURNING *;
   `;

	return fetch<IHistories>(QUERY, id, canculatedAmount, canculatedUser);
};
const addHistoryBalance = (
	id: string | number,
	canculatedAmount: number,
): Promise<IHistoriesBalance | null> => {
	const QUERY: string = `
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

	return fetch<IHistoriesBalance>(QUERY, id, canculatedAmount);
};
const createHistory = (
	id: string | number,
	canculatedAmount: number,
	canculatedUser: number,
): Promise<IHistories | null> => {
	const QUERY: string = `
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

	return fetch<IHistories>(QUERY, id, canculatedAmount, canculatedUser);
};
const editUserBalance = (
	user_id: number | string,
	amount: number,
): Promise<IUsers | null> => {
	const QUERY: string = `
      UPDATE
         users
      SET
         balance = balance + $2
      WHERE
         id = $1
      RETURNING *;
   `;

	return fetch<IUsers>(QUERY, user_id, amount);
};

export default {
	ALL_USER_QUERY,
	userPosition,
	countUser,
	historyUser,
	addHistory,
	addHistoryBalance,
	createHistory,
	editUserBalance,
};
