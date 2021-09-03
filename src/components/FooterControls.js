import React from 'react';

class FooterControls extends React.Component {
    constructor() {
      super()
      this.state = {
        idx: 0
      };
    };
  
    render() {
      const {playPause, nextTrack, prevTrack} = this.props;
      
      return (
        <div>
          {playPause}
          <button onClick={nextTrack}>Next</button>
          <button onClick={prevTrack}>Prev</button>
        </div>
      )
    };
  };



export default FooterControls



