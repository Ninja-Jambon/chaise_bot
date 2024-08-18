import * as mysql from "mysql";

export interface User {
	id: number,
	username: string,
	userid: string,
	quota: number,
}

export async function connectToDb(): Promise<mysql.Connection> {
	return new Promise((resolve, reject) => {
		const connection: mysql.Connection = mysql.createConnection({
			host: process.env.MYSQL_HOST,
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.MYSQL_DATABASE,
		})

		connection.connect((error) => {
			if (error) {
				reject(error)
			}

			resolve(connection);
		});
	})
}

export async function addUser(connection: mysql.Connection, username: string, userid: string): Promise<any> {
	return new Promise((resolve, reject) => {
		connection.query(`INSERT INTO users (username, userid, quota) VALUES ("${username}", "${userid}", 0)`, (error, result) => {
			if (error) {
				reject(error);
			}

			resolve(result);
		})
	})
}

export async function getUser(connection: mysql.Connection, userid: string): Promise<User[]> {
	return new Promise((resolve, reject) => {
		connection.query(`SELECT * FROM users WHERE userid = "${userid}"`, (error, result) => {
			if (error) {
				reject(error);
			}

			resolve(result);
		})
	})
}

export async function incrementQuota(connection: mysql.Connection, userid: string, value: number): Promise<any> {
	return new Promise((resolve, reject) => {
		connection.query(`UPDATE users SET quota = quota + ${value} WHERE userid = "${userid}"`, (error, result) => {
			if (error) {
				reject(error);
			}

			resolve(result);
		})
	})
}

export function resetQuota(connection: mysql.Connection) {
	return new Promise((resolve, reject) => {
		connection.query(`UPDATE users SET quota = 0`, (error, result) => {
			if (error) {
				reject(error);
			}

			resolve(result);
		})
	})
}

export function getGuild(connection: mysql.Connection, guild_id: string): Promise<any[]> {
	return new Promise((resolve, reject) => {
		connection.query(`SELECT * FROM guilds WHERE guild_id = "${guild_id}"`, (error, result) => {
			if (error) {
				reject(error);
			}

			resolve(result);
		})
	})
}

export function addGuild(connection: mysql.Connection, guild_id: string) {
	return new Promise((resolve, reject) => {
		connection.query(`INSERT INTO guilds (guild_id) VALUES ("${guild_id}")`, (error, result) => {
			if (error) {
				reject(error);
			}

			resolve(result);
		})
	})
}

export function setAdminRole(connection: mysql.Connection, guild_id: string, role_id: string) {
	return new Promise((resolve, reject) => {
		connection.query(`UPDATE guilds SET admin_role_id = "${role_id}" WHERE guild_id = "${guild_id}"`, (error, result) => {
			if (error) {
				reject(error);
			}

			resolve(result);
		})
	})
}

export function setFeature(connection: mysql.Connection, guild_id: string, feature: string, code: string) {
	return new Promise((resolve, reject) => {
		connection.query(`UPDATE guilds SET ${feature} = ${code} WHERE guild_id = "${guild_id}"`, (error, result) => {
			if (error) {
				reject(error);
			}

			resolve(result);
		})
	})
}
