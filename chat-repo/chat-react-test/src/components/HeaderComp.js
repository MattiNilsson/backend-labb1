import React from "react";
import styled from "styled-components";

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
  background-color : #ffa31a;
  position: absolute;
  bottom: 0;
  z-index: 2;
}
`

function HeaderComp(props){
  return(
    <Wrapper>
      <h1>Chat-hub</h1>
      <div></div>
    </Wrapper>
  )
}

export default HeaderComp;