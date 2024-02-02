import config from 'config';
import express from 'express';
import mongoose from 'mongoose';

const mongooseConnection = express()
const db_url = config.get('db_url')

mongoose.connect(db_url, {})
    .then(result => console.log('Database successfully connected'))
    .catch(error => console.log(error))

export { mongooseConnection }