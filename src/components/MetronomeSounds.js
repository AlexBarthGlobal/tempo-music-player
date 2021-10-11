import React from 'react'

export default class MetronomeSound extends React.Component {
    constructor(props) {
        super()
        this.state = {
            metronomeSound: props.metronomeSound ? true : false,
            playing: props.playing ? true : false,
            localBPM: props.localBPM
        }
        
        this.playMetronome = this.playMetronome.bind(this)
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.metronomeSound !== this.state.metronomeSound) this.setState({metronomeSound: this.props.metronomeSound});
        if (this.props.playing !== this.state.playing) this.setState({playing: this.props.playing});
        if (this.props.localBPM !== this.state.localBPM) this.setState({localBPM: this.props.localBPM})
        console.log('UPDATED')
        return;
    };

    playMetronome = () => {
        const sounds = [this.topMetronome, this.metronomeBottom, this.metronomeBottom, this.metronomeBottom]
        let i = 0;
        if (!this.props.playing && this.props.metronomeSound && this.props.localBPM !== Infinity && this.props.localBPM !== 0) {
            setInterval(() => {
                if (i > 3) i = 0;
                sounds[i].play()
                i++;
                console.log(this.props.localBPM)
            }, Math.round((60/this.props.localBPM)*1000))
        }
    };

    render() {
        let topMetronome = <audio src={'https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TopMetronome.mp3'} preload="auto" autoPlay={false} /*onEnded={}*/ ref={(element) => {this.topMetronome = element}}/>
        let metronomeBottom = <audio src={'https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/MetronomeBottom.mp3'} preload="auto" autoPlay={false} /*onEnded={}*/ ref={(element) => {this.metronomeBottom = element}}/>
        return (
            <label>
                {topMetronome}
                {metronomeBottom}
                Metronome Sound:
                <input name='Metronome Sound' type='checkbox' checked={this.state.metronomeSound} onChange={() => this.props.setMetronomeSoundOption(this.props.metronomeSound ? false : true)}/>
                <button onClick={this.playMetronome}>Test metronome</button>
            </label>
        )
    };
};