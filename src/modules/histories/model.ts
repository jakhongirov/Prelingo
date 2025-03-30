import { fetchALL, fetch } from '../../lib/postgres';
import { IHistories } from '../../types/histories';

const historiesList = (
	limit: number,
	page: number,
): Promise<IHistories[] | null> => {
	const QUERY: string = `
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

	return fetchALL<IHistories>(QUERY, limit, Number((page - 1) * limit));
};
const foundHistories = (id: number): Promise<IHistories[] | null> => {
	const QUERY: string = `
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

	return fetchALL<IHistories>(QUERY, id);
};

export default {
	historiesList,
	foundHistories,
};
