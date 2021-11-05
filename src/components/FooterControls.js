import React from 'react';
import {connect} from 'react-redux'
import FooterSlider from './FooterSlider'
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrow from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

class FooterControls extends React.Component {
    render() {
      const {play, pause, playing, nextTrack, prevTrack, currTime, duration, seekTime, toggleLoop, isLooping, selectCollectionAndChangeScreen} = this.props;
      if (!this.props.musicInfo.activeSession.songs[this.props.playIdx]) return (<div>Nothing Playing</div>) 
      return (
        <div /*FooterControls*/className='footerControls'>
          <div className='footerBox1' onClick={() => selectCollectionAndChangeScreen(this.props.musicInfo.activeSession.collectionId, 'PlayerScreen')}/* 1 */>
            <img className='footerArt' src='https://www.nikolapro.com/wp-content/uploads/2020/09/black_square.jpg'/>
            <div className='footerTextContainer'>
              <div>{this.props.musicInfo.activeSession.songs[this.props.playIdx].songName}</div>
              <div>{this.props.musicInfo.activeSession.songs[this.props.playIdx].artistName}</div>
              <div>{this.props.musicInfo.collections[this.props.musicInfo.activeSession.collectionId].collectionName}</div>
            </div>
          </div>
          <div className='footerBox2'/* 2 */>
            <div className='footerCenterTop'/*center top*/>
              <div id='footerControlsBPM' className='footerCenterTopLeft touchPaddingTop' onClick={() => selectCollectionAndChangeScreen(this.props.musicInfo.activeSession.collectionId, 'Tempo')}>{this.props.musicInfo.activeSession.currBPM}</div>
              <SkipPreviousIcon className='centerVertical' onClick={prevTrack} />
              {playing ? <PauseIcon className='footerCenterItem playPausePadding' sx={{fontSize: 36}} onClick={pause} /> : <PlayArrow className='footerCenterItem playPausePadding' sx={{fontSize: 36}} onClick={play} />}
              <SkipNextIcon className='centerVertical' onClick={nextTrack} />
              {/* <div className='footerCenterTopRight touchPaddingTop'>Lo</div> */}
              <AllInclusiveIcon onClick={toggleLoop} className={`footerCenterTopRight centerVertical touchPaddingTop ${isLooping ? 'loopOn' : null}`} />
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
  return {
    musicInfo: state.musicReducer,
    selectedCollection: state.screenReducer.selectedCollection,
    playIdx: state.musicReducer.activeSession ? state.musicReducer.activeSession.playIdx : null,
  }
}


  export default connect(mapStateToProps)(FooterControls)



