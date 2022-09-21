const fs = require('fs');
const file = fs.createWriteStream('logs.txt', { flags:'a' });

module.exports = (name, message) => {
    const fecha = new Date().toLocaleString('en-US').replace(/,/, '');
    console.log(`[${name} ${fecha}]: ${message}`);
    file.write(`[${name} ${fecha}]: ${message}\n`);
}