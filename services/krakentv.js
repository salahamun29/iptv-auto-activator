const axios = require('axios');
const cheerio = require('cheerio');
const url = require('url');
const simpleLog = require('../utils/simplelog.js');
const serviceName = 'Kraken TV';
const ua = 'Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36';


const exec = async() => {
    try {
        let res = await axios({
            method: 'get',
            url: 'https://www.listasiptvactualizadas.com/activar-kraken-tv/',
            headers: {
                'User-Agent': ua
            }
        });
        let html = res.data;
        let $ = cheerio.load(html);
        const msgActivaste = $('#activarspliktv').first().text().length > 0 ? $('#activarspliktv').first().text() : null;
        if (!msgActivaste) {
            const token = $('input[name="token"]').val();
            simpleLog(`Token: ${token}, activando...`);
            const data = new url.URLSearchParams({
                method_name: 'activate',
                token: token
            });
            res = await axios({
                method: 'post',
                url: 'https://www.listasiptvactualizadas.com/activar-kraken-tv',
                data: data.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': ua,
                    'Referer': 'https://www.listasiptvactualizadas.com/activar-kraken-tv',
                    'Origin': 'https://www.listasiptvactualizadas.com'
                }
            });
            html = res.data;
            $ = cheerio.load(html);
            const msgActivaste = $('#activarspliktv').first().text().length > 0 ? $('#activarspliktv').first().text() : null;
            if (msgActivaste.includes('Seras bloqueado por usar diferentes metodos, ponte en contacto con el admin.')) {
                simpleLog(serviceName, msgActivaste);
                return;
            }
            else if (msgActivaste.includes('Activado..!')) {
                simpleLog(serviceName, msgActivaste);
                setTimeout(exec, 1000 * 60 * 60);
            }
        }
        else {
            simpleLog(serviceName, msgActivaste);
            setTimeout(exec, 1000 * 60 * 60);
        }
    }
    catch (e) {
        simpleLog(serviceName, JSON.stringify(e));
        setTimeout(exec, 10000);
    }

}

module.exports = {
    exec: exec,
    name: serviceName
};