import React from 'react';
import {connect} from 'react-redux'
import previousTrack from '../icons/previousTrack.svg'

{/* <div><img className='footerIcon' src={previousTrack}/></div> */}

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
          <div /*controlsTop*/className='controlsTop'>
            <img className='footerArt' src='https://www.nikolapro.com/wp-content/uploads/2020/09/black_square.jpg'/>
            <div className='songNameAndArtist' /*songName&Artist*/>
              <div>songName</div>
              <div>Artist</div>
            </div>
            <div className='controlsBPM'>
              <div>BPM</div>
              <div>140</div>
            </div>
            <div>Player</div>
          </div>
          <div /*controlsLower*/className='controlsBottom'>
            <div className='controlButton'>Prev</div>
            <div className='controlButton'>Loop</div>
            <div className='trackpadAndDuration'/* trackpadAndDuration*/>
              <div className='controlsDurations' /*TOP, for duration*/>
                <div>0:00</div>
                <div>3:21</div>
              </div>
              <div /*BOTTOM Trackpad*/>Slider</div>
            </div>
            <div className='controlButton'>Play</div>
            <div className='controlButton'>Next</div>
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



