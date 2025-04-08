import { Request, Response } from 'express';
import model from './model';
import { IReferral, IReferrals } from '../../types/referrals';
import { buildTree } from '../../lib/functions';
import { generatePromoCode } from '../../lib/functions';

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

const GENERATE_CODE = async (req: Request, res: Response) => {
	try {
		const { referral_code, position, parent_id } = req.body;
		const foundUserByReferralCode = await model.foundUserByReferralCode(
			referral_code,
		);

		if (foundUserByReferralCode) {
			const promoCode = generatePromoCode(6);
			const addPromocode = await model.addPromocode(
				referral_code,
				position,
				parent_id,
				promoCode,
			);

			if (addPromocode) {
				res.status(200).json({
					status: 200,
					message: 'Success',
					data: addPromocode,
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
			res.status(404).json({
				status: 404,
				message: 'Referral code not found',
			});
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
		const { promocode, user_id } = req.body;
		const findPromocode = await model.findPromocode(promocode);
		if (findPromocode) {
			const foundUserByReferralCode = await model.foundUserByReferralCode(
				findPromocode?.referral_code,
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
						user_id.user_id,
						findPromocode.referral_code,
						foundUserByReferralCode.id!,
						findPromocode?.position,
					);

					if (createReferral) {
						if (checkActive && checkActive.max_level < 5) {
							await model.editReferralStatus(user_id);
							await model.deletePromocode(promocode);
							await model.editUserBalance(
								foundUserByReferralCode.id!,
								20,
							);
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
				} else if (findPromocode?.parent_id) {
					const createReferral = await model.createReferral(
						user_id,
						findPromocode.referral_code,
						findPromocode!.parent_id,
						findPromocode.position,
					);

					if (createReferral) {
						await model.editReferralStatus(user_id);
						await model.deletePromocode(promocode);
						await model.editUserBalance(foundUserByReferralCode.id!, 20);
						await model.addHistoryBalance(
							foundUserByReferralCode.id!,
							20,
						);

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
						data: checkReferral,
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
		} else {
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
	GENERATE_CODE,
	CREATE_REFERRAL,
};
