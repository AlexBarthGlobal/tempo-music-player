import React from 'react';
import {connect} from 'react-redux'
import { Slider } from '@mui/material';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrow from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

class FooterControlsMobile extends React.Component {
  
    render() {
      const {play, pause, playing, nextTrack, currTime, duration, selectCollectionAndChangeScreen} = this.props;
      
      return (
        <div /*FooterControls*/className='footerControlsMobile'>
            <div className='footerControlsMobileTop'>
                <div className='footerBox1Mobile' onClick={() => selectCollectionAndChangeScreen(this.props.musicInfo.activeSession.collectionId, 'PlayerScreen')}>
                    <img className='footerArtMobile' src={this.props.musicInfo.activeSession.songs[this.props.playIdx].artURL}/>
                    <div className='footerTextContainerMobile'>
                        <div>{this.props.musicInfo.activeSession.songs[this.props.playIdx].songName}</div>
                        <div>{this.props.musicInfo.activeSession.songs[this.props.playIdx].artistName}</div>
                        <div>{this.props.musicInfo.collections[this.props.musicInfo.activeSession.collectionId].collectionName}</div>
                    </div>
                </div>
                <div className='footerBox3Mobile'>
                    <div className='centerVertical touchPaddingBottom' onClick={() => selectCollectionAndChangeScreen(this.props.musicInfo.activeSession.collectionId, 'Tempo')}>{this.props.musicInfo.activeSession.currBPM}</div>
                    <div className='footerItemCenterMobile touchPaddingTopMobile'>{playing ? <PauseIcon className='playPausePadding' sx={{fontSize: 36}} onClick={pause} /> : <PlayArrow className='playPausePadding' sx={{fontSize: 36}} onClick={play} />}</div>
                    <SkipNextIcon onClick={nextTrack} className='touchPaddingTopMobile' sx={{fontSize: 36}}/>
                </div>
            </div>
            <div className='footerSliderMobile'>
                <Slider
                  disabled={true}
                  min={0}
                  max={Math.round(duration)}
                  value={Math.round(currTime)}
                  size='small'
                  defaultValue={70}
                  sx={{
                    padding: '0px !important',
                    '& .MuiSlider-thumb': {
                        display: 'none',
                      '&:before': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                      },
                    },
                    '& .MuiSlider-track': {
                        color: '#d4af37'
                    },
                    '& .MuiSlider-rail': {
                        color: 'gray',
                        opacity: 1,
                        top: `75%`,
                        height: 4,
                        borderRadius: 0
                    }
                  }}
                />
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


  export default connect(mapStateToProps)(FooterControlsMobile)



