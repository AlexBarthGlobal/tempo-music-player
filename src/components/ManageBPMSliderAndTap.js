import React from 'react'
import BPMSlider from './BPMSlider'
import BPMTap from './BPMTap'
import BPMLight from './BPMLight'
import MetronomeSounds from './MetronomeSounds'
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
                    <PlayArrow sx={{fontSize: 70}} className='tempoPlayArrow' onClick={() => this.props.handleSubmit(this.state.localBPM)} />
                </div>  
            </div>
        )
    }
}