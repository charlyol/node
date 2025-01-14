const express = require('express');
const app = express();
const bb = require('express-busboy');
const api = require("../routes/api");
const path = require("path");
const port = process.env.PORT || 3000;
bb.extend(app, {
    upload: true,
    path: path.join(__dirname, "../data/folder"),
});


app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Autoriser toutes les origines (à des fins de développement)
    res.setHeader("Access-Control-Allow-Methods", "*"); // Autoriser toutes les méthodes HTTP
    res.setHeader("Access-Control-Allow-Headers", "*"); // Autoriser tous les en-têtes HTTP
    next();
});

function start() {
    app.get('/', (req, res) => {
        console.log('Got it!');
        res.send('Hello World!');
    });

    app.use('/',api);
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));

    app.listen(port, () => {
        console.log('Server is running on port 3000');
    });
}


module.exports = start;

