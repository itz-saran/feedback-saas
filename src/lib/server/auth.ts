import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "$lib/db/index.server";
import { session, user } from "$lib/db/schema";
import { dev } from "$app/environment";
import type { DatabaseUserAttributes } from "$lib/types/auth.types";

declare module "lucia" {
	interface Register {
		Lucia: typeof Lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

const adapter = new DrizzlePostgreSQLAdapter(db, session, user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			googleId: attributes.googleId,
			username: attributes.username,
			profileImg: attributes.profileImg
		};
	}
});
