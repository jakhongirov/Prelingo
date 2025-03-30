interface IDevices {
	readonly id?: string;
	user_id?: number | string;
	phone_brand?: string;
	phone_lang?: string;
	app_lang?: string;
	platform?: string;
	readonly create_at?: string;
}

export { IDevices };
