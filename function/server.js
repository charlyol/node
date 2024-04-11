const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

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

    const api = require("../routes/api")
    app.use("/",api)

    app.listen(port, () => {
        console.log('Server is running on port 3000');
    });
}


module.exports = { start };

