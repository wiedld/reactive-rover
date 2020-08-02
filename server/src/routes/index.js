const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello World"));

app.post('/', function (req, res) {
    res.send('Got a POST request')
  });

app.put('/', function (req, res) {
    res.send('Got a POST request')
});

app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user')
});

module.exports = app;
