const dirTree = require('directory-tree');
const Koa     = require('koa');
const Router  = require('koa-router');
const cors    = require('@koa/cors');
const fs      = require('fs');
const range   = require('koa-range');
const pathFs  = require('path');
const serve   = require('koa-static');


const app    = new Koa();
const router = new Router();

function getContenType(ext) {
    switch (ext) {
        case '.mp4':
            return 'video/mp4';
        case '.srt':
            return 'text/vtt; charset=utf-8';
    }
    return '';
}

router
    .get('/api', async ctx => {
        ctx.body = await dirTree('.', {extensions: /\.mp4/});
    })
    .get('/file', async ctx => {
        const path = ctx.query.path;
        console.log(path);
        const stat     = fs.statSync(path);
        const fileSize = stat.size;
        ctx.set('Content-Length', fileSize);
        ctx.set('Content-type', getContenType(pathFs.extname(path)));
        if (pathFs.extname(path) === '.mp4') {
            ctx.body = fs.createReadStream(path);
        } else {

            ctx.body = 'WEBVTT FILE\r\n\r\n' +
                fs.readFileSync(path, 'utf8').replace(/\{\\([ibu])\}/g, '</$1>')
                    .replace(/\{\\([ibu])1\}/g, '<$1>')
                    .replace(/\{([ibu])\}/g, '<$1>')
                    .replace(/\{\/([ibu])\}/g, '</$1>')
                    .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
                    .replace(/\r\n\{\\an8\}/g, ' line:5%\r\n')
                    .replace(/(\d)\s+(.*)\s+(.*)\s+/g, '$1\n$2\n$3\n\n')
                +
                '\r\n\r\n'
        }
    });


app.use(range);

app.use(cors({
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
}));
app.use(router.routes());
app.use(serve(__dirname + '/client/dist'));


app.listen(3000, function () {
    console.log('app running port 3000')
});
