import { fetch, fetchALL } from '../../lib/postgres';
import { IOtp } from '../../types/otp';
import { IUsers, IUser } from '../../types/users';

const usersList = (limit: number, page: number): Promise<IUsers[] | null> => {
	const QUERY: string = `
      SELECT
         *
      FROM
         users
      ORDER BY
         id DESC
      LIMIT $1
      OFFSET $2;
   `;

	return fetchALL<IUsers>(QUERY, limit, Number((page - 1) * limit));
};
const userByID = (id: number | string | undefined): Promise<IUsers | null> => {
	const QUERY: string = `
      SELECT
         *
      FROM
         users
      WHERE
         id = $1;
   `;

	return fetch<IUsers>(QUERY, id);
};
const createUser = (
	userData: IUser,
	password: string,
	referral_code: string,
) => {
	const QUERY: string = `
      INSERT INTO
         users (
            phone_number,
            password,
            referral_code
         ) VALUES (
            $1, 
            $2, 
            $3
         ) RETURNING *;
   `;

	return fetch<IUsers>(QUERY, userData.phone_number, password, referral_code);
};
const foundUserByEmail = (email: string) => {
	const QUERY: string = `
      SELECT
         *
      FROM
         users
      WHERE
         email = $1;
   `;

	return fetch<IUsers>(QUERY, email);
};
const foundUserEmail = (email: string, id: string) => {
	const QUERY: string = `
      SELECT
         *
      FROM
         users
      WHERE
         email = $1 or email_id = $2;
   `;

	return fetch<IUsers>(QUERY, email, id);
};
const createUserEmail = (
	email: string,
	surname: string,
	name: string,
	country: string,
	region: string,
	pass_hash: string,
) => {
	const QUERY = `
      INSERT INTO
         users (
            email,
            surname,
            name,
            country,
            region,
            password
         ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
         ) RETURNING *;
   `;

	return fetch<IUsers>(
		QUERY,
		email,
		surname,
		name,
		country,
		region,
		pass_hash,
	);
};
const foundOtp = (code: string) => {
	const QUERY: string = `
      SELECT
         *
      FROM
         otp
      WHERE
         code = $1
         and created_at >= NOW() - INTERVAL '5 minutes'
         and status = true;
   `;

	return fetch<IOtp>(QUERY, code);
};
const editOtpStatus = (id: string | number) => {
	const QUERY: string = `
      UPDATE
         otp
      SET
         status = false
      WHERE
         id = $1
      RETURNING *;
   `;

	return fetch<IOtp>(QUERY, id);
};
const foundUserChatId = (chat_id: number | string) => {
	const QUERY: string = `
      SELECT
         *
      FROM
         users
      WHERE
         chat_id = $1;
   `;

	return fetch<IUsers>(QUERY, chat_id);
};
const addUser = (
	id: string,
	email?: string,
	name?: string,
	phone?: string,
): Promise<IUsers | null> => {
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

	return fetch<IUsers>(QUERY, id, email, name, phone);
};
const foundUser = (data: string | undefined) => {
	const QUERY: string = `
      SELECT
         *
      FROM
         users
      WHERE
         phone_number = $1 OR email = $1;
   `;

	return fetch<IUsers>(QUERY, data);
};
const editSurname = (id: string, surnmae: string) => {
	const QUERY: string = `
      UPDATE
         users
      SET
         surname = $2
      WHERE
         id = $1
      RETURNING *;
   `;

	return fetch<IUser>(QUERY, id, surnmae);
};
const editName = (id: string, name: string) => {
	const QUERY: string = `
      UPDATE
         users
      SET
         name = $2
      WHERE
         id = $1
      RETURNING *;
   `;

	return fetch<IUser>(QUERY, id, name);
};
const editPhoneNumber = (id: string, phone_number: string) => {
	const QUERY: string = `
      UPDATE
         users
      SET
         phone_number = $2
      WHERE
         id = $1
      RETURNING *;
   `;

	return fetch<IUser>(QUERY, id, phone_number);
};
const editEmail = (id: string, email: string) => {
	const QUERY: string = `
      UPDATE
         users
      SET
         email = $2
      WHERE
         id = $1
      RETURNING *;
   `;

	return fetch<IUser>(QUERY, id, email);
};
const editPassword = (id: string, password: string) => {
	const QUERY: string = `
      UPDATE
         users
      SET
         password = $2
      WHERE
         id = $1
      RETURNING *;
   `;

	return fetch<IUser>(QUERY, id, password);
};
const editCountry = (id: string, country: string) => {
	const QUERY: string = `
      UPDATE
         users
      SET
         country = $2
      WHERE
         id = $1
      RETURNING *;
   `;

	return fetch<IUser>(QUERY, id, country);
};
const editRegion = (id: string, region: string) => {
	const QUERY: string = `
      UPDATE
         users
      SET
         region = $2
      WHERE
         id = $1
      RETURNING *;
   `;

	return fetch<IUser>(QUERY, id, region);
};
const editCountStars = (id: string, count_starts: number) => {
	const QUERY: string = `
      UPDATE
         users
      SET
         count_stars = $2
      WHERE
         id = $1
      RETURNING *;
   `;

	return fetch<IUser>(QUERY, id, count_starts);
};
const editBalance = (id: string, balance: number) => {
	const QUERY: string = `
      UPDATE
         users
      SET
         balance = $2
      WHERE
         id = $1
      RETURNING *;
   `;

	return fetch<IUser>(QUERY, id, balance);
};
const deleteUser = (id: number) => {
	const QUERY: string = `
      DELETE FROM
         users
      WHERE
         id = $1
      RETURNING *;
   `;

	return fetch<IUser>(QUERY, id);
};

export default {
	usersList,
	userByID,
	createUser,
	foundUserByEmail,
	foundUserEmail,
	createUserEmail,
	foundOtp,
	editOtpStatus,
	foundUserChatId,
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
