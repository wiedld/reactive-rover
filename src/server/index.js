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

/*
  TODO:
  - review network course
  - review SDI interview
*/

/*
    Use csurf middleware to protect against cross-site request forgery (CSRF).

    Always filter and sanitize user input to protect against cross-site scripting (XSS) and command injection attacks.

    Defend against SQL injection attacks by using parameterized queries or prepared statements.

    Use the open-source sqlmap tool to detect SQL injection vulnerabilities in your app.

    Use the nmap and sslyze tools to test the configuration of your SSL ciphers, keys, and renegotiation as well as the validity of your certificate.

    Use safe-regex to ensure your regular expressions are not susceptible to regular expression denial of service attacks.
*/
/*
Helmet is actually just a collection of smaller middleware functions that set security-related HTTP response headers:
    - csp sets the Content-Security-Policy header to help prevent cross-site scripting attacks and other cross-site injections.
    - hidePoweredBy removes the X-Powered-By header.
    hpkp Adds Public Key Pinning headers to prevent man-in-the-middle attacks with forged certificates.
    - hsts sets Strict-Transport-Security header that enforces secure (HTTP over SSL/TLS) connections to the server.
    - ieNoOpen sets X-Download-Options for IE8+.
    - noCache sets Cache-Control and Pragma headers to disable client-side caching.
    - noSniff sets X-Content-Type-Options to prevent browsers from MIME-sniffing a response away from the declared content-type.
    - frameguard sets the X-Frame-Options header to provide clickjacking protection.
    - xssFilter sets X-XSS-Protection to enable the Cross-site scripting (XSS) filter in most recent web browsers.
*/