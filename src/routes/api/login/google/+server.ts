import { dev } from "$app/environment";
import { google } from "$lib/server/google.js";
import { redirect } from "@sveltejs/kit";
import { generateCodeVerifier, generateState } from "arctic";

export async function GET({ cookies }) {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ["profile", "email"]
	});

	cookies.set("google_oauth_state", state, {
		path: "/",
		secure: !dev
	});

	cookies.set("code_verifier", codeVerifier, {
		secure: !dev,
		path: "/"
	});

	throw redirect(302, url.toString());
}
