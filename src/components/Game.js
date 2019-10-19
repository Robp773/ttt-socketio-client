import React from "react";
import Info from "./Info";
import Box from "./Box";
import { API_BASE_URL } from "../config";
import io from "socket.io-client";
import Button from "@material-ui/core/Button";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxes: [
        { player: null },
        { player: null },
        { player: null },
        { player: null },
        { player: null },
        { player: null },
        { player: null },
        { player: null },
        { player: null }
      ],
      turn: "X",
      spaces: 9,
      player: null,
      winner: false,
      playerCount: 0
    };

    this.handleBoxSelect = this.handleBoxSelect.bind(this);

    this.room = io(`${API_BASE_URL}/${props.room}`);
    console.log(this.room);
    this.room.on("connect", () => {
      console.log(`Connected to room`);
    });

    this.room.on("disconnect", () => {
      console.log(`Disconnected from room`);
    });

    this.room.on("playerCount", playerCount => {
      console.log(`New Player Count: ${playerCount}`);
      this.setState({ playerCount });
    });

    this.room.on("playerAssign", player => {
      console.log(`Player Assigned: ${player}`);
      this.setState({ player });
    });

    this.room.on("gameUpdate", data => {
      console.log(`Game Update`);
      this.setState({ ...data });
    });

    this.room.on("gameReset", data => {
      console.log(`Game Reset`);
      this.setState({ ...data });
    });
  }

  handleBoxSelect(box) {
    let copy = this.state.boxes;
    // if box already occupied
    if (copy[box].player) {
      return;
    }
    // if it's not the player's turn or player is a spectator
    if (this.state.turn !== this.state.player) {
      return;
    }
    this.room.emit("boxChecked", {
      box,
      copy,
      turn: this.state.turn,
      spaces: this.state.spaces
    });
  }

  handleBackBtn() {
    this.room.disconnect();
    this.props.handleRoomSelect(null);
  }

  handleReset() {
    this.room.emit("gameReset");
  }

  render() {
    let boxes = this.state.boxes.map((box, index) => {
      return (
        <Box
          handleBoxSelect={this.handleBoxSelect}
          key={index}
          position={index}
          player={box.player}
          color={index % 2 ? "even" : "odd"}
        />
      );
    });
    return (
      <div className="App">
        <Info
          room={this.props.room}
          player={this.state.player}
          turn={this.state.turn}
          spaces={this.state.spaces}
        />
        <Button
          className="backBtn"
          onClick={() => {
            this.handleBackBtn();
          }}
          size="large"
          color="primary"
          variant="contained"
          style={{ fontSize: "15px", position: "absolute", margin: "1rem" }}
        >
          Back
        </Button>
        {this.state.playerCount < 2 ? (
          <div>
            <h3>Waiting for Second Player...</h3>
            <div className="missingPlayer">
              If you want to test the app out by yourself, click{" "}
              <a href="/" target="#">
                here
              </a>{" "}
              and join this game in a new window
            </div>
          </div>
        ) : (
          <div>
            {this.state.winner ? (
              <div className="winnerBox">
                <h3>{this.state.turn === "X" ? "O" : "X"} Wins!</h3>
                <Button
                  onClick={() => {
                    this.handleReset();
                  }}
                  size="large"
                  color="primary"
                  variant="contained"
                  style={{
                    fontSize: "15px"
                  }}
                >
                  Reset
                </Button>
              </div>
            ) : null}

            {this.state.spaces === 0 ? (
              <div className="winnerBox">
                <h3>Draw - No Spaces Left</h3>
                <Button
                  onClick={() => {
                    this.handleReset();
                  }}
                  size="large"
                  color="primary"
                  variant="contained"
                  style={{
                    fontSize: "15px"
                  }}
                >
                  Reset
                </Button>
              </div>
            ) : null}
            <div className="board">{boxes}</div>
          </div>
        )}
      </div>
    );
  }
}
