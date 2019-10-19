import React from "react";
import Game from "./components/Game";
import RoomSelect from "./components/RoomSelect";
import { API_BASE_URL } from "./config";
import io from "socket.io-client";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { room: null };
    this.dataStream = io(`${API_BASE_URL}`);
    this.handleRoomSelect = this.handleRoomSelect.bind(this);
  }

  handleRoomSelect(room) {
    this.setState({ room });
    this.dataStream.emit("roomRefresh");
  }

  render() {
    return (
      <div className="App">
        {this.state.room ? (
          <Game
            handleRoomSelect={this.handleRoomSelect}
            room={this.state.room}
          />
        ) : (
          <RoomSelect
            handleRoomSelect={this.handleRoomSelect}
            dataStream={this.dataStream}
          />
        )}
      </div>
    );
  }
}
