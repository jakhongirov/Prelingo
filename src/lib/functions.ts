const buildTree = async (rows: any[]): Promise<any[]> => {
	const map: Record<string, any> = {};

	rows.forEach((item) => {
		map[item.user_id] = { ...item, child: [] };
	});

	let root: any[] = [];

	rows.forEach((item) => {
		if (item.parent_id && map[item.parent_id]) {
			map[item.parent_id].child.push(map[item.user_id]);
		} else {
			root.push(map[item.user_id]);
		}
	});

	return root;
};

const generateOTP = (length: number) => {
	let otp = '';
	const digits = '0123456789';

	for (let i = 0; i < length; i++) {
		// Append a random digit from the `digits` string
		otp += digits[Math.floor(Math.random() * digits.length)];
	}

	return otp;
};

function generatePromoCode(length: number = 6): string {
	const chars: string =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let promoCode: string = '';
	for (let i = 0; i < length; i++) {
		const randomIndex: number = Math.floor(Math.random() * chars.length);
		promoCode += chars[randomIndex];
	}
	return promoCode;
}

export { buildTree, generateOTP, generatePromoCode };
