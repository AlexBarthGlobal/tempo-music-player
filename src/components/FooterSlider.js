import React, {useEffect, useState} from 'react'
import { Slider } from '@mui/material';

const FooterSlider = (props) => {
    const [currTime, setCurrTime] = useState(0)

    useEffect (() => {
        setCurrTime(props.currTime)
    }, [props.currTime, props.endTime])

    return (
        <div className='footerRow'/*center bottom*/>
              <div className='playTimeEndTime'>{currTime}</div>
              <div className='footerSlider'>
                <Slider
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
              <div className='playTimeEndTime'>{props.endTime}</div>
        </div>
    )
}

export default FooterSlider