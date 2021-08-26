import React from 'react';

// This will be coming from Redux
const tracks = ["https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/FastLane1.1.mp3","https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Pop-Smoke-Dior-Instrumental-Prod.-By-808Melo.mp3", "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Pop-Smoke-Invincible-Instrumental-Prod.-By-Yoz-Beatz.mp3", "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Boomit3.mp3"]

class Player extends React.Component {
  constructor() {
    super()
    this.state = {
      idx: 0
    }; 

    this.nextTrack = this.nextTrack.bind(this);
    this.prevTrack = this.prevTrack.bind(this);
  };

  nextTrack () {
    this.setState({
      idx: this.state.idx+1
    });
  };

  prevTrack () {
    this.setState({
      idx: this.state.idx-1
    });
  };

  render() {
    return (

      <div>
        <audio src={tracks[this.state.idx]} preload="auto" autoPlay onEnded={this.updateIdx} ref={(element) => {this.rap = element}}/> 
        <button onClick={() => this.rap.pause()}>Pause</button>
        <button onClick={() => this.rap.play()}>Play</button>
        <button onClick={() => this.nextTrack()}>Next</button>
        <button onClick={() => this.prevTrack()}>Prev</button>
      </div>
    )
  };
};

export default Player;