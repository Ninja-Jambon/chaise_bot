import * as fs from "fs";
import { connectToDb, resetQuota, getLastReset, addReset } from "./mysql.js";

export async function checkReset() {
	const connection = await connectToDb();
	const lastReset = await getLastReset(connection);
	const now = Date.now() / 1000;

	// @ts-ignore
	if (lastReset[0] && now - lastReset[0].date > 1000 * 60 * 60 * 24 * 30) {
		await resetQuota(connection);
		await addReset(connection, now)

		connection.end();

		return;
	} else {
		return false;
	}
}