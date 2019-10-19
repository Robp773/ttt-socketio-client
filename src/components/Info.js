import React from "react";
export default function Info(props) {
  return (
    <div className="info">
      <div className='infoSection'>
        <h3>Game:</h3> <span>{props.room}</span>
      </div>
      <div className='infoSection'>
        <h3>Player:</h3> <span>{props.player}</span>
      </div>
      <div className='infoSection'>
        <h3>Turn:</h3>
        <span>{props.turn}</span>
      </div>
      <div className='infoSection'>
        <h3> Spaces Left: </h3>
        <span>{props.spaces}</span>
      </div>
    </div>
  );
}
