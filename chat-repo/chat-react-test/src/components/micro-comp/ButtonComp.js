import React from "react";
import styled from "styled-components";

const Wrapper = styled.button`

width: 200px;
height: 30px;
color: white;
background-color: rgba(0,0,0,0);
border: none;
border-right: rgba(0,0,0,0) 4px solid;
border-bottom: 4px solid white;
font-size: 20px;
outline: none;
margin-top: 15px;

.underline{
  width: 0px;
  height: 30px;
  position: relative;
  bottom: 58px;
  left: -6px;
  border-bottom: 4px solid rgba(0,0,0,0);
  border-right: rgba(0,0,0,0) 4px solid;
  transition: all ease-out 0.4s;
}

:hover > .underline{
  width: 196px;
  border-bottom: 4px solid #35c9f1;
}
:focus > .underline{
  width: 196px;
  border-bottom: 4px solid #35c9f1;
}
:hover{
  cursor: pointer;
}

.background{
  background-color: rbga(0,0,0,0);
  width: 0px;
  position: relative;
  top: -28px;
  left: -6px;
  transition: all 0.4s ease-out;
  z-index: -1;
  opacity: 0.1;
  border-right: 30px solid rgba(0,0,0,0);
  border-bottom: 30px solid rgba(0,0,0,0);
}
:hover > .background{
  width: 166px;
  border-bottom: 30px solid #35c9f1;
}
:focus > .background{
  width: 166px;
  border-bottom: 30px solid #35c9f1;
}

:active > .background{
  transition: 0.1s linear all;
  border-bottom: 30px solid white;
}
:active > .underline{
  transition: 0.1s linear all;
  border-bottom: 4px solid white;
}

`

function ButtonComp(props){
  return(
    <Wrapper tabindex="1">
      {props.name}
      <div className="background"></div>
      <div className="underline"></div>
    </Wrapper>
  )
}

export default ButtonComp;