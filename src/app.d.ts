// See https://kit.svelte.dev/docs/types#app

import type { DatabaseUserAttributes } from "$lib/types/auth.types";
import type { Session, User } from "lucia";


declare module "lucia" {
	interface User extends DatabaseUserAttributes {}
}
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
