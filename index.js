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
