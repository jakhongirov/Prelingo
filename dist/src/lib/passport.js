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
dotenv_1.default.config();
/**
 * GOOGLE STRATEGY
 */
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = {
            id: profile.id,
            name: profile.displayName,
            email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
        };
        return done(null, user);
    }
    catch (error) {
        return done(error, null);
    }
})));
/**
 * APPLE STRATEGY
 */
passport_1.default.use(new passport_apple_1.default({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyString: fs_1.default.readFileSync('AuthKey_XXXXX.p8', 'utf8'),
    callbackURL: 'http://localhost:3000/auth/apple/callback',
    scope: ['email', 'name'],
    passReqToCallback: true, // ✅ Changed to true to match expected type
}, (req, // ✅ Request object added as first parameter
accessToken, refreshToken, decodedIdToken, // ✅ Ensured correct type
profile, // ✅ Explicitly added profile
done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
