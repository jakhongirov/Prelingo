"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// MIDDLEWARE
const auth_1 = __importDefault(require("../middleware/auth"));
// FILES
const users_1 = __importDefault(require("./users/users"));
const referrals_1 = __importDefault(require("./referrals/referrals"));
const historiesBalance_1 = __importDefault(require("./historiesBalance/historiesBalance"));
const histories_1 = __importDefault(require("./histories/histories"));
const router = (0, express_1.Router)();
router
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
    .get('/users/list', auth_1.default, users_1.default.GET_LIST)
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
    .get('/user/:id', users_1.default.GET_USER_ID)
    .post('/user/register', users_1.default.REGISTER_USER)
    .post('/user/email', users_1.default.REGISTER_EMAIL)
    .post('/user/login', users_1.default.LOGIN)
    .put('/user/edit', users_1.default.EDIT_USER)
    .delete('/user/delete', users_1.default.DELETE_USER)
    // REFERRALS
    .get('/referrals/list', referrals_1.default.GET_LIST)
    .get('/referrals/:referral_code', referrals_1.default.GET_REFERRALS)
    .post('/referral/add', referrals_1.default.CREATE_REFERRAL)
    // HISTORIES BALANCE
    .get('/histories/balance/list', historiesBalance_1.default.GET_LIST)
    .get('/histories/balance/:user_id', historiesBalance_1.default.GET_USER_ID)
    // HISTORIES
    .get('/histories/list', histories_1.default.GET_LIST)
    .get('/histories/:user_id', histories_1.default.GET_USER_ID);
exports.default = router;
