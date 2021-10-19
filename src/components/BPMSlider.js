import React, {useState, useEffect} from 'react';
// import ReactSlider from 'react-slider'
import { Slider, Application } from 'react-rainbow-components';

const BPMSlider = (props) => {
    const [sliderBPM, setSliderBPM] = useState(props.localBPM)

    useEffect(() => {
        if (props.localBPM !== sliderBPM) setSliderBPM(props.localBPM);
        return;
    }, [props.localBPM])

    const onChange = (evt) => {
        setSliderBPM(Number(evt.target.value));
    }
    
    return (
        <div>
            <div className='BPMText'>{`${sliderBPM}`}</div>
            <div className='horizontalSlider' onMouseUp={() => {
                        props.setLocalBPM(sliderBPM)
                    }}>
                <Slider
                    hideLabel={true}
                    onChange={onChange}
                    min={80}
                    max={200}
                    value={sliderBPM}          
                    />
                </div>
           
            {/* <div className='horizontalSlider'>
                <div className='exampleTrack'></div>
                    <ReactSlider
                        className="inner"
                        thumbClassName="exampleThumb"
                        // trackClassName="exampleTrack"
                        renderThumb={(props, state) => <div {...props}></div>}
                        min={80}
                        max={200}
                        value={sliderBPM}
                        // step={1}
                        // onSliderClick={() => console.log('Yo')}
                        onBeforeChange={() => props.resetTapPadTrigger()}
                        onChange={(value) => setSliderBPM(value)}
                        onAfterChange={(value) => {
                            // setSliderBPM(value);
                            console.log('ONAFTERCHANGE')
                            props.setLocalBPM(sliderBPM)
                        }}
                        // withTracks={true}
                    />
            </div> */}
        </div>
    )
}

export default BPMSlider