import { Request, Response } from 'express';
import model from './model';
import { IReferral, IReferrals } from '../../types/referrals';
import { buildTree } from '../../lib/functions';

const GET_LIST = async (req: Request, res: Response) => {
	try {
		const limit = Number(req.query.limit) || 10;
		const page = Number(req.query.page) || 1;

		if (limit && page) {
			const referralList = await model.referralList(limit, page);

			if (referralList && referralList.length > 0) {
				res.status(200).json({
					status: 200,
					message: 'Success',
					data: referralList,
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

const GET_REFERRALS = async (req: Request, res: Response) => {
	try {
		const referral_code: string | undefined = req.params.referral_code
			? req.params.referral_code
			: undefined;

		const referralsList = await model.referralsList(referral_code);
		const referringUser = await model.referringUser(referral_code);

		const data = await buildTree(referralsList!);

		if (referralsList && referralsList.length > 0) {
			res.status(200).json({
				status: 200,
				message: 'Success',
				data: data,
				referraling_user: referringUser,
			});
			return;
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

const CREATE_REFERRAL = async (req: Request, res: Response) => {
	try {
		const referralData: IReferral = req.body;
		const values = referralData.referral_code.split('/');

		const foundUserByReferralCode = await model.foundUserByReferralCode(
			values[0],
		);

		if (foundUserByReferralCode) {
			const checkActive = await model.checkActive(
				foundUserByReferralCode.referral_code
					? foundUserByReferralCode.referral_code
					: '',
			);

			const checkReferral = await model.checkReferral(
				foundUserByReferralCode.referral_code
					? foundUserByReferralCode.referral_code
					: '',
			);

			if (checkReferral && checkReferral.length < 2) {
				const createReferral = await model.createReferral(
					referralData.user_id,
					values[0],
					foundUserByReferralCode.id!,
					values[1],
				);

				if (createReferral) {
					if (checkActive && checkActive.max_level < 5) {
						await model.editUserBalance(foundUserByReferralCode.id!, 20);
						await model.addHistoryBalance(
							foundUserByReferralCode.id!,
							20,
						);
					}

					res.status(200).json({
						status: 200,
						message: 'Success',
						data: createReferral,
					});
					return;
				} else {
					res.status(400).json({
						status: 400,
						message: 'Bad request',
					});
					return;
				}
			} else if (values.length == 3) {
				const createReferral = await model.createReferral(
					referralData.user_id,
					values[0],
					values[2],
					values[1],
				);

				if (createReferral) {
					await model.editUserBalance(foundUserByReferralCode.id!, 20);
					await model.addHistoryBalance(foundUserByReferralCode.id!, 20);

					res.status(200).json({
						status: 200,
						message: 'Success',
						data: createReferral,
					});
					return;
				} else {
					res.status(400).json({
						status: 400,
						message: 'Bad request',
					});
					return;
				}
			} else {
				res.status(400).json({
					status: 400,
					message: 'Choose one user',
					data: referralData,
				});
				return;
			}
		} else {
			res.status(400).json({
				status: 400,
				message: "This month's limit has expired.",
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
	GET_REFERRALS,
	CREATE_REFERRAL,
};
