import { fetch, fetchALL } from '../../lib/postgres';
import { IHistoriesBalance } from '../../types/history-balance';
import { IReferrals, ILevel } from '../../types/referrals';
import { IUsers } from '../../types/users';

const referralList = (
	limit: number,
	page: number,
): Promise<IReferrals[] | null> => {
	const QUERY: string = `
      SELECT DISTINCT 
         u.id, u.name, u.referral_code
      FROM 
         users u
      JOIN 
         referrals r 
      ON 
         u.id = r.parent_id
      WHERE 
         u.id NOT IN (SELECT user_id FROM referrals)
      ORDER BY
         u.id DESC
      LIMIT $1
      OFFSET $2;
   `;

	return fetchALL<IReferrals>(QUERY, limit, Number((page - 1) * limit));
};

const referralsList = (
	referral_code: string | undefined,
): Promise<IReferrals[] | null> => {
	const QUERY: string = `
      WITH RECURSIVE referral_chain AS (
         -- Base Case: Only fetch the user who directly matches the referral code
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
            r.parent_id = (SELECT id FROM users WHERE referral_code = $1)  -- Only direct referrals

         UNION ALL

         -- Recursive Case: Fetch referrals of the already selected users
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
      SELECT 
         id, user_id, name, referral_code, parent_id, position, level
      FROM
         referral_chain
      ORDER BY 
         level, user_id;
   `;

	return fetchALL<IReferrals>(QUERY, referral_code);
};
const referringUser = (
	referral_code: string | undefined,
): Promise<IUsers | null> => {
	const QUERY: string = `
      SELECT
         u.id,
         u.name,
         u.referral_code
      FROM
         referrals r
      JOIN
         users u
      ON
         r.parent_id = u.id
      WHERE
         r.user_id = (SELECT id FROM users WHERE referral_code = $1); 
   `;

	return fetch<IUsers>(QUERY, referral_code);
};
const foundUserByReferralCode = (
	referral_code: string,
): Promise<IUsers | null> => {
	const QUERY: string = `
      SELECT
         *
      FROM
         users
      WHERE
         referral_code = $1;
   `;

	return fetch<IUsers>(QUERY, referral_code);
};
const checkReferral = (referral_code: string): Promise<IReferrals[] | null> => {
	const QUERY: string = `
      SELECT
         *
      FROM
         referrals
      WHERE
         parent_id = (
            SELECT
               id
            FROM
               users
            WHERE
               referral_code = $1
         );
   `;

	return fetchALL<IReferrals>(QUERY, referral_code);
};
const checkActive = (referral_code: string): Promise<ILevel | null> => {
	const QUERY: string = `
      WITH RECURSIVE referral_tree AS (
         -- Base Case: Get referrals whose parent matches the given referral_code
         SELECT r.user_id, r.parent_id, r.position, 1 AS level, r.create_at
         FROM referrals r
         WHERE r.parent_id = (SELECT id FROM users WHERE referral_code = $1 LIMIT 1)
               AND DATE_TRUNC('month', r.create_at) = DATE_TRUNC('month', CURRENT_DATE)

         UNION ALL

         -- Recursive Case: Get referrals under the tree, without filtering by create_at again
         SELECT r.user_id, r.parent_id, r.position, rt.level + 1, r.create_at
         FROM referrals r
         JOIN referral_tree rt ON r.parent_id = rt.user_id
      )
      SELECT MAX(level) AS max_level
      FROM referral_tree;
   `;

	return fetch<ILevel>(QUERY, referral_code);
};
const createReferral = (
	user_id: number | undefined | string,
	referral_code: string,
	parent_id: number | string,
	position: string,
): Promise<IReferrals | null> => {
	const QUERY: string = `
      INSERT INTO
         referrals (
            user_id,
            referral_code,
            parent_id,
            position
         ) VALUES (
            $1, 
            $2, 
            $3,
            $4
         ) RETURNING *;
   `;

	return fetch<IReferrals>(QUERY, user_id, referral_code, parent_id, position);
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
const addHistoryBalance = (
	user_id: number | string,
	amount: number,
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
            'RB'
         ) RETURNING *;
   `;

	return fetch<IHistoriesBalance>(QUERY, user_id, amount);
};

export default {
	referralList,
	referralsList,
	foundUserByReferralCode,
	checkReferral,
	checkActive,
	createReferral,
	editUserBalance,
	addHistoryBalance,
	referringUser,
};
