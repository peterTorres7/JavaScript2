"use strict"

import * as data from './data.js';
import express from 'express';
import handlebars from 'express-handlebars';
import { Game } from './models/game.js';
import cors from 'cors';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static('./public'));
app.use(express.urlencoded());
app.use(express.json());
app.use('/api', cors());

app.engine('handlebars', handlebars({defaultLayout: "main.handlebars"}));
app.set('view engine', 'handlebars');

app.get('/', (req,res) => {
    Game.find({}).lean()
        .then((games) => {
            res.render('home', { games });
        })
        .catch(err => next(err));
});

app.get('/about', (req,res) => {
    res.type('text/plain');
    res.send('I like anime');
})

app.get('/detail', (req,res,next) => {
    Game.findOne({ name:req.query.name }).lean()
        .then((name) => {
            res.render('details', {result: name});
        })
        .catch(err => next(err));    
});

app.post('/detail', (req,res,next) => {
    Game.findOne({ name:req.body.name }).lean()
        .then((game) => {
            res.render('details', {result: game, name:req.body.name});
        })
        .catch(err => next(err));
});

app.get('/delete', (req,res,next) => {
    Game.deleteOne({ name:req.query.name }, (err, result) => {
        if (err) return next(err);
        let deleted = result.n !== 0;
        Game.countDocuments((err, total) => {
            res.type('text/html');
            res.render('delete', {name: req.query.name, deleted: result.n !== 0, total: total });
        });
    });
});

// api's
app.get('/api/v1/games', (req,res,next) => {
    Game.find((err, games) => {
        if (err) return next(err);
        if (games) {
            res.json(games);
        } else {
            res.status(400).send({ err: "There are no games" });
        };
    });
});

app.get('/api/v1/games/:name', (req,res,next) => {
    let name = req.params.name;
    Game.findOne({name: name}, (err, game) => {
        if (err) return next(err);
        if (game) {
            res.json(game)
        } else {
            res.status(400).sendStatus({ err: "There is no game" });
        };
    });
});


app.use((req,res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
    console.log('Express started');
});
