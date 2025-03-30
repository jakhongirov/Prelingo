"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_apple_1 = __importDefault(require("passport-apple"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
/**
 * GOOGLE STRATEGY
 */
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://prelingo.admob.uz/auth/google/callback',
    scope: [
        'email', // Get email
        'profile', // Get name (profile image can be ignored)
        'https://www.googleapis.com/auth/user.phonenumbers.read', // Get phone number
    ],
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // Fetch phone number from Google People API
        const phoneResponse = yield fetch('https://people.googleapis.com/v1/people/me?personFields=phoneNumbers', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const phoneData = yield phoneResponse.json();
        const phoneNumber = ((_b = (_a = phoneData === null || phoneData === void 0 ? void 0 : phoneData.phoneNumbers) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) ||
            'No phone number provided';
        // Construct user object (without profile image)
        const user = {
            id: profile.id,
            name: profile.displayName, // Get full name
            email: ((_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value) || 'No email provided', // Get email
            phone: phoneNumber, // Get phone number from People API
        };
        return done(null, user);
    }
    catch (error) {
        return done(error); // ✅ Explicitly cast error
    }
})));
/**
 * APPLE STRATEGY
 */
passport_1.default.use(new passport_apple_1.default({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyString: fs_1.default.readFileSync('AuthKey_FNWJ2ZV2YV.p8', 'utf8'),
    callbackURL: 'https://prelingo.admob.uz/auth/apple/callback',
    scope: ['email', 'name'],
    passReqToCallback: true, // Ensures correct function signature
}, (req, // Request object added as first parameter
accessToken, refreshToken, idToken, // Change this to match expected type
profile, // Explicitly added profile
done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Decode the idToken manually
        const decodedIdToken = jsonwebtoken_1.default.decode(idToken);
        if (!decodedIdToken) {
            return done(new Error('Failed to decode idToken'), null);
        }
        const user = {
            id: decodedIdToken.sub,
            email: decodedIdToken.email,
            name: decodedIdToken.name || 'Apple User',
        };
        return done(null, user);
    }
    catch (error) {
        return done(error, null);
    }
})));
/**
 * SERIALIZE & DESERIALIZE USER (For session management)
 */
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
exports.default = passport_1.default;
