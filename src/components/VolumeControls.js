import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Slider } from '@mui/material';

const VolumeControls = (props) => {
    const [volume, setVolume] = useState(0)

    function preventHorizontalKeyboardNavigation(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
        }
    }

    const onChange = (evt) => {
        setVolume(evt.target.value);
    }

    return (
        <div className='volumeControls'>
            <div id='volumeSlider'><Slider
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
                  onKeyDown={preventHorizontalKeyboardNavigation}
                  sx={{
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
            <div id='volumeButton'>
                <VolumeUpIcon sx={{fontSize: 27}}/>
            </div>
        </div>
    )

}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VolumeControls)