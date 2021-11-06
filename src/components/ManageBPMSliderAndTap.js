import React from 'react'
import BPMSlider from './BPMSlider'
import BPMTap from './BPMTap'
import BPMLight from './BPMLight'
import MetronomeSounds from './MetronomeSounds'
import { Slider } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';

export default class ManageBPMSliderAndTap extends React.Component {
    constructor(props) {
        super()
        this.state = {
            localBPM: props.BPM,
            resetTapPadTrigger: false,
        };
    };

    setLocalBPM = (newBPM) => {
        this.setState({localBPM: newBPM})
    };

    resetTapPadTrigger = () => {
        this.setState({resetTapPadTrigger: this.state.resetTapPadTrigger ? false : true})
    };

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
                <div className='BPMLightContainer'>
                    <BPMLight localBPM={this.state.localBPM} playing={this.props.playing} metronomeSound={this.props.metronomeSound}/>
                </div>
                <div>
                    <BPMSlider localBPM={this.state.localBPM} setLocalBPM={this.setLocalBPM} resetTapPadTrigger={this.resetTapPadTrigger}/>
                </div>
                <div>
                    <BPMTap setLocalBPM={this.setLocalBPM} resetTapPadTrigger={this.state.resetTapPadTrigger} />
                </div>
                <div>

                </div>
                <PlayArrow sx={{fontSize: 74}} onClick={() => this.props.handleSubmit(this.state.localBPM)} />
            </div>
        )
    }
}