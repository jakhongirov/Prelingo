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
	 * components:
	 *   schemas:
	 *     Users:
	 *       type: object
	 *       required:
	 *         - email
	 *       properties:
	 *         id:
	 *           type: integer
	 *           description: Auto-generated ID
	 *         surname:
	 *           type: string
	 *           description: User's surname
	 *         name:
	 *           type: string
	 *           description: User's name
	 *         phone_number:
	 *           type: string
	 *           description: User's phone number
	 *         email:
	 *           type: string
	 *           description: User's email
	 *         password:
	 *           type: string
	 *           description: User's password (hashed)
	 *         country:
	 *           type: string
	 *           description: User's country
	 *         region:
	 *           type: string
	 *           description: User's region
	 *         count_stars:
	 *           type: integer
	 *           description: User's count starts
	 *         balance:
	 *           type: integer
	 *           description: User's balance
	 *         image_url:
	 *           type: string
	 *           description: User's image url
	 *         image_name:
	 *           type: string
	 *           description: User's image name
	 *         referral_code:
	 *           type: string
	 *           description: User's referral code
	 *         chat_id:
	 *           type: integer
	 *           description: User's chat ID
	 *         bot_step:
	 *           type: string
	 *           description: User's bot step
	 *         bot_lang:
	 *           type: string
	 *           description: User's bot language
	 *         telegram:
	 *           type: boolean
	 *           description: Whether the user registered via Telegram bot
	 *         create_at:
	 *           type: string
	 *           format: date-time
	 *           description: User's creation date
	 *       example:
	 *         id: 1
	 *         surname: Kimidirov
	 *         name: Kimdir
	 *         phone_number: +998977771854
	 *         email: kimdr@gmail.com
	 *         password: fefmefjerfe
	 *         country: Uz
	 *         region: Tashkent
	 *         count_stars: 9
	 *         balance: 0
	 *         referral_code: "5rfgytrdxvgt5resxvgt54"
	 *         chat_id: 6546543
	 *         bot_step: start
	 *         bot_lang: uz
	 *         telegram: true
	 *         create_at: "2024-01-23T10:52:41Z"
	 */

	/**
	 * @swagger
	 * tags:
	 *   name: Users
	 *   description: Users API documentation
	 */

	/**
	 * @swagger
	 * /users/list:
	 *   get:
	 *     summary: Returns a list of all users (for frontend developers)
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
	 *                 description: User's email
	 *                 example: diyor.jakhongirov@gmail.com
	 *               surname:
	 *                 type: string
	 *                 description: User's  surname
	 *                 example: kimdirov
	 *               name:
	 *                 type: string
	 *                 description: User's  name
	 *                 example: kimdir
	 *               country:
	 *                 type: string
	 *                 description: User's  country
	 *                 example: uzbekistan
	 *               region:
	 *                 type: string
	 *                 description: User's  region
	 *                 example: tashkent
	 *               password:
	 *                 type: string
	 *                 description: User's  password
	 *                 example: kimdir
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
	.post('/user/register/email', users.REGISTER_EMAIL)

	/**
	 * @swagger
	 * /user/otp:
	 *   post:
	 *     summary: OTP
	 *     tags: [Users]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *                 code:
	 *                   type: integer
	 *                   description: OTP code
	 *                   example: 566893
	 *     responses:
	 *       '200':
	 *         description: Successful
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Users'
	 *       '500':
	 *          description: Server error
	 */
	.post('/user/otp', users.OTP)

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
		'/auth/google/callback',
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
		'/auth/apple/callback',
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
	 *                 description: User's registered phone number (optional if using email)
	 *                 example: "+998991234567"
	 *               email:
	 *                 type: string
	 *                 description: User's registered email (optional if using phone number)
	 *                 example: "diyor.jakhongirov@gmail.com"
	 *               password:
	 *                 type: string
	 *                 description: User's password
	 *                 example: "1234"
	 *     responses:
	 *       '200':
	 *         description: Successful login
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Users'
	 *       '400':
	 *         description: Missing required fields or incorrect credentials
	 *       '500':
	 *         description: Server error
	 */
	.post('/user/login', users.LOGIN)

	/**
	 * @swagger
	 * /user/edit/avatar/{id}:
	 *   put:
	 *     summary: Edit user's avatar
	 *     tags: [Users]
	 *     parameters:
	 *       - in: header
	 *         name: token
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Authentication token
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: User's ID
	 *     security:
	 *       - token: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         multipart/form-data:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               image:
	 *                 type: string
	 *                 format: binary
	 *                 description: User's avatar image
	 *     responses:
	 *       '201':
	 *         description: Successfully edited user's avatar
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Users'
	 *       '500':
	 *         description: Server error
	 */
	.put('/user/edit/avatar/:id', AUTH, upload.single('image'), users.ADD_AVATAR)

	/**
	 * @swagger
	 * /user/edit:
	 *   put:
	 *     summary: Edit user's data
	 *     tags: [Users]
	 *     parameters:
	 *          - in: header
	 *            name: token
	 *            required: true
	 *            schema:
	 *               type: string
	 *            description: Authentication token
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
	 *               count_stars:
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
	/**
	 * @swagger
	 * components:
	 *   schemas:
	 *     Referrals:
	 *       type: object
	 *       required:
	 *         - user_id
	 *       properties:
	 *         id:
	 *           type: integer
	 *           description: Auto-generated ID
	 *         user_id:
	 *           type: integer
	 *           description: User's ID
	 *         referral_code:
	 *           type: string
	 *           description: Unique referral code
	 *         parent_id:
	 *           type: integer
	 *           description: Parent user's ID
	 *         position:
	 *           type: string
	 *           description: Position in referral hierarchy
	 *         created_at:
	 *           type: string
	 *           format: date-time
	 *           description: Timestamp of record creation
	 *       example:
	 *         id: 1
	 *         user_id: 2
	 *         referral_code: "2234234ewwefefe"
	 *         parent_id: 2
	 *         position: "right"
	 *         created_at: "2024-01-23T10:52:41Z"
	 */

	/**
	 * @swagger
	 * components:
	 *   schemas:
	 *     Promocodes:
	 *       type: object
	 *       required:
	 *         - referral_code
	 *       properties:
	 *         id:
	 *           type: integer
	 *           description: Auto-generated ID
	 *         referral_code:
	 *           type: string
	 *           description: Unique referral code
	 *         parent_id:
	 *           type: integer
	 *           description: Parent user's ID
	 *         position:
	 *           type: string
	 *           description: Position in referral hierarchy
	 *         promocode:
	 *           type: string
	 *           description: Promocode
	 *         status:
	 *           type: boolean
	 *           description: Promocode is active
	 *         created_at:
	 *           type: string
	 *           format: date-time
	 *           description: Timestamp of record creation
	 *       example:
	 *         id: 1
	 *         referral_code: "2234234ewwefefe"
	 *         parent_id: 2
	 *         position: "right"
	 *         promocode: "Abf123"
	 *         status: true
	 *         created_at: "2024-01-23T10:52:41Z"
	 */

	/**
	 * @swagger
	 * tags:
	 *    name: Referrals
	 *    description: Referrals api documentation
	 */

	/**
	 * @swagger
	 * /referrals/list:
	 *    get:
	 *       summary: Returns a list of all referral, for Frontend developers
	 *       tags: [Referrals]
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
	 *            description: Limit for the number of referrals in the list
	 *          - in: query
	 *            name: page
	 *            schema:
	 *               type: integer
	 *            description: Page number for pagination
	 *       responses:
	 *         '200':
	 *             description: A list of referral
	 *             content:
	 *                application/json:
	 *                   schema:
	 *                      type: array
	 *                      items:
	 *                         $ref: '#/components/schemas/Referrals'
	 *         headers:
	 *          token:
	 *             description: Token for authentication
	 *             schema:
	 *                type: string
	 *         '500':
	 *           description: Server error
	 */
	.get('/referrals/list', AUTH, referrals.GET_LIST)
	/**
	 * @swagger
	 * /referrals/{referral_code}:
	 *    get:
	 *       summary: Returns user's list of all referral
	 *       tags: [Referrals]
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
	 *            name: referral_code
	 *            schema:
	 *               type: string
	 *            description: User's referral code
	 *       responses:
	 *         '200':
	 *             description: A list of user's referral
	 *             content:
	 *                application/json:
	 *                   schema:
	 *                      type: array
	 *                      items:
	 *                         $ref: '#/components/schemas/Referrals'
	 *         headers:
	 *          token:
	 *             description: Token for authentication
	 *             schema:
	 *                type: string
	 *         '500':
	 *           description: Server error
	 */
	.get('/referrals/:referral_code', referrals.GET_REFERRALS)

	/**
	 * @swagger
	 * /referrals/generate/promocode:
	 *   post:
	 *     summary: Generate promocode
	 *     tags: [Referrals]
	 *     parameters:
	 *       - in: header
	 *         name: token
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Authentication token
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               referral_code:
	 *                 type: string
	 *                 description: User's referral code
	 *                 example: jkenbfurfguihrwe1342343
	 *               position:
	 *                 type: string
	 *                 description: Position in referral hierarchy
	 *                 example: left
	 *               parent_id:
	 *                 type: integer
	 *                 description: Parent user's ID
	 *     responses:
	 *       '201':
	 *         description: Successfully generated a new promocode
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Promocodes'
	 *       '500':
	 *         description: Server error
	 */
	.post('/referrals/generate/promocode', AUTH, referrals.GENERATE_CODE)

	/**
	 * @swagger
	 * /referral/add:
	 *    post:
	 *       summary: Add user's referral
	 *       tags: [Referrals]
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
	 *                      promocode:
	 *                         type: string
	 *                         description: generated promocode
	 *                         example: abf123
	 *       responses:
	 *          '201':
	 *             description: Successfully created a new user's referral
	 *             content:
	 *                application/json:
	 *                   schema:
	 *                      $ref: '#/components/schemas/Referrals'
	 *          '500':
	 *             description: Server error
	 */
	.post('/referral/add', referrals.CREATE_REFERRAL)

	// HISTORIES BALANCE
	/**
	 * @swagger
	 * components:
	 *   schemas:
	 *     HistoriesBalance:
	 *       type: object
	 *       required:
	 *         - user_id
	 *       properties:
	 *         id:
	 *           type: integer
	 *           description: Auto-generated ID
	 *         user_id:
	 *           type: integer
	 *           description: User's ID
	 *         category:
	 *           type: string
	 *           description: Bonu's categories
	 *         amount:
	 *           type: integer
	 *           description: Amount
	 *         created_at:
	 *           type: string
	 *           format: date-time
	 *           description: Timestamp of record creation
	 *       example:
	 *         id: 1
	 *         user_id: 2
	 *         category: "RB"
	 *         amount: 20
	 *         created_at: "2024-01-23T10:52:41Z"
	 */

	/**
	 * @swagger
	 * tags:
	 *    name: HistoriesBalance
	 *    description: HistoriesBalance api documentation
	 */

	/**
	 * @swagger
	 * /histories/balance/list:
	 *    get:
	 *       summary: Returns a list of all histories balance, for Frontend developers
	 *       tags: [HistoriesBalance]
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
	 *            description: Limit for the number of histories balance in the list
	 *          - in: query
	 *            name: page
	 *            schema:
	 *               type: integer
	 *            description: Page number for pagination
	 *       responses:
	 *         '200':
	 *             description: A list of Histories Balance
	 *             content:
	 *                application/json:
	 *                   schema:
	 *                      type: array
	 *                      items:
	 *                         $ref: '#/components/schemas/HistoriesBalance'
	 *         headers:
	 *          token:
	 *             description: Token for authentication
	 *             schema:
	 *                type: string
	 *         '500':
	 *           description: Server error
	 */
	.get('/histories/balance/list', historiesBalance.GET_LIST)

	/**
	 * @swagger
	 * /histories/balance/{user_id}:
	 *   get:
	 *     summary: Get user data by ID
	 *     tags: [HistoriesBalance]
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
	 *               $ref: '#/components/schemas/HistoriesBalance'
	 *         headers:
	 *           token:
	 *             description: Token for authentication
	 *             schema:
	 *               type: string
	 *       '500':
	 *         description: Server error
	 */
	.get('/histories/balance/:user_id', historiesBalance.GET_USER_ID)

	// HISTORIES
	/**
	 * @swagger
	 * components:
	 *   schemas:
	 *     Histories:
	 *       type: object
	 *       required:
	 *         - user_id
	 *       properties:
	 *         id:
	 *           type: integer
	 *           description: Auto-generated ID
	 *         user_id:
	 *           type: integer
	 *           description: User's ID
	 *         amount:
	 *           type: integer
	 *           description: Amount
	 *         user_count:
	 *           type: integer
	 *           description: paid user count (BR bonus)
	 *         created_at:
	 *           type: string
	 *           format: date-time
	 *           description: Timestamp of record creation
	 *       example:
	 *         id: 1
	 *         user_id: 2
	 *         amount: 20
	 *         user_count: 10
	 *         created_at: "2024-01-23T10:52:41Z"
	 */

	/**
	 * @swagger
	 * tags:
	 *    name: Histories
	 *    description: Histories api documentation
	 */

	/**
	 * @swagger
	 * /histories/list:
	 *    get:
	 *       summary: Returns a list of all histories, for Frontend developers
	 *       tags: [Histories]
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
	 *            description: Limit for the number of histories in the list
	 *          - in: query
	 *            name: page
	 *            schema:
	 *               type: integer
	 *            description: Page number for pagination
	 *       responses:
	 *         '200':
	 *             description: A list of Histories
	 *             content:
	 *                application/json:
	 *                   schema:
	 *                      type: array
	 *                      items:
	 *                         $ref: '#/components/schemas/Histories'
	 *         headers:
	 *          token:
	 *             description: Token for authentication
	 *             schema:
	 *                type: string
	 *         '500':
	 *           description: Server error
	 */
	.get('/histories/list', histories.GET_LIST)

	/**
	 * @swagger
	 * /histories/{user_id}:
	 *   get:
	 *     summary: Get user data by ID
	 *     tags: [Histories]
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
	 *               $ref: '#/components/schemas/Histories'
	 *         headers:
	 *           token:
	 *             description: Token for authentication
	 *             schema:
	 *               type: string
	 *       '500':
	 *         description: Server error
	 */
	.get('/histories/:user_id', histories.GET_USER_ID);

export default router;
