import React from 'react';
import ReactSlider from 'react-slider'

export default class BPMSlider extends React.Component {
    constructor(props) {
        super()
        this.state = {
            localBPM: props.BPM
        };
    };













    render() {
        return (
            <div>
                <div className='BPMText'>{`${this.state.localBPM}`}</div>
                <div>
                <div className='exampleTrack'></div>
                    <ReactSlider
                        className="horizontalSlider"
                        thumbClassName="exampleThumb"
                        // trackClassName="exampleTrack"
                        renderThumb={(props, state) => <div {...props}></div>}
                        min={80}
                        max={200}
                        value={this.props.BPM}
                        // step={1}
                        onChange={(value) => this.setState({localBPM: value})}
                        onAfterChange={(value) => this.props.changeBPM(value)}
                        // withTracks={true}
                    />
                </div>
            </div>
        )
    }
}; 