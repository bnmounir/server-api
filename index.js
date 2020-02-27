const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const routes = require('./routes');
const keys = require('./keys');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
app.use('/', routes);

// Connecting Mongoose to MongoDB atlas
mongoose
    .connect(keys.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log('connected to remote database!');
    })
    .catch(e => console.log('an error occurred:', e.message));

// port listening to requests
app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
