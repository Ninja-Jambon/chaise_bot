var mysql = require("mysql");
require("dotenv").config();

var con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

function registerUser(username, userid) {
  return new Promise((resolve, reject) => {
    con.query(
      `INSERT INTO users (username, userid, quota) VALUES ("${username}", "${userid}", 0)`,
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

function getUser(userid) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM users WHERE userid = "${userid}"`,
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

function incrementQuota(user, value) {
  return new Promise((resolve, reject) => {
    con.query(
      `UPDATE users SET quota = quota + ${value} WHERE userid = "${user}"`,
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

function addConv(userid, channelid, guildid) {
  return new Promise((resolve, reject) => {
    con.query(
      `INSERT INTO convs (userid, channelid, guildid) VALUES ("${userid}", "${channelid}", "${guildid}")`,
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

function removeConv(channelid) {
  return new Promise((resolve, reject) => {
    con.query(
      `DELETE FROM convs WHERE channelid = "${channelid}"`,
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

function getConv(channelid) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM convs WHERE channelid = "${channelid}"`,
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

function getQuotasSum() {
  return new Promise((resolve, reject) => {
    con.query(`SELECT SUM(quota) FROM users`, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

function resetQuotas() {
  return new Promise((resolve, reject) => {
    con.query(`UPDATE users SET quota = 0`, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

module.exports = {
  registerUser,
  getUser,
  incrementQuota,
  addConv,
  removeConv,
  getConv,
  getQuotasSum,
  resetQuotas,
};
