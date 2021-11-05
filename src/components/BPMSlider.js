import React, {useState, useEffect} from 'react';
// import ReactSlider from 'react-slider'
import { Slider } from '@mui/material';

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
            <div className='BPMText'>{`${sliderBPM}`}</div>
            <div className='horizontalSlider'>
            <Slider
                min={80}
                max={200}
                value={sliderBPM}
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
                        // '&:hover, &.Mui-focusVisible, &.Mui-active': {   // This is the hover/glow
                        //   boxShadow: 'none',
                        // },
                    },
                }}
            />
            </div>
        </div>
    )
}

export default BPMSlider