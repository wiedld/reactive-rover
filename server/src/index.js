const express = require("express");
const path = require('path');
const helmet = require("helmet");
const cookieSession = require('cookie-session');
const app = require("./routes");

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use((req, res, next) => res.status(404).send("Not Found Here"));

app.use(helmet());

const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.set('trust proxy', 1);
app.use(cookieSession({
    name: 'sessionId',
    keys: ['key1', 'key2'],
    cookie: {
        secure: true,
        httpOnly: true,
        domain: 'hedgehogs.com',
        expires: expiryDate
      }
  }));

app.disable('x-powered-by'); // Helmet does this by default

app.listen(3000, () => console.log("Example app listening"));
