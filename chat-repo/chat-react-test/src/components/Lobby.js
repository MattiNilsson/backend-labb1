import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Redirect } from 'react-router-dom';
import axios from "axios";

import ButtonComp from "./micro-comp/ButtonComp";

const Wrapper = styled.main`
  margin-top: 100px;
  display:flex;
  align-items:center;
  flex-direction: column;
  table{
    border-spacing: 0px;
  }
  th{
    border-bottom: 2px solid white;
    text-align: left;
    background-color: rgba(0,0,0,0);
    padding-right: 50px;
    font-size: 20px;
    position: relative;
    left: 30px;
  }
  .flex{
    width: ${window.innerWidth * 0.5}px;
    display:flex;
    justify-content: center;
  }
  .addRoom{
    display:flex;
    flex-direction: column;
    position: absolute;
    left: 30px;
  }
  .nameChange{
    display:flex;
    flex-direction: column;
    position: absolute;
    right: 30px;
  }
  td{
    border-bottom: 1px solid gray;
    background-color: rgba(0,0,0,0.02);
    text-align: left;
    transition: 0.2s ease-out all;
    font-size: 18px;
    position: relative;
    left: 30px;
  }
  tr:hover > td{
    border-bottom: 1px solid white;
    background-color: rgba(255,255,255,0.03);
    cursor: pointer;
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
    border-left: 4px solid #35c9f1;
    border-bottom: 4px solid #35c9f1;
  }
  .sideline{
    width: 5px;
    height: 200px;
    border-right: 10px solid #35c9f1;
    border-top: 30px solid rgba(0,0,0,0);
    border-bottom: 30px solid rgba(0,0,0,0);
    position: relative;
    left: -20px;
    top: -250px;
  }
  .sidelineRight{
    width: 5px;
    height: 200px;
    border-left: 10px solid #35c9f1;
    border-top: 30px solid rgba(0,0,0,0);
    border-bottom: 30px solid rgba(0,0,0,0);
    position: relative;
    right: -210px;
    top: -150px;
  }
  label{
    text-align: left;
    position: relative;
    top: 10px;
    left:2px;
  }
  .flexJoin{
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .flexJoin > h2{
    margin-bottom: 0;
  }
  .lock{
    position: relative;
    left: -160px;
    border: 0px;
    top: 2px;
    font-size: 18px;
  }
  .button{
    border-left: 2px solid white;
    border-bottom: 2px solid white;
    border-right: 2px rgba(0,0,0,0);
    border-top: 2px rgba(0,0,0,0);
    background-color: rgba(0,0,0,0);
    color: white;
    height: 18px;
    position: relative;
    left: 10px;
    top: -4px;
  }
  .button:hover{
    border-left: 2px solid #35c9f1;
    border-bottom: 2px solid #35c9f1;
  }
`

function Lobby(props){
  const [rooms, setRooms] = useState(false);
  const [inputValues, setInput] = useState({name : "", pass : ""})
  const [redirectTo, setRedirect] = useState("");
  const [fakeUsername, setFake] = useState("");
  const [selected, setSelected] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    axios.get("/rooms")
    .then((response) => {
      console.log(response);
      setRooms(response.data);
    })
    .catch((err) => {console.log(err)})
  }, [])

  function addRoom(e){
    e.preventDefault();
    axios.post("/createRoom", inputValues)
    .then((response) => {
      console.log(response);
      let newRooms = {...rooms};
      newRooms.rooms.push({name : inputValues.name.replace(/ /g, "-"), password : inputValues.pass, messages : []})
      setRooms(newRooms);
      setInput({name : "", pass : ""})
    })
    .catch((error) => {console.log(error)})
  }

  function inputChange(e){
    let newValues = {...inputValues}
    newValues[e.target.name] = e.target.value;
    setInput(newValues);
  }

  function fakeChange(e){
    setFake(e.target.value);
  }

  function deleteLobby(e){
    let myId = e.target.id
    axios.delete("/deleteRoom", {params: {id: myId}})
    .then((res) => {
      console.log(res);
      let newRooms = {...rooms};
      newRooms.rooms.splice(myId, 1)
      setRooms(newRooms);
    })
    .catch(err => console.log(err))
  }

  function joinLobby(e, room){
    e.preventDefault();
    if(selected.password !== password){
      alert("wrong password");
      return;
    }
    setRedirect({redirect : "/chatroom", room : room});
  }
  function selectLobby(e, room, password){
    setSelected({room : room, password : password})
  }
  let redirect
  if(redirectTo){
    redirect = (
      <Redirect to={{
        pathname : redirectTo.redirect,
        state : {room : redirectTo.room, fake : fakeUsername}
        
      }} />
    );
  }
  let addRoomForm = (
    <form className="addRoom" onSubmit={(e) => {addRoom(e)}}>
      <h2 style={{textDecoration : "underline"}}>Create new room</h2>
      <label>room name</label>
      <input 
        name="name"
        value={inputValues.name}
        onChange={(e) => inputChange(e)}
        placeholder=" . . ."
        type="text"
      />
      <label>password (optional)</label>
      <input 
        name="pass"
        value={inputValues.pass}
        onChange={(e) => inputChange(e)}
        placeholder=" . . ."
        type="text"
      />
      <ButtonComp name="create room" type="submit">submit</ButtonComp>
      <div className="sideline"></div>
    </form>
  )
  let quickNameChange = (
    <div className="nameChange">
      <h2 style={{textDecoration : "underline"}}>Fake name</h2>
      <label>new name</label>
      <input 
        placeholder=". . ."
        onChange={(e) => {fakeChange(e)}}
        value={fakeUsername}
      />
      <div className="sidelineRight"></div>
    </div>
  )

  function inputPassword(e){
    setPassword(e.target.value);
  }

  let selectedHTML;
  if(selected){
    selectedHTML = (
      <div>
        <form className="flexJoin" onSubmit={(e) => {joinLobby(e, selected.room)}}>
          <h2>{selected.room}</h2>
          {selected.password === "" ? 
            <div></div> : 
            <input value={password} onChange={(e) => {inputPassword(e)}} placeholder="password"/>}
          <ButtonComp name="Join" type="submit">submit</ButtonComp>
        </form>
      </div>
    )
  }
  
  if(rooms.rooms){
    return(
      <Wrapper>
        {redirect}
        <h1>lobby</h1>
        <div className="flex">
          {addRoomForm}
          {quickNameChange}
  
          <div>
            <h2>join lobby</h2>
            <table>
              <thead>
                <tr>
                  <th>room name</th>
                </tr>
              </thead>
              <tbody>
                {rooms.rooms.map((index, id) => {
                  return(
                    <tr key={index.name + id}>
                      <td onClick={(e) => {selectLobby(e, index.name , index.password)}}>{index.name}</td>
                      <span className="lock">{index.password === "" ? 
                      <span class="material-icons">lock_open</span> : 
                      <span class="material-icons">lock</span>
                      }</span>
                      <button className="button" onClick={(e) => {deleteLobby(e)}}id={id}>Remove</button>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {selectedHTML}
          </div>
        </div>
      </Wrapper>
    )
  }

  return(
    <Wrapper>
      <h1>lobby</h1>
      <div className="flex">
        {addRoomForm}

        <div>
          <h2>join lobby</h2>
          <h3>no lobbies found</h3>
        </div>
      </div>
    </Wrapper>
  )
}

export default Lobby;