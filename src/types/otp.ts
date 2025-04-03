interface IOtp {
	readonly id?: string;
	chat_id?: number | string;
	code?: string;
	status?: boolean;
	readonly create_at?: string;
}

export { IOtp };
