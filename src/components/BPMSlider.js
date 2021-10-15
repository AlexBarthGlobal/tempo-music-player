import React, {useState, useEffect} from 'react';
import ReactSlider from 'react-slider'

const BPMSlider = (props) => {
    const [sliderBPM, setSliderBPM] = useState(sliderBPM ? sliderBPM : props.localBPM)

    useEffect(() => {
        setSliderBPM(props.localBPM);
        return;
    }, [props.localBPM])
    
    return (
        <div>
            <div className='BPMText'>{`${sliderBPM}`}</div>
            <div className='horizontalSlider'>
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
                            props.setLocalBPM(value)
                        }}
                        // withTracks={true}
                    />
            </div>
        </div>
    )
}

export default BPMSlider