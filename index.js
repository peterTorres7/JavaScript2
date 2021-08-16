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
            res.render('home', { games: JSON.stringify(games) });
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
    Game.find((err, results) => {
        if (err || !results) { 
            res.status(404).json({ "Error": "Games not found" });
        } else { 
            res.json(results);
        }
    });
});

app.get('/api/v1/games/:name', (req,res,next) => {
    let name = req.params.name;
    console.log(name);
    Game.findOne({name: name}, (err, result) => {
        if (err || !result) {
            res.status(404).json({ "Error": "Game not found" });
        } else {
            res.json(result)
        }
    });
});

app.get('/api/v1/delete/:id', (req,res,next) => {
    Game.deleteOne({"_id":req.params.id}, (err, result) => {
        if (err || !result) {
            res.status(404).json({ "Error": "Game not deleted" });
        } else {
            console.log(result);
            res.json({ "deleted": result });
        }
    });
});

app.post('/api/v1/add/', (req,res,next) => {
    console.log(req.body);
    if (!req.body._id) {
        let game = new Game(req.body);
        game.save((err, newGame) => {
            if (err) {
                res.status(404).json({ "Error": "Game not added" });
            } else {
                res.json({ updated: 0, _id: newGame._id, message: "Game added" });
            }
        });
    } else {
        Game.updateOne({ _id: req.body._id}, {name: req.body.name, console: req.body.console, genre: req.body.genre, hours: req.body.hours}, (err, result) => {
            if (err || !result) {
                res.status(404).json({ "Error": "Game not updated" });
            } else {
                res.json({ updated: result.nModified, _id: req.body._id, message: "Gamed updated" });
            }
        });
    }
});   

app.get('/api/v1/add/:name/:console/:genre/:hours', (req,res,next) => {
    let name = req.params.name;
    Game.updateOne({ name: name}, {name: name, console: req.params.console, genre: req.params.genre, hours: req.params.hours}, {upsert: true}, (err, result) => {
        if (err) {
            res.status(404).json({ "Error": "Game not updated"});
        } else {
            res.json({updated: result.nModified, message: "Successful entry"});
        }
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
