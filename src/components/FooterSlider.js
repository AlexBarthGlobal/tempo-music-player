import React, {useEffect, useState} from 'react'
import { Slider } from '@mui/material';
import secondsToTimestamp from './secondsToTimestamp';

const FooterSlider = (props) => {
    const [currTime, setCurrTime] = useState(0)
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
                  max={props.duration}
                  value={currTime}
                //   defaultValue={0}
                  onChange={onChange}
                  onChangeCommitted={onCommit}
                  getAriaValueText={(val) => {
                    return secondsToTimestamp(val)
                  }}
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

export default FooterSlider