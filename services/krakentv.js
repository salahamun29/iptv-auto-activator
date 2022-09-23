const axios = require('axios');
const url = require('url');
const simpleLog = require('../utils/simplelog.js');
const serviceName = 'Kraken TV';
const ua = 'Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36';


const getStatus = () => new Promise(resolve => {
    axios({
        method: 'POST',
        url: 'https://sv.krakentv.app/web/api.php',
        data: 'method_name=check_out',
        headers: {
            'User-Agent': ua
        }
    }).then(response => resolve(response.data)).catch(error => resolve(error.response.data));
});


const activate = token => new Promise(resolve => {
    const body = new url.URLSearchParams({
        method_name: 'activate',
        token: token
    }).toString();
    axios({
        method: 'POST',
        url: 'https://sv.krakentv.app/web/api.php',
        data: body,
        headers: {
            'User-Agent': ua
        }
    }).then(response => resolve(response.data)).catch(error => resolve(error.response.data));
});
const exec = async() => {
    let status = await getStatus();
    if (status.code === 200 && status.message == 'You already activate') {
        simpleLog(serviceName, 'Ya has activado');
        setTimeout(exec, 1000 * 60 * 60);        
    }
    else if (status.token) {
        status = await activate(status.token);
        if (status.code === 200 && status.message == 'Successful activate') {
            simpleLog(serviceName, 'Activado exitosamente');
            setTimeout(exec, 1000 * 60 * 60);        
        }
    }
    else {
        simpleLog(serviceName, 'Servidor en mantenimiento...');
        setTimeout(exec, 60000);        
    }
}

module.exports = {
    exec: exec,
    name: serviceName
};
