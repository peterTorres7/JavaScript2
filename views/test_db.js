'use strict'

import { Game } from "../models/game.js";

//find all documents
// Game.find({}, (err, result) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(result);
//     }
//     return
// });;

Game.find({}).lean()
    .then((games) => {
        console.log(games);
    })
    .catch(err => next(err));

// return all matching records
// Game.find({"console": "playstation"}).lean()
//     .then((games) => {
//         console.log(game);
//     })
//     .catch(err => next(err));

// // return single record
// Game.findOne({"name": "halo"}).lean()
//     .then((games) => {
//         console.log(game);
//     })
//     .catch(err => next(err));


// count number of docs
console.log("step 1")
Game.countDocuments((err, result) => {
    console.log("step 2")
    console.log(result + " db entries");
});
console.log("step 3")