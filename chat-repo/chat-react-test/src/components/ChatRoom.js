import React, {useState, useEffect, useRef} from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import axios from "axios"
import io from "socket.io-client";

import {socket} from "./socket";

const Wrapper = styled.main`
margin-top: 25px;
display:flex;
flex-direction: column;
align-items: center;

.chatBorder{
  display:flex;
  flex-direction: column;
  width: 400px;
  height: 520px;
  border: 2px solid white;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
}
.other{
  align-self: flex-end;
  width: 100%;
  height: auto;
  max-width: 300px;
  display:flex;
  flex-direction: column;
}
.other > .text{
  font-size: 16px;
  align-self: flex-end;
  word-wrap: break-word;
  vertical-align:top;
  display:inline-block;
  height: auto;
  max-width: 280px;
  text-align: right;
  border: 1px solid white;
  border-radius: 15px 0 15px 15px;
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 2px;
  margin-top: 2px;
}
.other > .name{
  position: relative;
  right: -110px;
  top: 15px;
  color: white;
}
.me{
  align-self: flex-start;
  width: 100%;
  height: auto;
  max-width: 300px;
  display:flex;
  flex-direction: column;
}
.me > .text {
  font-size: 16px;
  align-self: flex-start;
  word-wrap: break-word;
  vertical-align:top;
  display:inline-block;
  height: auto;
  max-width: 280px;
  text-align: left;
  border: 1px solid #ffa31a;
  border-radius: 0 15px 15px 15px;
  padding: 10px;
  margin-left: 10px;
  margin-bottom: 2px;
  margin-top: 2px;
}
.me > .name{
  position: relative;
  left: -110px;
  top: 15px;
  color: #ffa31a;
}
input{
  margin-top: 10px;
    border-left: 4px solid white;
    border-bottom: 4px solid white;
    border-right: 4px solid rgba(0,0,0,0);
    border-top: 4px solid rgba(0,0,0,0);
    height: 30px;
    font-size: 20px;
    padding-left: 5px;
    width: 185px;
    background-color: rgba(0,0,0,0);
    color: white;
    outline: none;
    transition: all 0.4s ease-out;
}
input:focus{
  border-left: 4px solid #ffa31a;
  border-bottom: 4px solid #ffa31a;
}
input:focus ~ .send{
  border: 2px solid #ffa31a;
  background-color: #ffa31a;
}
.send{
  transition: all 0.4s ease-out;
  width: 40px;
  height: 40px;
  border-radius: 0 30px 30px 0;
  background-color: rgba(0,0,0,0);
  border: 2px solid white;
  outline: none;
  position: relative;
  left: 4px;
  top: 3px;
}
.send > span{
  position: relative;
  top: 0px;
  left: -1px;
}
.return{
  transition: all 0.1s ease-out;
  width: 40px;
  height: 40px;
  border-radius: 30px 0 0 30px;
  background-color: rgba(0,0,0,0);
  border: 2px solid white;
  outline: none;
  position: relative;
  left: -226px;
  top: 40px;

}
.return:hover{
  border: 2px solid #ffa31a;
  background-color: #ffa31a;
}
.return > span{
  position: relative;
  top: 2px;
  left: 0px;
}
h2{
  margin-bottom: 0;
  position: relative;
  top: 30px;
}

`



function ChatRoom(props){
  const [redirectTo, setRedirect] = useState("");
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [user, setUser] = useState("");

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [allMessages]);

  useEffect(() => {
    console.log("render")
    socket.emit('join', props.location.state.room, localStorage.getItem("user"));
    if(allMessages.length < 1){
      axios.get("/rooms", {params: {name: props.location.state.room}})
      .then((res) => {
        console.log(res);
        setAllMessages(res.data.messeges);
      })
    }
    setUser(localStorage.getItem("user"))
  }, [])

  useEffect(() => {
    console.log("rendertwoooo")
    socket.on("broad-message", data => {
      console.log(data);
      displayAll(data);
    })
    return function cleanup() {
      socket.off("broad-message");
    };
  }, []);

  function onMessage(e){
    setMessage(e.target.value);
  }

  function onSend(e){
    e.preventDefault();
    if(props.location.state.fake){
      socket.emit('message', props.location.state.room, message, props.location.state.fake);
    }else{
      socket.emit('message', props.location.state.room, message, user);
    }
    // {"user":"lol","msg":"gg"}
    let newMessage = [...allMessages]
    if(props.location.state.fake){
      newMessage.push({user : props.location.state.fake, msg : message})
    }else{
      newMessage.push({user : user, msg : message})
    }
    setAllMessages(newMessage);
    setMessage("");
  }

  function displayAll(data){
    setAllMessages(function(allMessages) {
      let newData = [...allMessages, data];

      return newData;
    });
  }

  function redirectBack(){
    setRedirect(true);
  }
  let redirect;
  if(redirectTo){
    return(
      <Redirect to="/lobby" />
    )
  }
  if(props.location.state === undefined){
    redirect = (
    <Redirect to="/lobby" />
    )
    return(
      <div>
        {redirect}
      </div>
    )
  }
  if(props.location.state.fake){
    return(
      <Wrapper>
        {redirect}
        <h2>{props.location.state.room}</h2>
        <button className="return" onClick={redirectBack}><span className="material-icons">keyboard_return</span></button>
        <div className="chatBorder">
          {allMessages.map((index, id) => {
            return(
              <div key={index.msg + id} className={index.user === props.location.state.fake? "me" : "other"}>
                <p className="name">{index.user}</p><p className="text">{index.msg}</p>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={(e) => {onSend(e)}}>
          <input onChange={(e) => onMessage(e)} value={message}/>
          <button className="send" type="submit"><span className="material-icons">reply</span></button>
        </form>
      </Wrapper>
    )
  }

  return(
    <Wrapper>
      {redirect}
      <h2>{props.location.state.room}</h2>
      <button className="return" onClick={redirectBack}><span className="material-icons">keyboard_return</span></button>
      <div className="chatBorder">
        {allMessages.map((index, id) => {
          return(
            <div key={index.msg + id} className={index.user === user ? "me" : "other"}>
              <p className="name">{index.user}</p><p className="text">{index.msg}</p>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={(e) => {onSend(e)}}>
        <input onChange={(e) => onMessage(e)} value={message}/>
        <button className="send" type="submit"><span className="material-icons">reply</span></button>
      </form>
    </Wrapper>
  )
}

export default ChatRoom;