import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Slider } from '@mui/material';
import {setVolumeThunk} from '../redux/playerDispatchers'

const VolumeControls = (props) => {
    const [volume, setVolume] = useState(Number(sessionStorage.getItem('volume') || Number(sessionStorage.getItem('volume')) == 0 || 100))
    const [mouseOver, setMouseOver] = useState(false)
    const [mouseDown, setMouseDown] = useState(false)

    function preventHorizontalKeyboardNavigation(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
        };
    };

    useEffect(() => {
        if (!mouseDown) return;
        const clicker = () => {
            console.log('mouseUp')
            setMouseDown(false)
            setMouseOver(false)
        }
        window.addEventListener('mouseup', clicker)
        return () => window.removeEventListener('mouseup', clicker)
    }, [mouseDown])

    useEffect(() => {
        props.setVolume(volume/100)
        sessionStorage.setItem('volume', volume)
    }, [volume])

    const onChange = (evt) => {
        if (Math.abs(evt.target.value - volume) >= 1) {
            setVolume(evt.target.value);
        };
    };

    return (
        <div className='volumeControls' onMouseLeave={mouseDown ? null : () => setMouseOver(false)}>
            <div className={`volumeWrapper ${mouseOver ? null : 'hidden'}`}></div>
            <div className={`volumeSlider ${mouseOver ? null : 'hidden'}`}><Slider
                  min={0}
                  defaultValue={0}
                  max={100}
                  value={volume}
                  onChange={onChange}
                  valueLabelDisplay='auto'
                  orientation='vertical'
                //   valueLabelFormat={() => secondsToTimestamp(currTime)}
                //   onChange={onChange}
                //   onChangeCommitted={onCommit}
                  step={1}
                  onKeyDown={preventHorizontalKeyboardNavigation}
                  onMouseDown={() => {
                      console.log('Clicked')
                      setMouseDown(true)
                  }}
                  sx={{
                    visibility: `${mouseOver ? 'visible' : 'hidden'}`,
                    '& input[type="range"]': {
                        WebkitAppearance: 'slider-vertical',
                    },
                    color: 'black',
                    '& .MuiSlider-thumb': {
                      width: 18,
                      height: 18,
                      backgroundColor: '#fff',
                      '&:before': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                      },
                      '&:hover, &.Mui-focusVisible': {   // This is the hover/glow
                        boxShadow: `0px 0px 5px 6px grey`,
                      },
                      '&.Mui-active': {
                        boxShadow: `0px 0px 10px 4px #FDFDFD`,
                      },
                    },
                  }}
                /></div>
            <div id='volumeButton' onMouseEnter={() => setMouseOver(true)}>
                <VolumeUpIcon sx={{fontSize: 27}}/>
            </div>
        </div>
    )

}

const mapDispatchToProps = (dispatch) => {
    return {
        setVolume: (volume) => dispatch(setVolumeThunk(volume))
    };
};

export default connect(null, mapDispatchToProps)(VolumeControls)