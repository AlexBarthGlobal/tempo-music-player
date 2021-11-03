import React, {useEffect, useState} from 'react'
import { Slider } from '@mui/material';
import secondsToTimestamp from './secondsToTimestamp';

const MainPlayerSlider = (props) => {
    const [currTime, setCurrTime] = useState(props.currTime ? props.currTime : 0)
    const [seeking, setSeeking] = useState(false);

    useEffect (() => {
        if (!seeking) setCurrTime(props.currTime);
    }, [props.currTime])

    const onChange = (evt) => {
      setCurrTime(evt.target.value);
      setSeeking(true);
    }

    const onCommit = () => {
      console.log('SETTING NEW TIME', currTime)
      props.seekTime(currTime);
      setSeeking(false);
    }

    return (
        <div className='footerRow'/*center bottom*/>
              <div className='playTimeEndTime'>{secondsToTimestamp(props.currTime)}</div>
              <div className='footerSlider'>
                <Slider
                  min={0}
                  defaultValue={currTime}
                  max={Math.round(props.duration)}
                  value={Math.round(currTime)}
                //   defaultValue={0}
                  valueLabelFormat={() => secondsToTimestamp(currTime)}
                  onChange={onChange}
                  onChangeCommitted={onCommit}
                  valueLabelDisplay='auto'
                  sx={{
                    color: 'black',
                    '& .MuiSlider-thumb': {
                      width: 24,
                      height: 24,
                      backgroundColor: '#fff',
                      '&:before': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                      },
                      // '&:hover, &.Mui-focusVisible, &.Mui-active': {   // This is the hover/glow
                      //   boxShadow: 'none',
                      // },
                    },
                  }}
                />
              </div>
              <div className='playTimeEndTime'>{secondsToTimestamp(props.duration)}</div>
        </div>
    )
}

export default MainPlayerSlider