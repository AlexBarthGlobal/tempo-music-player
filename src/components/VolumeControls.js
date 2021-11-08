import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { Slider } from '@mui/material';
import {setVolumeThunk} from '../redux/playerDispatchers'

const VolumeControls = (props) => {
    const [volume, setVolume] = useState(Number(sessionStorage.getItem('volume') || Number(sessionStorage.getItem('volume')) == 0 || 100))
    const [mouseOver, setMouseOver] = useState(false)
    const [mouseDown, setMouseDown] = useState(false)
    const [preMutedVolume, setPreMutedVolume] = useState(Number(sessionStorage.getItem('preMutedVolume') || Number(sessionStorage.getItem('preMutedVolume')) == 0 || 100))
    const [muted, setMuted] = useState(false)
    const [visible, setVisible] = useState(false)

    function preventHorizontalKeyboardNavigation(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
        };
    };

    useEffect(() => {
        if (!mouseOver && !mouseDown) setTimeout(() => {setVisible(false)}, 300)
        if (!mouseDown) return;
        const clicker = () => {
            console.log('mouseUp')
            setMouseDown(false)
            console.log('from listener', mouseOver)
            if (!mouseOver) setTimeout(() => {setVisible(false)}, 300)
        }
        window.addEventListener('mouseup', clicker)
        return () => window.removeEventListener('mouseup', clicker)
    }, [mouseDown, mouseOver])

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
        <div className='volumeControls' onMouseLeave={() => setMouseOver(false)}>
            <div className={`volumeWrapper ${visible ? null : 'hidden'}`}></div>
            <div className={`volumeSlider ${visible ? null : 'hidden'}`}><Slider
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
            <div id='volumeButton' onMouseEnter={() => {
                setMouseOver(true)
                setVisible(true)
            }}>
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