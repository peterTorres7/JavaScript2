'use strict'

import { Game } from "../models/game.js";

//find all documents
Game.find({}, (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
    return
});;

// count number of docs
console.log("step 1")
Book.countDocuments((err, result) => {
    console.log("stemp 2")
    console.log(result + " db entries");
});
console.log("step 3")