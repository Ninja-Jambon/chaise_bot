import * as fs from "fs";
import { connectToDb, resetQuota } from "./mysql.js";

function getLastResetDate(): number {
  const data: string = fs.readFileSync("../data/lastreset.txt", "utf8");
  return parseInt(data);
}

export async function checkReset() {
	const lastResetDate = getLastResetDate();
	const now = Date.now() / 1000;

	if (now - lastResetDate > 1000 * 60 * 60 * 24 * 30) {
	    fs.writeFileSync("../data/lastreset.txt", now.toString());

	    const connection = await connectToDb();

	    await resetQuota(connection);

	    connection.end();

	    return;
	} else {
	    return false;
	}
}