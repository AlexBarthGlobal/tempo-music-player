import React, {useEffect, useState} from 'react'

export default class MetronomeSound extends React.Component {
    constructor(props) {
        super()
        this.state = {
            metronomeSound: props.metronomeSound ? true : false,
            playing: props.playing ? true : false
        }
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.metronomeSound !== this.state.metronomeSound) this.setState({metronomeSound: this.props.metronomeSound});
        if (this.props.playing !== this.state.playing) this.setState({playing: this.props.playing});
        return;
    };

    //props.playing
    playMetronome = () => {
        if (!this.props.playing) {

        }
    }

    render() {
        let topMetronome = <audio src={'https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/TopMetronome.mp3'} preload="auto" autoPlay={false} /*onEnded={}*/ ref={(element) => {this.topMetronome = element}}/>
        let metronomeBottom = <audio src={'https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/MetronomeBottom.mp3'} preload="auto" autoPlay={false} /*onEnded={}*/ ref={(element) => {this.metronomeBottom = element}}/>
        return (
            <label>
                {topMetronome}
                {metronomeBottom}
                Metronome Sound:
                <input name='Metronome Sound' type='checkbox' checked={this.state.metronomeSound} onChange={() => this.props.setMetronomeSoundOption(this.props.metronomeSound ? false : true)}/>
            </label>
        )
    };
};