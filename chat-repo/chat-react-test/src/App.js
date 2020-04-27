import React, { useEffect } from 'react';
import axios from "axios";
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import io from "socket.io-client";
import './App.css';

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import HeaderComp from "./components/HeaderComp";
import Lobby from "./components/Lobby";

function App() {
  useEffect(() => {
    axios.get("/")
    .then((response) => {
      console.log(response);
      //let socket = io("http://localhost:4040")
    })
  })
  console.log("hello");
  return (
    <div className="App">
      <Router>
        <HeaderComp />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="/lobby" component={Lobby} />
      </Router>
    </div>
  );
}

export default App;
