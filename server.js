const express = require('express');
const app = express();

function start() {
    app.get('/', (req, res) => {
        console.log('Got it!');
        res.send('Hello World!');
    });

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

module.exports = { start };
