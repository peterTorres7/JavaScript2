'use strict'

import { Int32 } from 'bson';
import mongoose from 'mongoose';
const { Schema } = mongoose;
import { connectionString } from "../lib/credentials.js";

mongoose.connect(connectionString, {
    dbName: 'sccprojects',
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('open', () => {
    console.log('Mongoose connected.');
});

const gameSchema = new Schema({
    name: { type: String, required: true },
    console: String,
    genre: String,
    hours: int
});

export const Game = mongoose.model('Game', gameSchema);
