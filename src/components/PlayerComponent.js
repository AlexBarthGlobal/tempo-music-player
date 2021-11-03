import React, {useEffect, useState} from 'react';
import MainPlayerSlider from '../components/MainPlayerSlider'

const PlayerComponent = (props) => {

    return (
        <div id='mainPlayerContainer'>
        <div id='mainPlayer'>
            <div id='innerMainPlayerContainer'>
            <div id='innerMainPlayer'>
                <div>
                    <img id='mainPlayerImg' src='https://images.genius.com/ecb6201ab5498a21dac43d928de2d127.499x499x1.png'/>
                </div>
                <div id='mainPlayerSongInfo'>
                    <div>Proud</div>
                    <div>Money Man</div>
                    <div>6 Hours 2</div>
                    <div>Playing from: Beach Chill</div>
                </div>
                <div className='mainPlayerFlexCenterVertical'>
                    <div>Slider</div>
                    <div className='mainPlayerflexHorizontal'>
                        <div>Prev</div>
                        <div>Play</div>
                        <div>Next</div>
                    </div>
                    <div>Loop</div>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default PlayerComponent;