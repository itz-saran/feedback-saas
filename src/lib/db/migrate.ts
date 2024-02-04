import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

type MigrateOptions = Parameters<typeof migrate>[1];

const options: MigrateOptions = {
	migrationsFolder: "drizzle"
};

async function main() {
	const { DB_CONNECTION_STRING } = process.env;
	if (!DB_CONNECTION_STRING) {
		throw new Error("DB connection string not found");
	}
	try {
		const client = postgres(DB_CONNECTION_STRING, { max: 1 });
		const db = drizzle(client);
		await migrate(db, options);
		console.log("Migrated");
		process.exit(0);
	} catch (error) {
		console.log("MIGRATION_ERROR", error);
	}
}

main();
