import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import AppleStrategy from 'passport-apple';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

dotenv.config();

/**
 * GOOGLE STRATEGY
 */
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL: 'https://prelingo.admob.uz/api/v1/auth/google/callback',
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

const client = jwksClient({
	jwksUri: 'https://appleid.apple.com/auth/keys',
});

function getKey(header: any, callback: any) {
	client.getSigningKey(header.kid, (err, key) => {
		const signingKey = key?.getPublicKey();
		callback(err, signingKey);
	});
}

passport.use(
	new AppleStrategy(
		{
			clientID: process.env.APPLE_CLIENT_ID!,
			teamID: process.env.APPLE_TEAM_ID!,
			keyID: process.env.APPLE_KEY_ID!,
			privateKeyString: fs.readFileSync(
				path.resolve(__dirname, '../../AuthKey_FNWJ2ZV2YV.p8'),
				'utf8',
			),
			callbackURL: 'https://prelingo.admob.uz/api/v1/auth/apple/callback',
			scope: ['email', 'name'],
			passReqToCallback: true, // Ensures correct function signature
		},
		async (
			req: any,
			accessToken: string,
			refreshToken: string,
			idToken: string,
			profile: any,
			done: (error: any, user?: any) => void,
		) => {
			try {
				jwt.verify(
					idToken,
					getKey,
					{ algorithms: ['RS256'] },
					(err: any, decoded: any) => {
						if (err || !decoded) {
							return done(new Error('Failed to verify idToken'), null);
						}

						const user = {
							id: decoded.sub,
							email: decoded.email,
							name: decoded.name || 'Apple User',
						};
						return done(null, user);
					},
				);
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
