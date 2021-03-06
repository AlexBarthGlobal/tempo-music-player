import React, {useEffect, useState} from 'react'
import { Slider } from '@mui/material';
import secondsToTimestamp from './secondsToTimestamp';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrow from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const MainPlayerSlider = (props) => {
    const {play, pause, playing, nextTrack, prevTrack} = props;
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
      props.seekTime(currTime);
      setSeeking(false);
    }

    return (
        <div className='footerColumn maxWidth'/*center bottom*/>
              <div className='mainSlider'>
                <Slider
                  min={0}
                  defaultValue={currTime}
                  max={Math.round(props.duration)}
                  value={Math.round(currTime)}
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
                    '& .MuiSlider-rail': {
                      color: 'gray',
                    },
                  }}
                />
              </div>
              <div id='mainPlayerTimestamps'>
                <div className='singleMainPlayerTimestamp'>{secondsToTimestamp(props.currTime)}</div>
                  <div id='mainPlayerControls'>
                    <SkipPreviousIcon sx={{fontSize: 36}} onClick={prevTrack} />
                    {playing ? <PauseIcon className='mainPlayerPlayPausePadding' sx={{fontSize: 36}} onClick={pause} /> : <PlayArrow className='mainPlayerPlayPausePadding' sx={{fontSize: 36}} onClick={play} />}
                    <SkipNextIcon sx={{fontSize: 36}} onClick={nextTrack} />
                  </div>
                <div className='singleMainPlayerTimestamp'>{secondsToTimestamp(props.duration)}</div>
              </div>
        </div>
    )
}

export default MainPlayerSlider