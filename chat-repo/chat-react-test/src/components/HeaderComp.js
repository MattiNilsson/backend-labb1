import React from "react";
import styled from "styled-components";
import {Link, useHistory} from "react-router-dom";

const Wrapper = styled.header`
width: ${window.innerWidth}px;
height: 50px;
position: fixed;
top: 0;
-webkit-box-shadow: 0px 2px 23px 2px rgba(0,0,0,1);
-moz-box-shadow: 0px 2px 23px 2px rgba(0,0,0,1);
box-shadow: 0px 2px 23px 2px rgba(0,0,0,1);
display:flex;
justify-content:center;
align-items:center;
h1{
  text-shadow: 2px 2px 0px rgba(150, 150, 150, 0.49);
}
div{
  width: ${window.innerWidth}px;
  height: 2px;
  background-color : #35c9f1;
  position: absolute;
  bottom: 0;
  z-index: 2;
}
button{
  position: absolute;
  left: 10px;
  top: 10px;
  width: 100px;
  height: 30px;
  background-color: rgba(0,0,0,0);
  border: 0px;
  border-bottom: 2px solid white;
  color:white;
  font-size: 20px;
}
button:hover{
  border-bottom: 2px solid  #35c9f1;
  cursor: pointer;
}
.user{
  position: absolute;
  right: 45px;
  top: 10px;
  font-size: 20px;
}
.orb{
  width: 30px;
  height: 30px;
  background-color: white;
  border-radius: 2000px;
  position: absolute;
  right: 10px;
  top: 10px;
}
`

function HeaderComp(props){
  const history = useHistory();

  function onLogout(e){
    localStorage.removeItem("user");
    history.push("/login");
  }

  if(localStorage.getItem("user")){
    return(
      <Wrapper>
        <button onClick={onLogout}>log out</button>
        <h1>Chat-app</h1>
        <span className="user">
          {localStorage.getItem("user")}
        </span>
        <span className="orb"></span>
        <div></div>
      </Wrapper>
    )
  }else{
    return(
      <Wrapper>
        <h1>Chat-app</h1>
        <div></div>
      </Wrapper>
    )
  }
}

export default HeaderComp;