const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {origins: '*:*'});
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
  if(req.query.name){
    console.log(req.query.name);
    fs.readFile("./data/rooms.json", (err, data) => {
      if(err){
        res.status(500).send("server fail?")
      }
      let parsedData = JSON.parse(data);
      for(let i = 0; i < parsedData.rooms.length; i++){
        if(parsedData.rooms[i].name === req.query.name){
          console.log("sent room data");
          res.status(200).send(parsedData.rooms[i]);
          return;
        }
      }
      res.status(400).end();
    })
  }else{
    fs.readFile("./data/rooms.json", (err, data) => {
      if(err){
        res.status(500).send("server fail?")
      }
      console.log("sent all data");
      res.status(200).send(data);
    })
  } 
})

app.post("/createRoom", (req, res) => {
  if(req.body.name){
    fs.readFile("./data/rooms.json", (err, data) => {
      if(err){
        res.status(500).send("server fail?")
      }
      data = JSON.parse(data);
      for(let i = 0; i < data.rooms.length; i++){
        if(data.rooms[i].name === req.body.name){
          res.status(400).send("room by that name already exists");
          return;
        }
      }
      let newRoom = {name : req.body.name, password : req.body.pass, messeges : []}
      data.rooms.push(newRoom);
      fs.writeFile("./data/rooms.json", JSON.stringify(data) ,function(err){
        console.log("Room Created =" + req.body.username);
      });
      res.status(201).send(data);     
    })
  }else{
    res.status(400).send("bad request");
  }
})
app.delete("/deleteRoom", (req, res) => {
  console.log(req.query);
  fs.readFile("./data/rooms.json", (err, data) => {
    if(err){
      res.status(500).send("server fail?")
    }
    if(req.query.id){
      let parsedData = JSON.parse(data);
  
      let newData;
      if(parsedData.rooms.length > 1){
        newData = parsedData.rooms.splice(req.query.id, 1);
      }else{
        parsedData = {rooms : []};
      }
      fs.writeFile("./data/rooms.json", JSON.stringify(parsedData) ,function(err){
        console.log("Room deleted");
      });
      console.log("parsed", parsedData);
      res.status(204).send(newData);
    }else{
      res.status(400).send("something went wrong");
    }
  })
})

io.sockets.on('connection', function(socket) {
  socket.on('join', function(room, name) {
    socket.join(room);
    socket.to(room).broadcast.emit(name + " joined room");
    console.log("user joined " + room)
  });
  socket.on('message', function(room, msg, user){
    fs.readFile("./data/rooms.json", (err, data) => {
      if (err) throw err;
      let parsedData = JSON.parse(data);
      for(let i = 0; i < parsedData.rooms.length; i++){
        if(parsedData.rooms[i].name === room){
          parsedData.rooms[i].messeges.push({user: user, msg : msg});
        }
      }
      fs.writeFile("./data/rooms.json", JSON.stringify(parsedData) ,function(err){
        console.log("message added to json");
      });
    })
    console.log(msg, "user :" + user, room);
    socket.to(room).broadcast.emit('broad-message', {user: user, msg : msg});
  });
});

http.listen(4040, () => {
 console.log('listening on 4040');
});