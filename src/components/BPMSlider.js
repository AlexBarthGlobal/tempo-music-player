import React, {useState, useEffect} from 'react';
// import ReactSlider from 'react-slider'
import { Slider } from '@mui/material';
import { isBrowser, isMobile } from 'react-device-detect';

const BPMSlider = (props) => {
    const [sliderBPM, setSliderBPM] = useState(props.localBPM)

    useEffect(() => {
        if (props.localBPM !== sliderBPM) setSliderBPM(props.localBPM);
        return;
    }, [props.localBPM])

    const onChange = (evt) => {
        if (evt.target.value === sliderBPM) return;
        setSliderBPM(Number(evt.target.value))
    }

    const onChangeCommitted = () => {
        props.setLocalBPM(sliderBPM)
    }

    return (
        <div>
            <div className='BPMText'>{!props.toggleDisabledBPM ? `${sliderBPM}` : props.disabledBPM ? 'Any BPM' : `${sliderBPM}`}</div>
            {props.toggleDisabledBPM ? <input name='Toggle Search by BPM' type='checkbox' checked={!props.disabledBPM} onChange={props.toggleDisabledBPM}/> : null}
            <div className={isBrowser ? 'horizontalSlider' : 'horizontalSliderMobile'}>
            <Slider
                min={80}
                max={200}
                value={sliderBPM}
                disabled={props.disabledBPM}
                onChange={onChange}
                onChangeCommitted={onChangeCommitted}
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
                }}
            />
            </div>
        </div>
    )
}

export default BPMSlider