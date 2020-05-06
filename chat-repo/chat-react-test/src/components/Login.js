import React, {useState} from "react";
import styled from "styled-components";
import { Redirect } from 'react-router-dom';
import axios from "axios";

import ButtonComp from "./micro-comp/ButtonComp";

const Wrapper = styled.main`
  position: relative;
  top: 100px;
  form{
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .noAccount{
    position: absolute;
    width: 300px;
    bottom: ${(window.innerHeight * -1) + 320}px;
    left: ${(window.innerWidth / 2) - 150}px;
  }
  .noAccount > p {
    margin-bottom: 0;
  }
`

function Login(props){
  const [inputValues, setValues] = useState({username : "", password : ""})
  const [redirectTo, setRedirect] = useState("");

  let redirect;
  if(redirectTo){
    redirect = (<Redirect to={redirectTo} />);
  }
  if(localStorage.getItem("user")){
    redirect = (<Redirect to={"/lobby"} />)
  }

  function loginSubmit(e){
    e.preventDefault();
    console.log(inputValues);
    axios.get("/login?username="+inputValues.username+"&password="+inputValues.password)
    .then((response) => {
      console.log(response);
      localStorage.setItem("user", response.data);
      setRedirect("/lobby")
    })
    .catch((error) => {console.log(error)})

  }

  function loginChange(e){
    let values = {...inputValues};
    values[e.target.name] = e.target.value;
    setValues(values);
  }

  function redirectNow(){
    setRedirect("/signup")
  }

  return(
    <Wrapper>
      {redirect}
      <h1>Login page</h1>
      <form onSubmit={(e) => {loginSubmit(e)}}>
        <label>Username</label>
        <input 
          placeholder="username" 
          value={inputValues.username} 
          name="username" 
          onChange={(e) => {loginChange(e)}}
        />
        <label>Password</label>
        <input 
          placeholder="password" 
          value={inputValues.password} 
          name="password" 
          type="password"
          onChange={(e) => {loginChange(e)}}
        />
        <ButtonComp type="submit" name="Log In"/>
      </form>
      <div className="noAccount">
        <p>no account? sign up here!</p>
        <button onClick={redirectNow}>sign up</button>
      </div>
    </Wrapper>
  )
}

export default Login;