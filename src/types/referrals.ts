interface IReferrals {
	readonly id?: string;
	user_id?: number;
	name?: string;
	surname?: string;
	image_url?: string;
	referral_code: string;
	parent_id?: number;
	position?: string;
	level?: number;
	readonly create_at?: string;
}

interface IReferral extends Omit<IReferrals, 'id' | 'created_at'> {}

interface ILevel {
	max_level: number;
}

interface ICount {
	count: number;
}

export { IReferrals, IReferral, ILevel, ICount };
