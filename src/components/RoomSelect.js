import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rooms: null, newRoom: "", playerCount: 0 };

    this.props.dataStream.on("connect", () => {
      console.log(`Connected to socket`);
    });

    this.props.dataStream.on("disconnect", () => {
      console.log(`Disconnected from socket`);
    });

    this.props.dataStream.on("playerCount", playerCount => {
      this.setState({ playerCount });
    });

    // when someone creates a room - update list
    this.props.dataStream.on("roomList", rooms => {
      this.setState({ rooms });
    });

    this.props.dataStream.on("roomCreated", rooms => {
      this.setState({ rooms });
    });
  }

  // creates new socket.io room
  handleCreate() {
    if (this.state.newRoom.trim() !== "") {
      this.props.dataStream.emit("create", this.state.newRoom);
      this.setState({ newRoom: "" });
    }
  }

  handleTypingRoom(e) {
    this.setState({ newRoom: e.target.value });
  }

  render() {
    return (
      <div className="roomSelect">
        <div className="playersOnline">
          Players Online: {this.state.playerCount}
        </div>

        <div className="createGame">
          <h3>Start a Game</h3>
          <div className="selectionForm">
            <TextField
              className="roomInput"
              label="Room Name"
              variant="outlined"
              onChange={e => {
                this.handleTypingRoom(e);
              }}
              value={this.state.newRoom}
              inputProps={{
                style: {
                  fontSize: 15,
                  labelSize: 15,
                  background: "white"
                }
              }}
              InputLabelProps={{
                style: { fontSize: 15 }
              }}
            />

            <Button
              onClick={() => this.handleCreate()}
              size="large"
              color="primary"
              variant="contained"
              style={{ fontSize: "15px" }}
            >
              Create
            </Button>
          </div>
        </div>

        <div>
          <div className="joinGame">
            <h3>Join a Game</h3>
            {this.state.rooms && this.state.rooms.length ? (
              this.state.rooms.map((room, index) => {
                return (
                  <div
                    className="room"
                    onClick={() => {
                      this.props.handleRoomSelect(room);
                    }}
                    key={index}
                  >
                    {room}
                  </div>
                );
              })
            ) : (
              <div className="noRooms">No Active Rooms</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
