const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
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
                console.log('User added to database');
                resolve();
            }
        });
    });
}

function incrementQuota(id, value) {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET quota = quota + '+ value + ' WHERE userid = ' + id, (error, results, fields) => {
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
        connection.query('SELECT * FROM users', (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
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
                connection.query('CREATE TABLE ' + convName + '(id int NOT NULL AUTO_INCREMENT, author varchar(20) NOT NULL, message text, user varchar(20), PRIMARY KEY (id))', async (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(addMessage(convName, 'system', 'You are a helpful assistant.', 'System'));
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

function addMessage(convName, author, message, user) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO ' + convName + ' (author, message, user) VALUES ("' + author + '"'+', "' + message + '", "' + user + '")', (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function getMessages (convName, choice) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT author, message, user FROM ' + convName, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                messages = [];
                if (choice == 'role') {
                    results.forEach(element => {
                        messages.push({"role" : element.author, "content" : element.message});
                    });
                } else if (choice == 'user') {
                    results.forEach(element => {
                        messages.push({"user" : element.user, "content" : element.message});
                    });
                }

                resolve(messages);
            }
        });
    });
}

async function isNewUser(id, username) {
    return new Promise(async (resolve, reject) => {
        users = await usersInDb().catch(error => {
            reject(error);
        });

        test = false;
        quota = 0;

        users.forEach(element => {
            if (element.userid == id) {
                test = true;
                quota = element.quota;
            }
        });

        if (test == false) {
            addUserToDb(id, username);
        }

        resolve({quota : quota});
    });
}

module.exports = { addUserToDb, incrementQuota, usersInDb, getQuota, addConv, delConv, getConvs, addMessage, getMessages, isNewUser };