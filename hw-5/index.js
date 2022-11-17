const http = require('http');
const path = require('path');
const fs = require('fs');

(async () => {
    const isFile = (path) => fs.lstatSync(path).isFile();

    http.createServer( (req, res) => {
        const path = path.join(process.cwd(), req.url)

        if (!fs.existsSync(path)) return res.end('File or directory not found');

        if (isFile(path)) {
            return fs.createReadStream(path).pipe(res);
        }

        let linksList = '';

        const urlParams = req.url.match(/[\d\w\.]+/gi);

        if (urlParams) {
            urlParams.pop();
            const prevUrl = urlParams.join('/');
            linksList = urlParams.length ? `<li><a href="/${prevUrl}">..</a></li>` : '<li><a href="/">..</a></li>';
        }

        fs.readdirSync(path)
            .forEach(fileName => {
                const filePath = path.join(req.url, fileName);
                linksList += `<li><a href="${filePath}">${fileName}</a></li>`;
            });
        const HTML = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8').replace('##links', linksList);
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        return res.end(HTML);
    }).listen(3000);
})();
