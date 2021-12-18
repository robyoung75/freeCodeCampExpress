var express = require('express');
var app = express();
let bodyParser = require('body-parser');

// console test
console.log("Hello World");

// middleware To parse the data coming from POST requests, you have to install the body-parser package. This package allows you to use a series of middleware, which can decode data in different formats. Note: extended is a configuration option that tells body-parser which parsing needs to be used. When extended=false it uses the classic encoding querystring library. When extended=true it uses qs library for parsing.When using extended=false, values can be only strings or arrays. The object returned when using querystring does not prototypically inherit from the default JavaScript Object, which means functions like hasOwnProperty, toString will not be available. The extended version allows more data flexibility, but it is outmatched by JSON.
app.use(bodyParser.urlencoded({ extended: false }))

// middleware to serve static files like css to your app.
app.use("/public", express.static(__dirname + "/public"));

// middleware to server the method path and ip address
app.use((req, res, next) => {
  console.log("middleware says hello")
  let method = req.method;
  let path = req.path;
  let ip_add = req.ip;

  let string = `${method} ${path} - ${ip_add}`
  console.log(string);

  next();
});

// middleware to serv up the date
const dateMiddleWare = (req, res, next) => {
  req.time = new Date().toString();
  next();
}

// route includes middleware for date
app.get("/now", dateMiddleWare, (req, res) => {
  console.log(req.time)
  res.send({ "time": req.time })
});


// get to serve index page to the app.
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// .env file would have the variable MESSAGE_STYLE=uppercase, env stores sensitive info like api keys...
app.get("/json", (req, res) => {

  const mySecret = process.env['MESSAGE_STYLE'];
  let message = "Hello json";

  if (mySecret === "uppercase") {
    res.json({ "message": message.toUpperCase() })
  } else {
    res.json({ "message": message })
  }

});

// get by params Route parameters are named segments of the URL, delimited by slashes (/). Each segment captures the value of the part of the URL which matches its position. The captured values can be found in the req.params object. Example: route_path: '/user/:userId/book/:bookId' actual_request_URL: '/user/546/book/6754' req.params: {userId: '546', bookId: '6754'}
app.get("/:word/echo", (req, res) => {
  let word = req.params.word;
  res.send({ "echo": word })
});

// The query string is delimited by a question mark (?), and includes field=value couples. Each couple is separated by an ampersand (&). Express can parse the data from the query string, and populate the object req.query
app.get("/name", (req, res) => {
  let { first: firstName, last: lastName } = req.query;
  res.json({
    name:
      `${firstName} ${lastName}`
  })
}).post((req, res) => {
  let string = `${req.body.first} ${req.body.last}`
  console.log(string)
  res.json({name: string})
})








































module.exports = app;
