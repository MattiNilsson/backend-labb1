const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require("fs");

const userData = require("./data/users.json");

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
 res.send('hello');
});
app.post("/signup", (req, res) => {
  if(req.body.username && req.body.password){
    if(userData.users[req.body.username] !== undefined){
      res.status(400).send("user already exists");
    }else{
      let data = userData;
      data.users[req.body.username] = {password : req.body.password};
      
      fs.writeFile("./data/users.json", JSON.stringify(data) ,function(err){
        console.log(req.body.username + " singed up!");
      });

      res.status(201).send({username : req.body.username, password : req.body.password})
    }
  }else{
    res.status(400).end();
  }
})
app.get("/login", (req, res) => {
  if(req.query.username && req.query.password){
    if(userData.users[req.query.username].password === req.query.password){
      console.log(req.query.username + " logged in!")
      res.status(200).send(req.query.username);
    }else{
      res.status(400).send("username & password not matching");
    }
  }else{
    res.status(400).send("failed?");
  }
})
io.on('connection', (socket) => {
 console.log('a user connected');
});

http.listen(4040, () => {
 console.log('listening on 4040');
});