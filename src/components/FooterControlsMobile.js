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

        <div /*FooterControls*/className='footerControlsMobile'>
            <div className='footerControlsMobileTop'>
                <div className='footerBox1Mobile'>
                    <img className='footerArtMobile' src='https://www.nikolapro.com/wp-content/uploads/2020/09/black_square.jpg'/>
                    <div className='footerTextContainerMobile'>
                        <div>SongName</div>
                        <div>ArtistName</div>
                        <div>Beach Chill</div>
                    </div>
                </div>
                <div className='footerBox3Mobile'>
                    <div>140</div>
                    <div className='footerItemCenterMobile'>Pl</div>
                    <div className='footerItemRightMobile'>Ne</div>
                </div>
            </div>
            <div className='footerSliderMobile'>
                <Slider
                //   disabled={true}
                  size='small'
                  defaultValue={70}
                  sx={{
                    padding: '0px !important',
                    // color: 'black',
                    // '& .MuiSlider-root': {
                    //     paddingTop: '0px'
                    // },
                    '& .MuiSlider-thumb': {
                        display: 'none',
                    //   width: 24,
                    //   height: 24,
                    //   backgroundColor: '#fff',
                      '&:before': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                      },
                      // '&:hover, &.Mui-focusVisible, &.Mui-active': {   // This is the hover/glow
                      //   boxShadow: 'none',
                      // },
                    },
                    '& .MuiSlider-track': {
                        color: 'orange',
                    },
                    '& .MuiSlider-rail': {
                        color: 'gray',
                    }
                  }}
                />
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



