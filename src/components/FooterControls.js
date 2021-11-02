import React from 'react';
import {connect} from 'react-redux'
import FooterSlider from './FooterSlider'
import NextTrack from '../icons/nextTrack.svg'
import PreviousTrack from '../icons/previousTrack.svg'

class FooterControls extends React.Component {
    render() {
      const {playPause, nextTrack, prevTrack, currTime, duration, seekTime} = this.props;
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
              <PreviousTrack onClick={prevTrack} />
              <div className='footerCenterItem'>{playPause}</div>
              <NextTrack onClick={nextTrack} />
              <div className='footerCenterTopRight'>Lo</div>
            </div>
            <FooterSlider currTime={currTime} duration={duration} seekTime={seekTime} />
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



