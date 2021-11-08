import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { Slider } from '@mui/material';
import {setVolumeThunk} from '../redux/playerDispatchers'

const VolumeControls = (props) => {
    const [volume, setVolume] = useState(Number(sessionStorage.getItem('volume') || Number(sessionStorage.getItem('volume')) == 0 || 100))
    const [mouseDown, setMouseDown] = useState(false)
    const [preMutedVolume, setPreMutedVolume] = useState(Number(sessionStorage.getItem('preMutedVolume') || Number(sessionStorage.getItem('preMutedVolume')) == 0 || 100))
    const [muted, setMuted] = useState(false)
    const [preVisible, setPreVisible] = useState(true)
    const [visible, setVisible] = useState(false)
    const [counter, setCounter] = useState(0)

    function preventHorizontalKeyboardNavigation(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
        };
    };

    useEffect(() => {
        let timer;
        console.log(preVisible)
        if (!preVisible) timer = setTimeout(() => setCounter(counter + 1), 1000);
        if (!preVisible && counter >= 1) {
            setPreVisible(true);
            setCounter(0)
            setVisible(false);
        };
        return () => clearTimeout(timer)
    }, [counter, preVisible]);

    useEffect(() => {
        setCounter(0);
    }, [preVisible])

    useEffect(() => {
        if (!mouseDown) return;
        const clicker = () => {
            console.log('mouseUp')
            setMouseDown(false)
            setPreVisible(false);
        }
        window.addEventListener('mouseup', clicker)
        return () => window.removeEventListener('mouseup', clicker)
    }, [mouseDown])

    useEffect(() => {
        props.setVolume(volume/100)
        sessionStorage.setItem('volume', volume)
        if (volume === 0) setMuted(true)
        else if (volume > 0 && muted) setMuted(false)
    }, [volume])

    const onChange = (evt) => {
        if (Math.abs(evt.target.value - volume) >= 1) {
            setVolume(evt.target.value);
        };
    };

    const toggleMute = () => {
        if (!muted) { //mute it here
            sessionStorage.setItem('preMutedVolume', volume);
            setPreMutedVolume(volume);
            props.setVolume(0)
            setVolume(0)
        } else { //unmute it here
            props.setVolume(preMutedVolume/100);
            setVolume(preMutedVolume);
            setMuted(false)
        }
    };

    return (
        <div className='volumeControlsMainPlayer' onMouseEnter={() => setPreVisible(true)} onMouseLeave={() => setPreVisible(false)}>
            <div className={`volumeWrapperMainPlayer ${visible ? null : 'hidden'}`}></div>
            <div className={`volumeSliderMainPlayer ${visible ? null : 'hidden'}`}><Slider
                  min={0}
                  defaultValue={0}
                  max={100}
                  value={volume}
                  onChange={onChange}
                  valueLabelDisplay='auto'
                  orientation='vertical'
                  step={1}
                  onKeyDown={preventHorizontalKeyboardNavigation}
                  onMouseDown={() => {
                      setPreVisible(true)
                      if (volume !== 0) {
                        sessionStorage.setItem('preMutedVolume', volume);
                        setPreMutedVolume(volume);
                      };
                  }}
                  sx={{
                    visibility: `${visible ? 'visible' : 'hidden'}`,
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
            <div id='volumeButtonMainPlayer' onMouseEnter={() => setVisible(true)}>
                {volume === 0 ? <VolumeOffIcon onClick={toggleMute} sx={{fontSize: 27}} /> : volume <= 30 ? <VolumeDownIcon onClick={toggleMute} sx={{fontSize: 27}} /> : <VolumeUpIcon onClick={toggleMute} sx={{fontSize: 27}} />}
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