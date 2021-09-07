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
          <button onClick={prevTrack}>Prev</button>
          <button onClick={nextTrack}>Next</button>  
        </div>
      )
    };
  };



export default FooterControls



