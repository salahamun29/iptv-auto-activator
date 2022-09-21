const fs = require('fs');
const path = require('node:path');
const simpleLog = require('./utils/simplelog.js');
const servicesPath = 'services';
const config = require('./config.json');
let services = fs.readdirSync(servicesPath).filter(file => file.endsWith('.js') && config[file.split('.')[0]]);
services = services.map(file => require(path.join(__dirname, servicesPath, file)));

for (const service of services) {
    simpleLog('Main', `Starting ${service.name}`);
    service.exec();
}