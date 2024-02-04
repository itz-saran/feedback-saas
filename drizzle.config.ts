import dotenv from "dotenv";
import { Config } from "drizzle-kit";
dotenv.config();

export default {
	out: "./drizzle",
	schema: "./src/lib/db/schema.ts",
	driver: "pg",
	dbCredentials: {
		connectionString: process.env.DB_CONNECTION_STRING!
	}
} satisfies Config;
