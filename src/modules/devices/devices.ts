import { Request, Response } from 'express';
import model from './model';
import { IDevices } from '../../types/devices';

const GET = async (req: Request, res: Response) => {
	try {
		const limit = Number(req.query.limit) || 10;
		const page = Number(req.query.page) || 1;

		if (limit && page) {
			const devicesList = await model.devicesList(limit, page);

			if (devicesList && devicesList.length > 0) {
				res.status(200).json({
					status: 200,
					message: 'Success',
					data: devicesList,
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
		const user_id: number | undefined = req.params.user_id
			? Number(req.params.user_id)
			: undefined;
		const foundUserDevices = await model.foundUserDevices(user_id);

		if (foundUserDevices && foundUserDevices.length > 0) {
			res.status(200).json({
				status: 200,
				message: 'Success',
				data: foundUserDevices,
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
const ADD_DEVICE = async (req: Request, res: Response) => {
	try {
		const deviceData: IDevices = req.body;

		const addDevice = await model.addDevice(
			deviceData.user_id,
			deviceData.phone_brand,
			deviceData.phone_lang,
			deviceData.app_lang,
			deviceData.platform,
		);

		if (addDevice) {
			res.status(201).json({
				status: 201,
				message: 'Success',
				data: addDevice,
			});
			return;
		} else {
			res.status(400).json({
				status: 400,
				message: 'Bad request',
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

const EDIT_DEVICE = async (req: Request, res: Response) => {
	try {
		const deviceData: IDevices = req.body;

		if (deviceData.phone_brand) {
			await model.editPhoneBrand(
				deviceData.id,
				deviceData.user_id,
				deviceData.phone_brand,
			);
		}

		if (deviceData.phone_lang) {
			await model.editPhoneLang(
				deviceData.id,
				deviceData.user_id,
				deviceData.phone_lang,
			);
		}

		if (deviceData.app_lang) {
			await model.editAppLang(
				deviceData.id,
				deviceData.user_id,
				deviceData.app_lang,
			);
		}

		if (deviceData.platform) {
			await model.editPlatform(
				deviceData.id,
				deviceData.user_id,
				deviceData.platform,
			);
		}

		const foundDevice = await model.foundDevice(
			deviceData.id,
			deviceData.user_id,
		);

		if (foundDevice) {
			res.status(200).json({
				status: 200,
				message: 'Success',
				data: foundDevice,
			});
			return;
		} else {
			res.status(400).json({
				status: 400,
				message: 'Bad request',
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

const DELETE_DEVICE = async (req: Request, res: Response) => {
	try {
		const deviceData: IDevices = req.body;

		const deleteDevice = await model.deleteDevice(
			deviceData.id!,
			deviceData.user_id!,
		);

		if (deleteDevice) {
			res.status(200).json({
				status: 200,
				message: 'Success',
				data: deleteDevice,
			});
			return;
		} else {
			res.status(400).json({
				status: 400,
				message: 'Bad request',
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
	GET,
	GET_USER_ID,
	ADD_DEVICE,
	EDIT_DEVICE,
	DELETE_DEVICE,
};
