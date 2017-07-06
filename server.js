const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const path = require('path');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var session = require('express-session')
var sess = {
  secret: 'keyboard cat',
  cookie: {}
}

const app = express();
 
// app.use(function (req, res) {
//   res.send({ msg: "hello" });
// });
app.use('/js', express.static(path.join(__dirname, 'views')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(session({
    secret: "cookie_secret",
    resave: true,
    saveUninitialized: true
}));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});
var userArray=[];
app.set('userArray', userArray);
app.post('/sendUserData',jsonParser,function(req,res){
	userArray.push(req.body.username);
	req.session.username=req.body.username;
	res.send({status:true,url:'/lobby.html'});
})

app.get('/lobby.html',jsonParser,function(req,res){
	console.log("user",req.session.username);
	console.log("user array",req.app.get('userArray'));
	res.render('lobby.html')
})

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
 
wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions 
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312) 
 
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
 
  ws.send('something');
});
 
server.listen(3000, function listening() {
  console.log('Listening on %d', server.address().port);
});
