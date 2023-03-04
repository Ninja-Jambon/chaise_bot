const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL,
    database: "discord"
});

function addUserToDb(id, user) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO users(userid, username) VALUES("' + id + '","' + user + '")' , (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

function incrementQuota(id) {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET quota = quota + 1 WHERE userid = ' + id, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

function usersInDb() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT userid FROM users', (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                users = [];
                results.forEach(element => {
                    users.push(element.userid);
                });
                resolve(users);
            }
        });
    });
}

function getQuota(id) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT quota FROM users WHERE userid = ' + id, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].quota);
            }
        });
    });
}

function addConv (convName) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO conversations (name) VALUES ("' + convName + '")', (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                connection.query('CREATE TABLE ' + convName + '(id int NOT NULL AUTO_INCREMENT, author varchar(20) NOT NULL, message text, PRIMARY KEY (id))', (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    });
}

function delConv (convName) {
    return new Promise((resolve, reject) => {
        connection.query('DROP TABLE ' + convName, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                connection.query('DELETE FROM conversations WHERE name = "' + convName + '"', (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    });
}

function getConvs() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT name FROM conversations', (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                convs = [];
                results.forEach(element => {
                    convs.push(element.name);
                });
                resolve(convs);
            }
        });
    });
}

module.exports = { addUserToDb, incrementQuota, usersInDb, getQuota, addConv, delConv, getConvs };