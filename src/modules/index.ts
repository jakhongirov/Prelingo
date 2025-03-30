import { Router } from 'express';

// MIDDLEWARE
import AUTH from '../middleware/auth';
import upload from '../middleware/multer';
import passport from '../lib/passport';

// FILES
import users from './users/users';
import devices from './devices/devices';
import referrals from './referrals/referrals';
import historiesBalance from './historiesBalance/historiesBalance';
import histories from './histories/histories';

const router = Router();

router

	/**
	 * components:
	 *    securitySchemes:
	 *       token:
	 *       type: apiKey
	 *       in: header
	 *       name: token
	 */
	
	// USERS
	/**
	 * @swagger
	 *	components:
	 *   schemas:
	 *     Users:
	 *       tpype: object
	 *       required:
	 * 	     - email
	 *       properties:
	 * 		  id:
	 * 		    type: integer
	 *           description: auto generate
	 * 		  surname:
	 * 		    type: string
	 *           description: user's surname
	 *         name:
	 *           type: string
	 *           description: user's name
	 *         phone_number:
	 *           type: string
	 *           description: user's phone number
	 *         email:
	 * 			 type: string
	 *           description: user's email
	 *         password:
	 *           type: string
	 *           description: user's password, auto hash
	 *         country:
	 * 			 type: string
	 * 			 description: user's country
	 *         region:
	 * 			 type: string
	 * 			 description: user's region
	 *         count_starts:
	 * 			 type: integer
	 * 			 description: user's count starts
	 *         finished_lessons:
	 * 			 type: array
	 *           items:
	 *             type: integer
	 * 			 description: user's finished lessons id
	 *         saved_word:
	 * 			 type: array
	 *           items:
	 *             type: integer
	 * 			 description: user's saved word id
	 *         saved_phrase:
	 * 			 type: array
	 *           items:
	 *             type: integer
	 * 			 description: user's saved phrase id
	 *         balance:
	 * 			 type: integer
	 * 			 description: user's balance
	 *         referral_code:
	 * 			 type: string
	 * 			 description: user's referral code
	 *         chat_id:
	 * 			 type: integer
	 * 			 description: user's chat id
	 *         bot_step:
	 * 			 type: string
	 * 			 description: user's bot step
	 *         bot_lang:
	 * 			 type: string
	 * 			 description: user's bot lang
	 *         app_token:
	 * 			 type: array
	 *           items:
	 *             type: string
	 * 			 description: user's app token
	 *         telegram:
	 * 			 type: boolean
	 * 			 description: user registered with telegram bot
	 *         create_at:
	 * 			 type: string
	 * 			 description: user create date
	 */

	/**
	 * @swagger
	 * tags:
	 *    name: Users
	 *    description: Users api documentation
	 */

	/**
	 * @swagger
	 * /users/list:
	 *	  get:
	 *   	 summary: Returns a list of all users, for Frontend developers
	 *     tags: [Users]
	 *     security:
	 *       - token: []
	 *     parameters:
	 *       - in: header
	 *         name: token
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Authentication token
	 *       - in: query
	 *         name: limit
	 *         schema:
	 *           type: integer
	 *         description: Limit for the number of users in the list
	 *       - in: query
	 *         name: page
	 *         schema:
	 *           type: integer
	 *         description: Page number for pagination
	 *     responses:
	 *       '200':
	 *         description: A list of users
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/Users'
	 *         headers:
	 *           token:
	 *             description: Token for authentication
	 *             schema:
	 *               type: string
	 *       '500':
	 *         description: Server error
	 */
	.get('/users/list', AUTH, users.GET_LIST)

	/**
	 * @swagger
	 * /user/{user_id}:
	 *   get:
	 *     summary: Get user data by ID
	 *     tags: [Users]
	 *     security:
	 *       - token: []
	 *     parameters:
	 *       - in: header
	 *         name: token
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Authentication token
	 *       - in: path
	 *         name: user_id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: User's ID
	 *     responses:
	 *       '200':
	 *         description: User data retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Users'
	 *         headers:
	 *           token:
	 *             description: Token for authentication
	 *             schema:
	 *               type: string
	 *       '500':
	 *         description: Server error
	 */
	.get('/user/:id', AUTH, users.GET_USER_ID)

	/**
	 * @swagger
	 * /user/{token}:
	 *   get:
	 *     summary: Get user data by Token
	 *     tags: [Users]
	 *     security:
	 *       - token: []
	 *     parameters:
	 *       - in: header
	 *         name: token
	 *         required: false
	 *         schema:
	 *           type: string
	 *         description: Authentication token
	 *       - in: token
	 *         name: user_id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: User's ID
	 *     responses:
	 *       '200':
	 *         description: User data retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Users'
	 *         headers:
	 *           token:
	 *             description: Token for authentication
	 *             schema:
	 *               type: string
	 *       '500':
	 *         description: Server error
	 */
	.get('/user/token/:token', users.GET_USER_TOKEN)

	/**
	 * @swagger
	 * /user/register:
	 *   post:
	 *     summary: Register a new user
	 *     tags: [Users]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               phone_number:
	 *                 type: string
	 *                 description: User's phone number
	 *                 example: +998991234567
	 *               password:
	 *                 type: string
	 *                 description: User's password
	 *                 example: 1234
	 *               app_token:
	 *                 type: string
	 *                 description: User's app token
	 *                 example: enfjerflrefnjerfjkenrfker
	 *     responses:
	 *       '201':
	 *         description: Successfully created a new user
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Users'
	 *       '500':
	 *         description: Server error
	 */
	.post('/user/register', users.REGISTER_USER)

	/**
	 * @swagger
	 * /user/register/email:
	 *   post:
	 *     summary: Register user by email
	 *     tags: [Users]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *                 description: User's registered email
	 *                 example: ddiyor.jakhongirov@gamil.com
	 *     responses:
	 *       '200':
	 *         description: Successful login
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Users'
	 *       '500':
	 *         description: Server error
	 */
	.post('/user/email', users.REGISTER_EMAIL)

	/**
	 * @swagger
	 * /user/register/google:
	 *   get:
	 *     summary: Register user by email
	 *     tags: [Users]
	 *     responses:
	 *       '200':
	 *         description: Successful login
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Users'
	 *       '500':
	 *         description: Server error
	 */
	.get(
		'/user/register/google',
		passport.authenticate('google', {
			scope: [
				'profile',
				'email',
				'https://www.googleapis.com/auth/user.phonenumbers.read',
			],
		}),
	)
	.get(
		'/google/callback',
		passport.authenticate('google', { session: false }),
		users.GOOGLE,
	)

	/**
	 * @swagger
	 * /user/register/apple:
	 *   get:
	 *     summary: Register user by apple
	 *     tags: [Users]
	 *     responses:
	 *       '200':
	 *         description: Successful login
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Users'
	 *       '500':
	 *         description: Server error
	 */
	.get('/user/register/apple', passport.authenticate('apple'))
	.post(
		'/apple/callback',
		passport.authenticate('apple', { session: false }),
		users.APPLE,
	)

	/**
	 * @swagger
	 * /user/login:
	 *   post:
	 *     summary: Login user
	 *     tags: [Users]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               phone_number:
	 *                 type: string
	 *                 description: User's registered phone number
	 *                 example: +998991234567
	 * 				  email
	 * 					 type: string
	 *                 description: User's registered email
	 *                 example: diyor.jakhongirov@gmail.com
	 *               password:
	 *                 type: string
	 *                 description: User's password
	 *                 example: 1234
	 *     responses:
	 *       '200':
	 *         description: Successful login
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Users'
	 *       '500':
	 *         description: Server error
	 */
	.post('/user/login', users.LOGIN)

	/**
	 * @swagger
	 * /user/edit:
	 *   put:
	 *     summary: Edit user's data
	 *     tags: [Users]
	 *     parameters:
	 *       - in: header
	 *         name: token
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Authentication token
	 *     security:
	 *       - token: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               id:
	 *                 type: integer
	 *                 description: User's ID
	 *                 example: 2
	 *               surname:
	 *                 type: string
	 *                 description: User's new surname
	 *                 example: Alimova
	 *               name:
	 *                 type: string
	 *                 description: User's new name
	 *                 example: Nodira
	 *               phone_number:
	 *                 type: string
	 *                 description: User's new phone number
	 *                 example: +998987654321
	 *               email:
	 *                 type: string
	 *                 description: User's new phone email
	 *                 example: nimadir1@gamil.com
	 *               password:
	 *                 type: string
	 *                 description: User's new password
	 *                 example: 4321
	 *               country:
	 *                 type: string
	 *                 description: User's country
	 *                 example: Uzbekiston
	 *               region:
	 *                 type: string
	 *                 description: User's region
	 *                 example: Tashkent
	 *               count_starts:
	 *                 type: integer
	 *                 description: User's count starts
	 *                 example: 12
	 *               balance:
	 *                 type: integer
	 *                 description: User's balance
	 *                 example: 10
	 *     responses:
	 *       '200':
	 *         description: User data successfully updated
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Users'
	 *       '500':
	 *         description: Server error
	 */
	.put('/user/edit', AUTH, users.EDIT_USER)

	/**
	 * @swagger
	 * /user/delete:
	 *   delete:
	 *     summary: Delete user from database
	 *     tags: [Users]
	 *     parameters:
	 *       - in: header
	 *         name: token
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Authentication token
	 *     security:
	 *       - token: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               id:
	 *                 type: integer
	 *                 description: User's ID
	 *                 example: 2
	 *     responses:
	 *       '200':
	 *         description: User data deleted
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Users'
	 *       '500':
	 *         description: Server error
	 */
	.delete('/user/delete', AUTH, users.DELETE_USER)

	// DEVICES API
	/**
	 * @swagger
	 * components:
	 *    schemas:
	 *       Devices:
	 *          type: object
	 *          required:
	 *             - user_id
	 *          properties:
	 *             id:
	 *                type: integer
	 *                description: auto generate
	 *             user_id:
	 *                type: integer
	 *                description: user's id
	 *             phone_brnad:
	 *                type: string
	 *                description: user's phone brand name
	 *             phone_lang:
	 *                type: string
	 *                description: user's phone langugage
	 *             app_lang:
	 *                type: string
	 *                description: user's application language
	 *             platform:
	 *                type: string
	 *                description: user's device os
	 *          example:
	 *             id: 1
	 *             user_id: 2
	 *             phone_brand: iPhone
	 *             phone_lang: eng
	 *             app_lang: uz
	 *             platform: ios
	 *             created_at: 2024-01-23 10:52:41 +0000
	 */

	/**
	 * @swagger
	 * tags:
	 *    name: Devices
	 *    description: Devices api documentation
	 */

	/**
	 * @swagger
	 * /devices/list:
	 *    get:
	 *       summary: Returns a list of all devices, for Frontend developers
	 *       tags: [Devices]
	 *       security:
	 *          - token: []
	 *       parameters:
	 *          - in: header
	 *            name: token
	 *            required: true
	 *            schema:
	 *               type: string
	 *            description: Authentication token
	 *          - in: query
	 *            name: limit
	 *            schema:
	 *               type: integer
	 *            description: Limit for the number of devices in the list
	 *          - in: query
	 *            name: page
	 *            schema:
	 *               type: integer
	 *            description: Page number for pagination
	 *       responses:
	 *         '200':
	 *             description: A list of devices
	 *             content:
	 *                application/json:
	 *                   schema:
	 *                      type: array
	 *                      items:
	 *                         $ref: '#/components/schemas/Devices'
	 *         headers:
	 *          token:
	 *             description: Token for authentication
	 *             schema:
	 *                type: string
	 *         '500':
	 *           description: Server error
	 */
	.get('/devices/list', AUTH, devices.GET)

	/**
	 * @swagger
	 * /devices/{user_id}:
	 *    get:
	 *       summary: Get devices data by user id
	 *       tags: [Devices]
	 *       security:
	 *          - token: []
	 *       parameters:
	 *          - in: header
	 *            name: token
	 *            required: true
	 *            schema:
	 *               type: string
	 *            description: Authentication token
	 *          - in: path
	 *            name: user_id
	 *            required: true
	 *            schema:
	 *               type: integer
	 *            description: User's ID
	 *       responses:
	 *          '200':
	 *             description: User's devices data retrieved successfully
	 *             content:
	 *                application/json:
	 *                   schema:
	 *                      $ref: '#/components/schemas/Devices'
	 *             headers:
	 *                token:
	 *                   description: Token for authentication
	 *                   schema:
	 *                      type: string
	 *          '500':
	 *             description: Server error
	 */
	.get('/devices/:user_id', AUTH, devices.GET_USER_ID)

	/**
	 * @swagger
	 * /device/add:
	 *    post:
	 *       summary: Add user's device
	 *       tags: [Devices]
	 *       parameters:
	 *          - in: header
	 *            name: token
	 *            required: true
	 *            schema:
	 *               type: string
	 *            description: Authentication token
	 *       requestBody:
	 *          required: true
	 *          content:
	 *             application/json:
	 *                schema:
	 *                   type: object
	 *                   properties:
	 *                      user_id:
	 *                         type: integer
	 *                         description: User's id
	 *                         example: 2
	 *                      phone_brand:
	 *                         type: string
	 *                         description: User's device brand
	 *                         example: iPhone
	 *                      phone_lang:
	 *                         type: string
	 *                         description: User's device language
	 *                         example: en
	 *                      app_lang:
	 *                         type: string
	 *                         description: User's application language
	 *                         example: uz
	 *                      platform:
	 *                         type: string
	 *                         description: User's device platform
	 *                         example: ios
	 *       responses:
	 *          '201':
	 *             description: Successfully created a new user's device
	 *             content:
	 *                application/json:
	 *                   schema:
	 *                      $ref: '#/components/schemas/Devices'
	 *          '500':
	 *             description: Server error
	 */
	.post('/device/add', AUTH, devices.ADD_DEVICE)

	/**
	 * @swagger
	 * /device/edit:
	 *    put:
	 *       summary: Edit user's device
	 *       tags: [Devices]
	 *       parameters:
	 *          - in: header
	 *            name: token
	 *            required: true
	 *            schema:
	 *              type: string
	 *            description: Authentication token
	 *       security:
	 *          - token: []
	 *       requestBody:
	 *          required: true
	 *          content:
	 *             application/json:
	 *                schema:
	 *                   type: object
	 *                   properties:
	 *                      id:
	 *                         type: integer
	 *                         description: User's device id
	 *                         example: 1
	 *                      user_id:
	 *                         type: integer
	 *                         description: User id
	 *                         example: 2
	 *                      phone_brand:
	 *                         type: string
	 *                         description: User's device brand
	 *                         example: iPhone
	 *                      phone_lang:
	 *                         type: string
	 *                         description: User's device language
	 *                         example: en
	 *                      app_lang:
	 *                         type: string
	 *                         description: User's application language
	 *                         example: uz
	 *                      platform:
	 *                         type: string
	 *                         description: User's device platform
	 *                         example: ios
	 *       responses:
	 *          '200':
	 *             description: User's device data successfully updated
	 *             content:
	 *                application/json:
	 *                   schema:
	 *                      $ref: '#/components/schemas/Devices'
	 *          '500':
	 *             description: Server error
	 */
	.put('/device/edit', AUTH, devices.EDIT_DEVICE)

	/**
	 * @swagger
	 * /device/delete:
	 *    delete:
	 *       summary: Delete user's device from database
	 *       tags: [Devices]
	 *       parameters:
	 *          - in: header
	 *            name: token
	 *            required: true
	 *            schema:
	 *               type: string
	 *            description: Authentication token
	 *       security:
	 *          - token: []
	 *       requestBody:
	 *          required: true
	 *          content:
	 *             application/json:
	 *                schema:
	 *                   type: object
	 *                   properties:
	 *                      id:
	 *                         type: integer
	 *                         description: User's device ID
	 *                         example: 1
	 *       responses:
	 *          '200':
	 *             description: User' device data deleted
	 *             content:
	 *                application/json:
	 *                   schema:
	 *                      $ref: '#/components/schemas/Devices'
	 *          '500':
	 *             description: Server error
	 */
	.delete('/device/delete', AUTH, devices.DELETE_DEVICE)

	// REFERRALS
	.get('/referrals/list', referrals.GET_LIST)
	.get('/referrals/:referral_code', referrals.GET_REFERRALS)
	.post('/referral/add', referrals.CREATE_REFERRAL)

	// HISTORIES BALANCE
	.get('/histories/balance/list', historiesBalance.GET_LIST)
	.get('/histories/balance/:user_id', historiesBalance.GET_USER_ID)

	// HISTORIES
	.get('/histories/list', histories.GET_LIST)
	.get('/histories/:user_id', histories.GET_USER_ID);

export default router;
