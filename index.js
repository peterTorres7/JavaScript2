"use strict"

import * as data from './data.js';
import express from 'express';
import handlebars from 'express-handlebars';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static('./public'));
app.use(express.urlencoded());
app.use(express.json());

app.engine('handlebars', handlebars({defaultLayout: "main.handlebars"}));
app.set('view engine', 'handlebars');

app.get('/', (req,res) => {
    res.render('home', { games: data.getAll() });
});

app.get('/about', (req,res) => {
    res.type('text/plain');
    res.send('I like anime');
})

app.get('/delete', (req,res) => {
    let result = data.deleteItem(req.query.name);
    res.render('delete', {name: req.query.name, result: result});
});

app.get('/detail', (req,res) => {
    let result = data.getItem(req.query.name);
    res.render('details', {name: req.query.name, result: result});
});

app.post('/detail', (req,res) => {
    console.log(req.body);
    let found = data.getItem(req.body.name);
    res.render('details', {name: req.body.name, result: found, games: data.getAll()});
});

app.use((req,res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
    console.log('Express started');
});

// // starts an HTTP server
// http.createServer((req,res) => {
//     let url = req.url.split("?");
//     let query = parse(url[1]);
//     var path = url[0].toLowerCase();

//     switch(path) {
//         case '/':
//             res.writeHead(200, {'Content-Type': 'text/plain'});
//             res.end(JSON.stringify(data.getAll()));
//             break;
//         case '/about':
//             res.writeHead(200, {'Content-Type': 'text/plain'});
//             res.end('I like anime');
//             break;
//         case '/detail':
//             let game = data.getItem(query.name);
//             res.writeHead(200, {'Content-Type': 'text/plain'});
//             let results = (game) ? JSON.stringify(game) : "Not found";
//             res.end('Your game is ' + query.name + "\n" + results);
//             break;
//         default:
//             res.writeHead(404, {'Content-Type': 'text/plain'});
//             res.end('Not found');
//     }
// }).listen(process.env.PORT || 3000);