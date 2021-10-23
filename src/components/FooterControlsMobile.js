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



