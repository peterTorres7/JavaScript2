"use strict"

import * as data from './data.js';
import express from 'express';
import handlebars from 'express-handlebars';
import { Game } from './models/game.js';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static('./public'));
app.use(express.urlencoded());
app.use(express.json());

app.engine('handlebars', handlebars({defaultLayout: "main.handlebars"}));
app.set('view engine', 'handlebars');

app.get('/', (req,res,next) => {
    return Game.find({}).lean()
        .then((games) => {
            res.render('home', { games });
        })
        .catch(err => next(err))
});

app.get('/about', (req,res) => {
    res.type('text/plain');
    res.send('I like anime');
})

app.get('/delete', (req,res) => {
    let result = data.deleteItem(req.query.name);
    res.render('delete', {name: req.query.name, result: result});
});

app.get('/detail', (req,res,next) => {
    Game.findOne({ name:req.query.name }).lean()
        .then((name) => {
            res.render('details', {result: name});
        })
        .catch(err => next(err));    
});

// app.post('/detail', (req,res) => {
//     console.log(req.body);
//     let found = data.getItem(req.body.name);
//     res.render('details', {name: req.body.name, result: found, games: data.getAll()});
// });
app.post('detail', (req,res,next) => {
    Game.findOne({ name:req.query.name }).lean()
        .then((name) => {
            res.render('details', {result: name});
        })
        .catch(err => next(err));
});

app.use((req,res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
    console.log('Express started');
});
