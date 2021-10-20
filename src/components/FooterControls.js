import React from 'react';
import {connect} from 'react-redux'
import previousTrack from '../icons/previousTrack.svg'

class FooterControls extends React.Component {
    constructor() {
      super()
      this.state = {

      };
    };
  
    render() {
      const {playPause, nextTrack, prevTrack} = this.props;
      
      return (
        // <div>
        //   {playPause}
        //   <button onClick={prevTrack} disabled={!this.props.musicInfo.activeSession.songs[this.props.playIdx-1]}>Prev</button>
        //   <button onClick={nextTrack}>Next</button>
        //   <span>{this.props.musicInfo.activeSession.songs[this.props.playIdx] ? this.props.musicInfo.activeSession.songs[this.props.playIdx].songName : null}</span>
        // </div>

        <div /*FooterControls*/className='footerControls'>
          <div /*controlsTop*/className='controlsMainBox'>
            controlsTop
          </div>
          <div /*controlsLower*/className='controlsMainBox'>
            <div><img className='footerIcon' src={previousTrack}/></div>
          </div>
        </div>
      )
    };
  };

const mapStateToProps = (state) => {
    // console.log('State from App.js', state)
  return {
    // currentSong: state.musicReducer.activeSession ? state.musicReducer.currentSong : null
    musicInfo: state.musicReducer,
    selectedCollection: state.screenReducer.selectedCollection,
    playIdx: state.musicReducer.activeSession ? state.musicReducer.activeSession.playIdx : null,
  }
}


  export default connect(mapStateToProps)(FooterControls)



