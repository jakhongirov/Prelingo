interface IHistories {
	readonly id?: number;
	user_id: number;
	amount: number;
	user_count: number;
	readonly create_at?: string;
}

export { IHistories };
