import React from 'react'
import BPMSlider from './BPMSlider'
import BPMTap from './BPMTap'
import BPMLight from './BPMLight'
import MetronomeSounds from './MetronomeSounds'
import { Slider } from '@mui/material';

export default class ManageBPMSliderAndTap extends React.Component {
    constructor(props) {
        super()
        this.state = {
            localBPM: props.BPM,
            resetTapPadTrigger: false,
            sliderBPM: props.BPM
        };

        this.onChange = this.onChange.bind(this)
        this.onChangeCommitted = this.onChangeCommitted.bind(this)
    };

    setLocalBPM = (newBPM) => {
        this.setState({localBPM: newBPM})
    };

    resetTapPadTrigger = () => {
        this.setState({resetTapPadTrigger: this.state.resetTapPadTrigger ? false : true})
    };

    onChange = (evt) => {
        if (evt.target.value === this.state.localBPM || evt.target.value === this.state.sliderBPM) return;
        // setSliderBPM(Number(evt.target.value))
        // props.setLocalBPM(Number(evt.target.value))
        this.setState({sliderBPM: evt.target.value})
    };

    onChangeCommitted = () => {
        this.setState({localBPM: this.state.sliderBPM})
    }


    render() {

        // console.log('PLAYING OR NOT', this.props.playing)
        // console.log('Metronome sound', this.props.metronomeSound)
        // console.log('handleSubmit', this.props.handleSubmit)
        console.log(this.state.localBPM)
        return (
            <div>
                <div>
                    <MetronomeSounds localBPM={this.state.localBPM} playing={this.props.playing} metronomeSound={this.props.metronomeSound} setMetronomeSoundOption={this.props.setMetronomeSoundOption}/>
                </div>
                {/* <div>
                    <BPMLight localBPM={this.state.localBPM} playing={this.props.playing} metronomeSound={this.props.metronomeSound}/>
                </div> */}
                {/* <div>
                    <BPMSlider localBPM={this.state.localBPM} setLocalBPM={this.setLocalBPM} resetTapPadTrigger={this.resetTapPadTrigger}/>
                </div> */}
                <div className='BPMText'>{`${this.state.sliderBPM}`}</div>
                <div className='horizontalSlider'>
                    <Slider
                        min={80}
                        max={200}
                        value={this.state.sliderBPM}
                        onChange={this.onChange}
                onChangeCommitted={this.onChangeCommitted}
                    />
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