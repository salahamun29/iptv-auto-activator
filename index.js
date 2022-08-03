const axios = require('axios');
const url = require('url');

const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36";
const main = async() => {
    try {
        const res = await axios.get('https://sv.spliktv.xyz/activar', {
            headers: {
                "user-agent": ua
            }
        });
        const body = res.data;
        if (body.includes('Ya activaste!')) {
            console.log('Ya activaste, reintentando en 1 hora...');
            setTimeout(main,  1000 * 60 * 60);
        }
        else {
            const id = body.substring(body.indexOf(".setAttribute('name', '")+".setAttribute('name', '".length, body.indexOf("');"));
            console.log(`Id es: ${id}, activando...`);
            params = {
                btn_veri: 'yes1',
                btn_ver: 'yes',
            }
            params[id] = 'Pulsa aquí para activar'
            const data = new url.URLSearchParams(params);
            const r = await axios({
                method: 'post',
                url: 'https://sv.spliktv.xyz/activar',
                data: data.toString(),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'User-Agent': ua,
                    "Referer": "https://sv.spliktv.xyz/activar",
                    "Origin": "https://sv.spliktv.xyz",
                    "Content-Length": Buffer.byteLength(data.toString())
                },
            });
            const body2 = r.data.toLowerCase();
            console.log(r);
            if (!body2.includes('error')) {
                console.log('Activado exitosamente...');
            }
            else {
                console.log('Ocurrió un error');
            }
            setTimeout(main, 5000);
        }
    }
    catch (e) {
        console.error(e);
        setTimeout(main, 5000);
    }

}

main();
