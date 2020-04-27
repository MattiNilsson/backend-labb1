const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require("fs");

const userData = require("./data/users.json");
const roomData = require("./data/rooms.json");

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
app.get("/rooms", (req, res) => {
  if(roomData){
    res.status(200).send(roomData);
  }else{
    res.status(500).send("server fail?")
  }
})
app.post("/createRoom", (req, res) => {
  if(req.body.name){
    if(roomData.rooms)
    for(let i = 0; i < roomData.rooms.length; i++){
      if(roomData.rooms[i].name === req.body.name){
        res.status(400).send("room by that name already exists");
      }
    }
    let data = roomData;
    let newRoom = {name : req.body.name, password : req.body.pass, messeges : []}
    data.rooms.push(newRoom);
    fs.writeFile("./data/rooms.json", JSON.stringify(data) ,function(err){
      console.log("Room Created =" + req.body.username);
    });
    res.status(201).send(data);
  }else{
    res.status(400).send("bad request");
  }
})
app.delete("/deleteRoom", (req, res) => {
  console.log(req.query);
  if(req.query.id){
    let data = roomData;

    let newData;
    if(data.rooms.length > 1){
      newData = data.rooms.splice(req.query.id, 1);
    }else{
      newData = {rooms : []};
    }
    fs.writeFile("./data/rooms.json", JSON.stringify(newData) ,function(err){
      console.log("Room deleted");
    });
    res.status(204).send(newData);
  }else{
    res.status(400).send("something went wrong");
  }
})
io.on('connection', (socket) => {
 console.log('a user connected');
});

http.listen(4040, () => {
 console.log('listening on 4040');
});