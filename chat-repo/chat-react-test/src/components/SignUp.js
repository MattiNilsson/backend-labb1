import React, {useState} from "react";
import styled from "styled-components";
import { Redirect } from 'react-router-dom';
import axios from "axios";

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

function SignUp(props){
  const [inputValues, setValues] = useState({username : "", password : ""})
  const [redirectTo, setRedirect] = useState("");
  let redirect;

  function SignUpSubmit(e){
    e.preventDefault();
    axios.post("/signup", inputValues)
    .then((response) => {
      console.log(response);
      setRedirect("/login");
    })
    .catch((error) => {console.log(error)})

  }

  function SignUpChange(e){
    let values = {...inputValues};
    values[e.target.name] = e.target.value;
    setValues(values);
  }

  function redirectNow(){
    setRedirect("/login")
  }

  if(redirectTo){
    redirect = (<Redirect to={redirectTo} />);
  }

  return(
    <Wrapper>
      {redirect}
      <h1>Sign up</h1>
      <form onSubmit={(e) => {SignUpSubmit(e)}}>
        <label>Username</label>
        <input 
          placeholder="username" 
          value={inputValues.username} 
          name="username" 
          onChange={(e) => {SignUpChange(e)}}
        />
        <label>Password</label>
        <input 
          placeholder="password" 
          value={inputValues.password} 
          name="password" 
          onChange={(e) => {SignUpChange(e)}}
        />
        <button type="submit">Sign Up</button>
      </form>
      <div className="noAccount">
        <p>already have an account? log in here!</p>
        <button onClick={redirectNow}>log in</button>
      </div>
    </Wrapper>
  )
}

export default SignUp;