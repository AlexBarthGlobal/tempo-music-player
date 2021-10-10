import React from 'react'
import BPMSlider from './BPMSlider'
import BPMTap from './BPMTap'

export default class ManageBPMSliderAndTap extends React.Component {
    constructor(props) {
        super()
        this.state = {
            localBPM: props.BPM
        };
    };

    setLocalBPM = (newBPM) => {
        this.setState({localBPM: newBPM})
    };


    render() {

        // console.log('PLAYING OR NOT', this.props.playing)
        // console.log('Metronome sound', this.props.metronomeSound)
        // console.log('handleSubmit', this.props.handleSubmit)
        console.log(this.state.localBPM)
        return (
            <div>
                <div>
                    <BPMSlider localBPM={this.state.localBPM} setLocalBPM={this.setLocalBPM}/>
                </div>
                <div>
                    <BPMTap setLocalBPM={this.setLocalBPM} />
                </div>
                <div>

                </div>
                <button onClick={() => this.props.handleSubmit(this.state.localBPM)}>Play</button>
            </div>
        )
    }
}