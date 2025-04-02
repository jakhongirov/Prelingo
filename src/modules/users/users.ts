import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import JWT from '../../lib/jwt';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import model from './model';
import { IUsers, IUser, ILogin } from '../../types/users';

const GET_LIST = async (req: Request, res: Response) => {
	try {
		const limit = Number(req.query.limit) || 10;
		const page = Number(req.query.page) || 1;

		if (limit && page) {
			const usersList: IUsers[] | null = await model.usersList(limit, page);

			if (usersList && usersList.length > 0) {
				res.status(200).json({
					status: 200,
					message: 'Success',
					data: usersList,
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
		const id: number | undefined = req.params.id
			? Number(req.params.id)
			: undefined;

		if (id !== undefined && isNaN(id)) {
			res.status(400).json({
				status: 400,
				message: 'Invalid ID',
			});
			return;
		}

		const userByID: IUsers | null = await model.userByID(id);

		if (userByID) {
			res.status(200).json({
				status: 200,
				message: 'Success',
				data: userByID,
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

const GET_USER_TOKEN = async (req: Request, res: Response) => {
	try {
		const token: string | undefined = req.params.token
			? req.params.token
			: undefined;

		const userByToken: IUsers | null = await model.userByToken(token);

		if (userByToken) {
			res.status(200).json({
				status: 200,
				message: 'Success',
				data: userByToken,
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

const REGISTER_USER = async (req: Request, res: Response) => {
	try {
		const userData: IUser = req.body;
		const referral_code = uuidv4();
		let pass_hash: string = '';

		if (userData.password) {
			pass_hash = await bcryptjs.hash(userData?.password, 10);
		} else {
			res.status(400).json({
				status: 400,
				message: 'Bad request',
			});
			return;
		}

		const createUser: IUsers | null = await model.createUser(
			userData,
			pass_hash,
			referral_code,
		);

		if (createUser) {
			const token = await new JWT({
				id: createUser?.id,
			}).sign();
			res.status(201).json({
				status: 201,
				message: 'Success',
				data: createUser,
				token: token,
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

const REGISTER_EMAIL = async (req: Request, res: Response) => {
	try {
		const { email, surname, name, country, region, password, app_token } =
			req.body as {
				email: string;
				surname: string;
				name: string;
				country: string;
				region: string;
				password: string;
				app_token: string;
			};
		const foundUserByEmail = await model.foundUserByEmail(email);

		if (foundUserByEmail) {
			await model.addToken(foundUserByEmail!.id, app_token);
			const token = await new JWT({
				id: foundUserByEmail?.id,
			}).sign();
			res.status(200).json({
				status: 200,
				message: 'Success',
				data: foundUserByEmail,
				token: token,
			});
			return;
		} else {
			const pass_hash = await bcryptjs.hash(password, 10);
			const createUserEmail = await model.createUserEmail(
				email,
				surname,
				name,
				country,
				region,
				pass_hash,
				app_token,
			);

			if (createUserEmail) {
				const token = await new JWT({
					id: createUserEmail?.id,
				}).sign();
				res.status(201).json({
					status: 201,
					message: 'Success',
					data: createUserEmail,
					token: token,
				});
				return;
			} else {
				res.status(400).json({
					status: 400,
					message: 'Bad requestF',
				});
				return;
			}
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

const GOOGLE = async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			res.status(401).json({
				status: 401,
				message: 'Unauthorized',
			});
			return;
		}

		const user = req.user as {
			id: string;
			email?: string;
			name?: string;
			phone?: string;
		};

		const foundUserByEmail = await model.foundUserEmail(
			user.email!,
			user.id!,
		);

		if (foundUserByEmail) {
			// await model.addToken(foundUserByEmail!.id, app_token);
			const token = await new JWT({
				id: foundUserByEmail?.id,
			}).sign();
			res.status(200).json({
				status: 200,
				message: 'Success',
				data: foundUserByEmail,
				token: token,
			});
			return;
		} else {
			const addUser = await model.addUser(
				user.id,
				user.email,
				user.name,
				user.phone,
			);

			if (addUser) {
				const token = await new JWT({
					id: addUser?.id,
				}).sign();
				res.status(201).json({
					status: 201,
					message: 'Success',
					data: addUser,
					token: token,
				});
				return;
			} else {
				res.status(400).json({
					status: 400,
					message: 'Bad requestF',
				});
				return;
			}
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

const APPLE = async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			res.status(401).json({
				status: 401,
				message: 'Unauthorized',
			});
			return;
		}

		const user = req.user as {
			id: string;
			email?: string;
			name?: string;
			phone?: string;
		};

		const foundUserByEmail = await model.foundUserEmail(
			user.email!,
			user.id!,
		);

		if (foundUserByEmail) {
			// await model.addToken(foundUserByEmail!.id, app_token);
			const token = await new JWT({
				id: foundUserByEmail?.id,
			}).sign();
			res.status(200).json({
				status: 200,
				message: 'Success',
				data: foundUserByEmail,
				token: token,
			});
			return;
		} else {
			const addUser = await model.addUser(
				user.id,
				user.email,
				user.name,
				user.phone,
			);

			if (addUser) {
				const token = await new JWT({
					id: addUser?.id,
				}).sign();
				res.status(201).json({
					status: 201,
					message: 'Success',
					data: addUser,
					token: token,
				});
				return;
			} else {
				res.status(400).json({
					status: 400,
					message: 'Bad requestF',
				});
				return;
			}
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

const LOGIN = async (req: Request, res: Response) => {
	try {
		const userData: ILogin = req.body;
		const contact = userData.email ?? userData.phone_number;
		const foundUser = await model.foundUser(contact);

		if (foundUser && foundUser.password) {
			const validPass = await bcryptjs.compare(
				userData.password,
				foundUser.password,
			);

			if (validPass) {
				await model.addToken(foundUser!.id, userData.app_token);
				const token = await new JWT({
					id: foundUser?.id,
				}).sign();

				res.status(200).json({
					status: 200,
					message: 'Success',
					data: foundUser,
					token: token,
				});
				return;
			} else {
				res.status(401).json({
					status: 401,
					message: 'Invalid password',
				});
				return;
			}
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

const EDIT_USER = async (req: Request, res: Response) => {
	try {
		const userData: IUsers = req.body;
		const userByID = await model.userByID(userData.id!);

		if (userByID) {
			if (userData.surname) {
				await model.editSurname(userData.id!, userData.surname);
			}

			if (userData.name) {
				await model.editName(userData.id!, userData.name);
			}

			if (userData.phone_number) {
				await model.editPhoneNumber(userData.id!, userData.phone_number);
			}

			if (userData.email) {
				await model.editEmail(userData.id!, userData.email);
			}

			if (userData.password) {
				const pass_hash = await bcryptjs.hash(userData?.password, 10);
				await model.editPassword(userData.id!, pass_hash);
			}

			if (userData.country) {
				await model.editCountry(userData.id!, userData.country);
			}

			if (userData.region) {
				await model.editRegion(userData.id!, userData.region);
			}

			if (userData.count_stars) {
				await model.editCountStars(userData.id!, userData.count_stars);
			}

			if (userData.balance) {
				await model.editBalance(userData.id!, userData.balance);
			}

			const userByID = await model.userByID(userData.id!);

			if (userByID) {
				res.status(200).json({
					status: 200,
					message: 'Success',
					data: userByID,
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
				message: 'Bad request',
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

const DELETE_USER = async (req: Request, res: Response) => {
	try {
		const { id } = req.body as { id: number };
		const deleteUser = await model.deleteUser(id);

		if (deleteUser) {
			res.status(200).json({
				status: 200,
				message: 'Success',
				data: deleteUser,
			});
		} else {
			res.status(400).json({
				status: 400,
				message: 'Bad request',
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

export default {
	GET_LIST,
	GET_USER_ID,
	GET_USER_TOKEN,
	REGISTER_USER,
	REGISTER_EMAIL,
	GOOGLE,
	APPLE,
	LOGIN,
	EDIT_USER,
	DELETE_USER,
};
