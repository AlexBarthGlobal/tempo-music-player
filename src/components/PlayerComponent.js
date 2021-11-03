import React, {useEffect, useState} from 'react';
import FooterSlider from '../components/FooterSlider'

const PlayerComponent = (props) => {

    return (
        <div id='mainPlayer'>
            <div>
                Art here
            </div>
            <div id='mainPlayerSongInfo'>
                <div>2040</div>
                <div>Lil baby</div>
                <div>Voice of the heroes</div>
                <div>Playing from: Beach Chill</div>
            </div>
            <div>
                Slider here
            </div>
            <div>Slider</div>
            <div className='mainPlayerflexVertical'>
                <div className='MainPlayerflexHorizontal'>
                    <div>Prev</div>
                    <div>Play</div>
                    <div>Next</div>
                </div>
                <div className='MainPlayerFlexCenter'>
                    <div>Loop</div>
                </div>
            </div>
        </div>
    )
}

export default PlayerComponent;