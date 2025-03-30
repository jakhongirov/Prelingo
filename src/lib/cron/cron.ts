import model from './model';
import { pool } from '../postgres';
import { IUsers } from '../../types/users';
import Cursor from 'pg-cursor';

function calculatePercentage(amount: number, percentage: number): number {
	return (amount * percentage) / 100;
}

const countBonus = async () => {
	const client = await pool.connect();

	try {
		const cursor = client.query(new Cursor(model.ALL_USER_QUERY));

		function readNext(): void {
			cursor.read(100, async (err: any, rows: IUsers[]) => {
				if (err) {
					console.error('Error reading from cursor:', err);
					cursor.close(() => client.release());
				}

				if (rows.length === 0) {
					cursor.close(() => client.release());
					return;
				}

				await Promise.all(rows.map(processUser));
				setImmediate(readNext);
			});
		}

		readNext();
	} catch (error) {
		console.error(error);
		client.release();
	}
};

async function processUser(user: IUsers): Promise<void> {
	const userLeftPosition = await model.userPosition(user.id!, 'left');
	const userRightPosition = await model.userPosition(user.id!, 'right');
	const countUserLeft = await model.countUser(userLeftPosition?.referral_code);
	const countUserRight = await model.countUser(
		userRightPosition?.referral_code,
	);
	const minCount = Math.min(
		countUserLeft ? Number(countUserLeft?.count) + 1 : 0,
		countUserRight ? Number(countUserRight?.count) + 1 : 0,
	);
	const historyUser = await model.historyUser(user.id!);

	if (historyUser) {
		const canculatedUser = minCount - historyUser.user_count;
		const canculatedAmount = calculatePercentage(canculatedUser * 100, 20);
		await model.addHistory(user.id!, canculatedAmount, canculatedUser);
		await model.addHistoryBalance(user.id!, canculatedAmount);
		await model.editUserBalance(user.id!, canculatedAmount);
	} else {
		const canculatedAmount = calculatePercentage(minCount * 100, 20);
		await model.createHistory(user.id!, canculatedAmount, minCount);
		await model.addHistoryBalance(user.id!, canculatedAmount);
		await model.editUserBalance(user.id!, canculatedAmount);
	}

	await new Promise((resolve) => setTimeout(resolve, 100));
}

export { countBonus };
