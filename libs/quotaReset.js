const fs = require("fs");
const { resetQuotas } = require("./mysql.js");

function getLastResetDate() {
  const data = fs.readFileSync("./data/lastReset", "utf8");
  return parseInt(data);
}

function checkLastResetDate() {
  const lastResetDate = getLastResetDate();
  const now = Date.now();

  if (now - lastResetDate > 1000 * 60 * 60 * 24 * 30) {
    fs.writeFileSync("./data/lastReset", now.toString());
    return resetQuotas();
  } else {
    return false;
  }
}

module.exports = {
  checkLastResetDate,
};
