const axios = require('axios');
const cheerio = require('cheerio');
const url = require('url');
const fs = require('fs');

const stream = fs.createWriteStream('logs.txt', { flags:'a' });
const ua = 'Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36';

const simpleLog = (message) => {
    const fecha = new Date().toLocaleString('en-US').replace(/,/, '');
    stream.write(`[${fecha}]: ${message}\n`);
}


const main = async() => {
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
            const id = html.substring(html.indexOf(".setAttribute('name', '")+".setAttribute('name', '".length, html.indexOf("');"));
            console.log(`ID es: ${id}, activando...`);
            simpleLog(`ID es: ${id}, activando...`);
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
                    "Content-Type": "application/x-www-form-urlencoded",
                    'User-Agent': ua,
                    "Referer": "https://sv.spliktv.xyz/activar",
                    "Origin": "https://sv.spliktv.xyz",
                    "Content-Length": Buffer.byteLength(data.toString())
                }
            });
            html = res.data;
            $ = cheerio.load(html);
            const msgActivaste = $('#success').first().text().length > 0 ? $('#success').first().text() : null;
            if (msgActivaste === 'Error!') {
                const msgInfo = $('#info').first().text().length > 0 ? $('#info').first().text() : null;
                console.log(`${msgActivaste} ${msgInfo}`);
                simpleLog(`${msgActivaste} ${msgInfo}`);
                setTimeout(main, 5000);
            }
            else if (msgActivaste === 'Activado!') {
                console.log(msgActivaste);
                simpleLog(msgActivaste);
                setTimeout(main, 1000*60*60);
            }
            //TODO
            else {
                console.log('Creo que banearon, revisa el html');
                simpleLog('Creo que banearon, revisa el html');
                await fs.promises.writeFile('ban.html', html, 'utf8');
                return;
            }
        }
        else {
            console.log(`${msgActivaste} ${msgHora}`);
            simpleLog(`${msgActivaste} ${msgHora}`);
            setTimeout(main, 1000*60*60);
        }
    }
    catch (e) {
        console.error(e);
        simpleLog(e.message);
        setTimeout(main, 5000);
    }

}

main();
