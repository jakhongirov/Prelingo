import { fetchALL, fetch } from '../../lib/postgres';
import { IHistoriesBalance } from '../../types/history-balance';

const historiesBalanceList = (
	limit: number,
	page: number,
): Promise<IHistoriesBalance[] | null> => {
	const QUERY: string = `
      SELECT
         h.user_id,
         u.name,
         u.phone_number,
         u.email,
         h.category,
         h.amount,
         h.create_at
      FROM
         histories_balance h
      JOIN
         users u
      ON
         h.user_id = u.id
      ORDER BY
         h.id DESC
      LIMIT $1
      OFFSET $2;
   `;

	return fetchALL<IHistoriesBalance>(QUERY, limit, Number((page - 1) * limit));
};
const foundHistoriesBalance = (
	id: number,
): Promise<IHistoriesBalance[] | null> => {
	const QUERY: string = `
      SELECT
         h.user_id,
         u.name,
         u.phone_number,
         u.email,
         u.balance,
         h.category,
         h.amount,
         h.create_at
      FROM
         histories_balance h
      JOIN
         users u
      ON
         h.user_id = u.id
      WHERE
         h.user_id = $1
      ORDER BY
         h.id DESC;
   `;

	return fetchALL<IHistoriesBalance>(QUERY, id);
};

export default {
	historiesBalanceList,
	foundHistoriesBalance,
};
