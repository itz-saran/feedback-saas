import { lucia } from "$lib/server/auth.js";
import { redirect, type Actions } from "@sveltejs/kit";
import { fail } from "assert";

export async function load({ locals }) {
	console.log("user", locals.user);
	console.log("session", locals.session);
	if (!locals.session) {
		redirect(301, "/");
	}
	return { user: locals.user };
}

export const actions: Actions = {
	signout: async (event) => {
		if (!event.locals.session) {
			return fail("No sesion found to invalidate");
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
		redirect(302, "/");
	}
};