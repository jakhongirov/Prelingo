import { fetchALL, fetch } from '../../lib/postgres';
import { IDevices } from '../../types/devices';

const devicesList = (
	limit: number,
	page: number,
): Promise<IDevices[] | null> => {
	const QUERY = `
      SELECT
         *
      FROM
         devices
      ORDER BY
         id DESC
      LIMIT $1
      OFFSET $2;
   `;

	return fetchALL<IDevices>(QUERY, limit, Number((page - 1) * limit));
};
const foundUserDevices = (
	user_id: string | number | undefined,
): Promise<IDevices[] | null> => {
	const QUERY = `
      SELECT
         *
      FROM
         devices
      WHERE
         user_id = $1
      ORDER BY
         id DESC;
   `;

	return fetchALL<IDevices>(QUERY, user_id);
};
const addDevice = (
	user_id: string | number | undefined,
	phone_brand: string | undefined,
	phone_lang: string | undefined,
	app_lang: string | undefined,
	platform: string | undefined,
): Promise<IDevices | null> => {
	const QUERY = `
      INSERT INTO
         devices (
            user_id,
            phone_brand,
            phone_lang,
            app_lang,
            platform
         ) VALUES (
            $1, 
            $2, 
            $3, 
            $4, 
            $5 
         ) RETURNING *;
   `;

	return fetch<IDevices>(
		QUERY,
		user_id,
		phone_brand,
		phone_lang,
		app_lang,
		platform,
	);
};
const editPhoneBrand = (
	id: string | undefined,
	user_id: string | number | undefined,
	phone_brand: string | undefined,
): Promise<IDevices | null> => {
	const QUERY = `
      UPDATE
         devices
      SET
         phone_brand = $3
      WHERE
         id = $1 and user_id = $2
      RETURNING *;
   `;

	return fetch<IDevices>(QUERY, id, user_id, phone_brand);
};
const editPhoneLang = (
	id: string | undefined,
	user_id: string | number | undefined,
	phone_lang: string | undefined,
): Promise<IDevices | null> => {
	const QUERY = `
      UPDATE
         devices
      SET
         phone_lang = $3
      WHERE
         id = $1 and user_id = $2
      RETURNING *;
   `;

	return fetch<IDevices>(QUERY, id, user_id, phone_lang);
};
const editAppLang = (
	id: string | undefined,
	user_id: string | number | undefined,
	app_lang: string | undefined,
): Promise<IDevices | null> => {
	const QUERY = `
      UPDATE
         devices
      SET
         app_lang = $3
      WHERE
         id = $1 and user_id = $2
      RETURNING *;
   `;

	return fetch<IDevices>(QUERY, id, user_id, app_lang);
};
const editPlatform = (
	id: string | undefined,
	user_id: string | number | undefined,
	platform: string | undefined,
): Promise<IDevices | null> => {
	const QUERY = `
      UPDATE
         devices
      SET
         platform = $3
      WHERE
         id = $1 and user_id = $2
      RETURNING *;
   `;

	return fetch<IDevices>(QUERY, id, user_id, platform);
};
const foundDevice = (
	id: string | undefined,
	user_id: string | number | undefined,
): Promise<IDevices | null> => {
	const QUERY = `
      SELECT
         *
      FROM
         devices
      WHERE
         id = $1 and user_id = $2
   `;

	return fetch<IDevices>(QUERY, id, user_id);
};
const deleteDevice = (
	id: string | undefined,
	user_id: string | number | undefined,
): Promise<IDevices | null> => {
	const QUERY = `
      DELETE FROM 
         devices
      WHERE
         id = $1 and user_id = $2
      RETURNING *;
   `;

	return fetch<IDevices>(QUERY, id, user_id);
};

export default {
	devicesList,
	foundUserDevices,
	addDevice,
	editPhoneBrand,
	editPhoneLang,
	editAppLang,
	editPlatform,
	foundDevice,
	deleteDevice,
};
