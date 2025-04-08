interface IUsers {
	readonly id?: string;
	surname?: string;
	name?: string;
	phone_number?: string;
	email?: string | null;
	email_id?: string | null;
	password?: string | null;
	country?: string | null;
	region?: string | null;
	count_stars?: number | null;
	balance?: number;
	image_url?: string;
	image_name?: string;
	referral_code?: string;
	referral_status?: boolean;
	chat_id?: number;
	bot_step?: string;
	bot_lang?: string;
	telegram?: boolean;
	app_token?: Array<string>;
	readonly create_at?: string;
}

interface IUser extends Omit<IUsers, 'id' | 'created_at' | 'app_token'> {
	app_token?: string;
}

interface ILogin {
	phone_number?: string;
	password: string;
	app_token: string;
	email?: string;
}

export { IUsers, IUser, ILogin };
