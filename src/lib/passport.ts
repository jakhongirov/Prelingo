import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import AppleStrategy from 'passport-apple';
import dotenv from 'dotenv';
import fs from 'fs';
import jwt from 'jsonwebtoken';

dotenv.config();

/**
 * GOOGLE STRATEGY
 */
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL: 'https://prelingo.admob.uz/auth/google/callback',
			scope: [
				'email', // Get email
				'profile', // Get name (profile image can be ignored)
				'https://www.googleapis.com/auth/user.phonenumbers.read', // Get phone number
			],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Fetch phone number from Google People API
				const phoneResponse = await fetch(
					'https://people.googleapis.com/v1/people/me?personFields=phoneNumbers',
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);

				const phoneData = await phoneResponse.json();
				const phoneNumber =
					phoneData?.phoneNumbers?.[0]?.value ||
					'No phone number provided';

				// Construct user object (without profile image)
				const user = {
					id: profile.id,
					name: profile.displayName, // Get full name
					email: profile.emails?.[0]?.value || 'No email provided', // Get email
					phone: phoneNumber, // Get phone number from People API
				};

				return done(null, user);
			} catch (error) {
				return done(error as Error); // ✅ Explicitly cast error
			}
		},
	),
);

/**
 * APPLE STRATEGY
 */
passport.use(
	new AppleStrategy(
		{
			clientID: process.env.APPLE_CLIENT_ID!,
			teamID: process.env.APPLE_TEAM_ID!,
			keyID: process.env.APPLE_KEY_ID!,
			privateKeyString: fs.readFileSync('AuthKey_FNWJ2ZV2YV.p8', 'utf8'),
			callbackURL: 'https://prelingo.admob.uz/auth/apple/callback',
			scope: ['email', 'name'],
			passReqToCallback: true, // Ensures correct function signature
		},
		async (
			req: any, // Request object added as first parameter
			accessToken: string,
			refreshToken: string,
			idToken: string, // Change this to match expected type
			profile: any, // Explicitly added profile
			done: (error: any, user?: any) => void,
		) => {
			try {
				// Decode the idToken manually
				const decodedIdToken: any = jwt.decode(idToken);
				if (!decodedIdToken) {
					return done(new Error('Failed to decode idToken'), null);
				}

				const user = {
					id: decodedIdToken.sub,
					email: decodedIdToken.email,
					name: decodedIdToken.name || 'Apple User',
				};
				return done(null, user);
			} catch (error) {
				return done(error, null);
			}
		},
	),
);

/**
 * SERIALIZE & DESERIALIZE USER (For session management)
 */
passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user: any, done) => {
	done(null, user);
});

export default passport;
