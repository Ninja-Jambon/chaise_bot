const fs = require('fs');

function addToLogs(message) {
    fs.appendFile('./logs/logs.txt', message + "\n", err => {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = { addToLogs };