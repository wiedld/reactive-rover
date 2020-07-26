const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello World"));

app.get("/req", (req, res) => res.send(JSON.stringify(Object.keys(req))));
app.get("/res", (req, res) => res.send(JSON.stringify(Object.keys(res))));

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
