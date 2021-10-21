import React from 'react';
import {connect} from 'react-redux'
import previousTrack from '../icons/previousTrack.svg'
import { Slider } from '@mui/material';

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
          <div className='footerBox1'/* 1 */>
            <img className='footerArt' src='https://www.nikolapro.com/wp-content/uploads/2020/09/black_square.jpg'/>
            <div className='footerText'>
              <div className='footerText'>SongName</div>
              <div className='footerText'>Money manasdadsadsdaddasdasdasdadsasdasdasdasdasa</div>
              <div className='footerText'>Beach Chill</div>
            </div>
          </div>
          <div className='footerBox2'/* 2 */>
            <div className='footerCenterTop'/*center top*/>
              <div>140</div>
              <div>Prev</div>
              <div>Play</div>
              <div>Next</div>
              <div>Loop</div>
            </div>
            <div className='footerRow'/*center bottom*/>
              <div>0:23</div>
              <div className='maxWidth'>
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
              <div>3:21</div>
            </div>
          </div>
          <div className='footerBox3'/* 3 */>
            <div>Audio</div>
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



