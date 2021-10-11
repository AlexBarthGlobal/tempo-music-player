import React from 'react';
import ReactSlider from 'react-slider'

export default class BPMSlider extends React.Component {
    constructor(props) {
        super()
        this.state = {
            sliderBPM: props.localBPM
        };
    };

    render() {
        return (
            <div>
                <div className='BPMText'>{`${this.state.sliderBPM}`}</div>
                <div className='horizontalSlider'>
                    <div className='exampleTrack'></div>
                        <ReactSlider
                            className="inner"
                            thumbClassName="exampleThumb"
                            // trackClassName="exampleTrack"
                            renderThumb={(props, state) => <div {...props}></div>}
                            min={80}
                            max={200}
                            value={this.props.localBPM}
                            // step={1}
                            onChange={(value) => this.setState({sliderBPM: value})}
                            onAfterChange={(value) => this.props.setLocalBPM(value)}
                            // withTracks={true}
                        />
                </div>
            </div>
        )
    }
}; 