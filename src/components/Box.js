import React from "react";
export default function Box(props) {
  return (
    <div
      onClick={() => props.handleBoxSelect(props.position)}
      className={`box ${props.color}`}
    >
      {props.player}
    </div>
  );
}
