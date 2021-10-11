import React from 'react'
import BPMSlider from './BPMSlider'
import BPMTap from './BPMTap'
// import BPMLight from './BPMLight'
// import MetronomeSound from './MetronomeSound'

export default class ManageBPMSliderAndTap extends React.Component {
    constructor(props) {
        super()
        this.state = {
            localBPM: props.BPM,
            resetTapPadTrigger: false
        };
    };

    setLocalBPM = (newBPM) => {
        this.setState({localBPM: newBPM})
    };

    resetTapPadTrigger = () => {
        // if (!this.state.resetTapPadTrigger) this.setState({resetTapPadTrigger: true})
        console.log('TRIGGERED!!!!!!!!!!')

        this.setState({resetTapPadTrigger: this.state.resetTapPadTrigger ? false : true})
    };


    render() {

        // console.log('PLAYING OR NOT', this.props.playing)
        // console.log('Metronome sound', this.props.metronomeSound)
        // console.log('handleSubmit', this.props.handleSubmit)
        console.log(this.state.localBPM)
        return (
            <div>
                {/* <div>
                    <BPMLight localBPM={this.state.localBPM} />
                </div> */}
                <div>
                    <BPMSlider localBPM={this.state.localBPM} setLocalBPM={this.setLocalBPM} resetTapPadTrigger={this.resetTapPadTrigger}/>
                </div>
                <div>
                    <BPMTap setLocalBPM={this.setLocalBPM} resetTapPadTrigger={this.state.resetTapPadTrigger} />
                </div>
                <div>

                </div>
                <button onClick={() => this.props.handleSubmit(this.state.localBPM)}>Play</button>
            </div>
        )
    }
}