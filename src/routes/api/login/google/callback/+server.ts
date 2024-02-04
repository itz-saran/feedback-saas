import { db } from "$lib/db/index.server.js";
import { user } from "$lib/db/schema.js";
import { lucia } from "$lib/server/auth.js";
import { google } from "$lib/server/google.js";
import type { GoogleUser } from "$lib/types/auth.types.js";
import { error } from "@sveltejs/kit";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";

export async function GET({ url, cookies }) {
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = cookies.get("google_oauth_state") ?? null;
	const codeVerifier = cookies.get("code_verifier");
	if (!code || !state || state !== storedState || !codeVerifier) {
		throw error(400, "Params not found");
	}
	try {
		const tokens = await google.validateAuthorizationCode(code, codeVerifier);
		const googleResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const googleUser: GoogleUser = await googleResponse.json();

		const existingUser = await db.query.user.findFirst({
			where: eq(user.googleId, googleUser.sub)
		});

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
		} else {
			const userId = generateId(15);
			await db.insert(user).values({
				id: userId,
				googleId: googleUser.sub,
				username: googleUser.name,
				profileImg: googleUser.picture
			});
			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: `${url.protocol}//${url.host}/dashboard`
			}
		});
	} catch (e) {
		console.log("error", e);
		if (e instanceof OAuth2RequestError) {
			throw error(400, "bad request");
		} else {
			throw error(400, "bad request");
		}
	}
}
