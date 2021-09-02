import React from 'react';

class FooterControls extends React.Component {
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
          <button onClick={() => this.rap.pause()}>Pause</button>
          <button onClick={() => this.rap.play()}>Play</button>
          <button onClick={() => this.nextTrack()}>Next</button>
          <button onClick={() => this.prevTrack()}>Prev</button>
        </div>
      )
    };
  };







