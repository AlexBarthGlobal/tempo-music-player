import React, {useEffect, useState} from 'react';
import MainPlayerSlider from '../components/MainPlayerSlider'
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

const PlayerComponent = (props) => {

    return (
        <div id='mainPlayerContainer'>
        <div id='mainPlayer'>
            <div id='innerMainPlayerContainer'>
            <div id='innerMainPlayer'>
                <div id='mainPlayerImageContainer'>
                    <img id='mainPlayerImg' src='https://images.genius.com/ecb6201ab5498a21dac43d928de2d127.499x499x1.png'/>
                </div>
                <div id='mainPlayerSongInfo'>
                    <div>Proud</div>
                    <div>Money Man</div>
                    <div>6 Hours 2</div>
                    <div>Playing from: Beach Chill</div>
                </div>
                <div className='mainPlayerFlexCenterVertical'>
                    <MainPlayerSlider play={props.play} pause={props.pause} playing={props.playing} nextTrack={props.nextTrack} currTime={props.currTime} duration={props.duration} seekTime={props.seekTime} />
                    <AllInclusiveIcon className='loopMarginTop' />
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default PlayerComponent;