import postgres from "postgres";
import * as schema from "./schema";
import { DB_CONNECTION_STRING } from "$env/static/private";
import { drizzle } from "drizzle-orm/postgres-js";

export let db: ReturnType<typeof drizzle<typeof schema>>;

try {
	const client = postgres(DB_CONNECTION_STRING, { max: 5 });
	db = drizzle(client, { schema });
} catch (error) {
	console.log("DB_CONNECTION_ERROR", error);
}
