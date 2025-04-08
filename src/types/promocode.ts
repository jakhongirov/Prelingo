interface IPromocode {
	readonly id?: string;
	referral_code: string;
	parent_id?: number;
	position: string;
	promocode: string;
	status: boolean;
	readonly create_at?: string;
}

export { IPromocode };
