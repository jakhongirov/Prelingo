import { Request, Response } from 'express';
import model from './model';

const GET_LIST = async (req: Request, res: Response) => {
	try {
		const limit = Number(req.query.limit) || 10;
		const page = Number(req.query.page) || 1;

		if (limit && page) {
			const historiesBalanceList = await model.historiesBalanceList(
				limit,
				page,
			);

			if (historiesBalanceList && historiesBalanceList.length > 0) {
				res.status(200).json({
					status: 200,
					message: 'Success',
					data: historiesBalanceList,
				});
				return;
			} else {
				res.status(404).json({
					status: 404,
					message: 'Not found',
				});
				return;
			}
		} else {
			res.status(400).json({
				status: 400,
				message: 'Bad request (limit and page is not exist)',
			});
			return;
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			status: 500,
			message: 'Interval Server Error',
		});
		return;
	}
};

const GET_USER_ID = async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.user_id);
		const foundHistoriesBalance = await model.foundHistoriesBalance(id);

		if (foundHistoriesBalance) {
			res.status(200).json({
				status: 200,
				message: 'Success',
				data: foundHistoriesBalance,
			});
		} else {
			res.status(404).json({
				status: 404,
				message: 'Not found',
			});
			return;
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			status: 500,
			message: 'Interval Server Error',
		});
		return;
	}
};

export default {
	GET_LIST,
	GET_USER_ID,
};
