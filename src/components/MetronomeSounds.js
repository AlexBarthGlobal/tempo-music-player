import React from 'react'
import {SetIntervalMetronome} from './BaseMetronome';
import { isBrowser, isMobile } from 'react-device-detect';

let interval;
export default class MetronomeSound extends React.Component {
    constructor(props) {
        super()
        this.state = {
            metronomeSound: props.metronomeSound ? true : false,
            playing: props.playing ? true : false,
            localBPM: props.localBPM,
            mobileMetronome: null
        }
        
        this.playMetronome = this.playMetronome.bind(this)
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.metronomeSound !== this.state.metronomeSound) {
            this.setState({metronomeSound: this.props.metronomeSound});
            if (this.state.mobileMetronome) {
                if (this.state.mobileMetronome.playing) this.state.mobileMetronome.stop();
            };
        };
        if (this.props.playing !== this.state.playing) {
            this.setState({playing: this.props.playing});
            if (this.state.mobileMetronome) {
                if (this.props.playing && this.state.mobileMetronome.playing) this.state.mobileMetronome.stop();
                else if (!this.props.playing && !this.state.mobileMetronome.playing) this.state.mobileMetronome.start();
            };
        };
        if (this.props.localBPM !== this.state.localBPM) {
            this.setState({localBPM: this.props.localBPM});
            if (this.state.mobileMetronome) {
                this.state.mobileMetronome.changeTempo(this.props.localBPM);
            }
        };

        clearInterval(interval);
        this.playMetronome();

        console.log('UPDATED metronomesounds')
        return;
    };

    componentDidMount() {
        if (isMobile) {
            if (!this.state.mobileMetronome) this.setState({mobileMetronome: new SetIntervalMetronome(this.props.localBPM)});
        };
        this.playMetronome();
    };

    componentWillUnmount() {
        clearInterval(interval)
        if (this.state.mobileMetronome) this.state.mobileMetronome.stop();
    };

    playMetronome = () => {
        const sounds = [this.topMetronome, this.metronomeBottom, this.metronomeBottom, this.metronomeBottom]
        let i = 0;
        if (!this.props.playing && this.props.metronomeSound && this.props.localBPM !== Infinity && this.props.localBPM !== 0) {
            if (isBrowser) {
                interval = setInterval(() => {
                    if (i > 3) i = 0;
                    sounds[i].play()
                    i++;
                }, Math.round((60/this.props.localBPM)*1000))
            } else if (isMobile) {
                if (this.state.mobileMetronome) {
                    if (!this.state.mobileMetronome.playing) this.state.mobileMetronome.start();
                }
            }
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
            </label>
        )
    };
};