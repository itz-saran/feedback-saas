import { lucia } from "$lib/server/auth";

export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		console.log("no session id")
		event.locals.user = null;
		event.locals.session = null;
		return await resolve(event);
	}
	console.log("cookie handling", sessionId);
	const { user, session } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		console.log("session cookie");
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}
	if (!session) {
		console.log("blank cookie");
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;
	console.log("resolving")
	return await resolve(event);
}
