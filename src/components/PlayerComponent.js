import React from 'react';
import {connect} from 'react-redux'
import MainPlayerSlider from '../components/MainPlayerSlider'
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import VolumeControls from './VolumeControls'

const PlayerComponent = (props) => {
    return (
        <div className='playerWrapper'>
            <div id='mainPlayerContainer'>
                <div id='mainPlayer'>
                    {/* <div className='mainPlayerSideBox' ></div> */}
                    <div id='innerMainPlayerContainer'>
                        <div id='innerMainPlayer'>
                            <div id='mainPlayerImageContainer'>
                                <img id='mainPlayerImg' src='https://images.genius.com/ecb6201ab5498a21dac43d928de2d127.499x499x1.png'/>
                                <div className='imagePlayerFiller'></div>
                            </div>
                            <div id='mainPlayerSongInfo'>
                                <div>{props.musicInfo.activeSession.songs[props.playIdx].songName}</div>
                                <div>{props.musicInfo.activeSession.songs[props.playIdx].artistName}</div>
                                <div>{props.musicInfo.activeSession.songs[props.playIdx].albumName}</div>
                                <div>Playing from: {props.musicInfo.collections[props.musicInfo.activeSession.collectionId].collectionName}</div>
                            </div>
                            <div className='mainPlayerFlexCenterVertical'>
                                <MainPlayerSlider play={props.play} pause={props.pause} playing={props.playing} prevTrack={props.prevTrack} nextTrack={props.nextTrack} currTime={props.currTime} duration={props.duration} seekTime={props.seekTime} />
                                <AllInclusiveIcon onClick={props.toggleLoop} className={`loopMarginTop ${props.isLooping ? 'loopOn' : null}`} />
                            </div>
                        </div>
                    </div>
                    {/* <div className='mainPlayerSideBox'></div> */}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        musicInfo: state.musicReducer,
        selectedCollection: state.screenReducer.selectedCollection,
        playIdx: state.musicReducer.activeSession ? state.musicReducer.activeSession.playIdx : null,
    };
};

export default connect(mapStateToProps)(PlayerComponent);