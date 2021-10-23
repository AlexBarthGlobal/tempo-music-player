import React from 'react';
import {connect} from 'react-redux'
import previousTrack from '../icons/previousTrack.svg'
import FooterSlider from './FooterSlider'

{/* <div><img className='footerIcon' src={previousTrack}/></div> */}

class FooterControls extends React.Component {
    // constructor() {
    //   super()
    //   this.state = {

    //   };
    // };
  
    render() {
      const {playPause, nextTrackButton, prevTrackButton, currTime, endTime, seekTime} = this.props;
      if (!this.props.musicInfo.activeSession.songs[this.props.playIdx]) return (<div>Nothing Playing</div>) 
      return (
        <div /*FooterControls*/className='footerControls'>
          <div className='footerBox1'/* 1 */>
              <img className='footerArt' src='https://www.nikolapro.com/wp-content/uploads/2020/09/black_square.jpg'/>
            <div className='footerTextContainer'>
              <div>{this.props.musicInfo.activeSession.songs[this.props.playIdx].songName}</div>
              <div>{this.props.musicInfo.activeSession.songs[this.props.playIdx].artistName}</div>
              <div>{this.props.musicInfo.collections[this.props.musicInfo.activeSession.collectionId].collectionName}</div>
            </div>
          </div>
          <div className='footerBox2'/* 2 */>
            <div className='footerCenterTop'/*center top*/>
              <div className='footerCenterTopLeft'>{this.props.musicInfo.activeSession.currBPM}</div>
              <div className='footerCenterItem'>{prevTrackButton}</div>
              <div className='footerCenterItem'>{playPause}</div>
              <div className='footerCenterItem'>{nextTrackButton}</div>
              <div className='footerCenterTopRight'>Lo</div>
            </div>
            <FooterSlider currTime={currTime} endTime={endTime} seekTime={seekTime} end />
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



