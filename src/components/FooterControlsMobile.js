import React from 'react';
import {connect} from 'react-redux'
import previousTrack from '../icons/previousTrack.svg'
import { Slider } from '@mui/material';

{/* <div><img className='footerIcon' src={previousTrack}/></div> */}

class FooterControlsMobile extends React.Component {
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
            <div className='footerTopLeft enablePointerEvents' /*Footer TOPLEFT*/>
              <img className='footerArt' src='https://www.nikolapro.com/wp-content/uploads/2020/09/black_square.jpg'/>
              <div className='songNameAndArtist' /*songName&Artist*/>
                <div>songName</div>
                <div>Artist</div>
              </div>
            </div>
            <div /*Footer TOPRIGHT*/ className='controlsBPM enablePointerEvents'>
              <div>BPM</div>
              <div>140</div>
            </div>
          </div>
          <div /*controlsLower*/className='controlsBottom enablePointerEvents'>
            <div className='controlButton'>Prev</div>
            <div className='controlButton'>MOBILE</div>
            <div className='trackpadAndDuration'/* trackpadAndDuration*/>
              <div className='controlButton'>0:00</div>
              <div className='footerSlider' /*BOTTOM Trackpad*/>
                <Slider 
                  sx={{
                    color: 'black',
                    '& .MuiSlider-thumb': {
                      width: 24,
                      height: 24,
                      backgroundColor: '#fff',
                      '&:before': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                      },
                      // '&:hover, &.Mui-focusVisible, &.Mui-active': {   // This is the hover/glow
                      //   boxShadow: 'none',
                      // },
                    },
                  }}
                />
              </div>
              <div className='controlButton'>3:21</div>
            </div>
            <div className='controlButton'>Loop</div>
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


  export default connect(mapStateToProps)(FooterControlsMobile)



