import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Wrapper = styled.main`
  margin-top: 100px;
  display:flex;
  align-items:center;
  flex-direction: column;
  table{
    border-spacing: 0px;
  }
  th{
    border: 1px solid gray;
    text-align: left;
    background-color: rgba(0,0,0,0.1);
    padding-right: 50px;
  }
  .flex{
    width: ${window.innerWidth * 0.5}px;
    display:flex;
    justify-content: space-between;
  }
  form{
    display:flex;
    flex-direction: column;
  }
  td{
    border: 1px solid gray;
    background-color: rgba(0,0,0,0.02);
    text-align: left;
    transition: 0.2s ease-out all;
  }
  tr:hover > td{
    border: 1px solid white;
  }
`

function Lobby(props){
  const [rooms, setRooms] = useState("");
  const [inputValues, setInput] = useState({name : "", pass : ""})

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
      newRooms.rooms.push({name : inputValues.name, password : inputValues.pass, messages : []})
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

  let addRoomForm = (
    <form onSubmit={(e) => {addRoom(e)}}>
      <h2>create lobby</h2>
      <label>lobby name</label>
      <input 
        name="name"
        value={inputValues.name}
        onChange={(e) => inputChange(e)}
      />
      <label>lobby password</label>
      <input 
        name="pass"
        value={inputValues.pass}
        onChange={(e) => inputChange(e)}
      />
      <button type="submit">submit</button>
    </form>
  )

  if(rooms.rooms){
    return(
      <Wrapper>
        <h1>lobby</h1>
        <div className="flex">
          {addRoomForm}
  
          <div>
            <h2>join lobby</h2>
            <table>
              <thead>
                <tr>
                  <th>room name</th>
                  <th>password</th>
                </tr>
              </thead>
              <tbody>
                {rooms.rooms.map((index, id) => {
                  return(
                    <tr key={index.name + id}>
                      <td>{index.name}</td>
                      <td>{index.password === "" ? "none" : "true"}</td>
                      <td onClick={(e) => {deleteLobby(e)}}id={id}>Remove</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
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