const axios = require('axios');
const cheerio = require('cheerio');
const url = require('url');
const simpleLog = require('../utils/simplelog.js');
const serviceName = 'Splik TV';
const ua = 'Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36';


const exec = async() => {
    try {
        let res = await axios({
            method: 'get',
            url: 'https://sv.spliktv.xyz/activar',
            headers: {
                'User-Agent': ua,
                "Referer": "https://sv.spliktv.xyz/activar",
                "Origin": "https://sv.spliktv.xyz"
            }
        });
        let html = res.data;
        let $ = cheerio.load(html);
        const msgActivaste = $('#success').first().text().length > 0 ? $('#success').first().text() : null;
        const msgHora = $('.info').first().text().length > 0 ? $('.info').first().text() : null;
        if (!(msgActivaste || msgHora)) {
            const id = $('input[id="bt_rrt"]').attr('name');
            simpleLog(serviceName, `ID es: ${id}, activando...`);
            const data = new url.URLSearchParams({
                btn_veri: 'yes1',
                btn_ver: 'yes',
                [id]: 'Pulsa aquí para activar'
            });
            res = await axios({
                method: 'post',
                url: 'https://sv.spliktv.xyz/activar',
                data: data.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': ua,
                    'Referer': 'https://sv.spliktv.xyz/activar',
                    'Origin': 'https://sv.spliktv.xyz'
                }
            });
            html = res.data;
            $ = cheerio.load(html);
            const msgActivaste = $('#success').first().text().length > 0 ? $('#success').first().text() : null;
            if (msgActivaste === 'Error!') {
                const msgInfo = $('#info').first().text().length > 0 ? $('#info').first().text() : null;
                simpleLog(serviceName, `${msgActivaste} ${msgInfo}`);
                setTimeout(exec, 5000);
            }
            else if (msgActivaste === 'Activado!') {
                simpleLog(serviceName, msgActivaste);
                setTimeout(exec, 1000*60*60);
            }
            else {
                simpleLog('Creo que banearon, revisa el html');
                await fs.promises.writeFile('ban.html', html, 'utf8');
                return;
            }
        }
        else {
            simpleLog(serviceName, `${msgActivaste} ${msgHora}`);
            setTimeout(exec, 1000*60*60);
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