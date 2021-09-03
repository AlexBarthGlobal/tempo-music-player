import React from 'react';

// This will be coming from Redux

class AudioPlayer extends React.Component {
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
        <audio src={tracks[this.state.idx]} preload="auto" autoPlay onEnded={this.nextTrack} ref={(element) => {this.rap = element}}/> 
      </div>
    )
  };
};

export default AudioPlayer;