import http from 'http';
import * as info from './data.js';
import { parse } from "querystring";

// starts an HTTP server
http.createServer((req,res) => {
    let url = req.url.split("?");
    let query = parse(url[1]);
    var path = url[0].toLowerCase();

    switch(path) {
        case '/':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify(info.getAll()));
            break;
        case '/about':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('I like anime');
            break;
        case '/detail':
            let game = info.getItem(query.name);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            let results = (game) ? JSON.stringify(game) : "Not found";
            res.end('Your game is ' + query.name + "\n" + results);
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not found');
    }
}).listen(process.env.PORT || 3000);