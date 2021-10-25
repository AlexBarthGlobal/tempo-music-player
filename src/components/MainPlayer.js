import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { setPlayingTrueThunk, setPlayingFalseThunk } from '../redux/playerReducer';
import { isBrowser, isMobile } from 'react-device-detect';
import FooterControls from './FooterControls'
import FooterControlsMobile from './FooterControlsMobile'
import secondsToTimestamp from './secondsToTimestamp'

{/* <audio src={this.checkPlayerReady() ? this.props.musicInfo.activeSession.songs[this.props.playIdx].songURL : null} preload="auto" autoPlay={this.props.playing ? true : false} onEnded={this.nextTrack} ref={(element) => {this.rap = element}}/> */}

class MainPlayer extends React.Component {
    constructor() {
        super()
        this.state = {
            currentTime: 0,
            duration: 0
        };

        this.seekTime = this.seekTime.bind(this)
    };

    componentDidMount = () => {
        this.rap.addEventListener('timeupdate', e => {
            if (Math.floor(e.target.currentTime) - Math.floor(this.state.currentTime) >= 1) {
                this.setState({
                    currentTime: e.target.currentTime,
                    duration: e.target.duration
                });
            } else return;
        })
    };

    componentWillUnmount() {
        this.rap.removeEventListener('timeupdate', () => {});
    };

    componentDidUpdate = () => {
        if (!this.props.playing) {
            this.rap.pause();
        } else this.rap.play();
    };

    seekTime = (newTime) => {
        console.log(newTime, 'NEW TIME!!!!!!!!!!!!!')
        this.rap.currentTime = newTime;
        this.setState({
            currentTime: newTime
        })
    };

    render () {
        console.log('REFRESHED MAINPLAYER')
        const audio = <audio src={"https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Money+Man+%E2%80%9CAura%E2%80%9D+(6+Hours+2).mp3"} preload='auto' autoPlay={this.props.playing ? true : false} /*onEnded={}*/ ref={(element) => {this.rap = element}}/>
        const playPause = this.props.playing ? <button onClick={this.props.pause}>Pa</button> : <button onClick={this.props.play}>Pl</button>


        const footerControls = /*this.checkPlayerReady() &&*/ this.props.musicInfo.activeSession && this.props.screenStr !== 'PlayerScreen' ? isMobile ? <div className='footer'><FooterControlsMobile playPause={playPause} prevTrackButton={prevTrackButton} nextTrackButton={nextTrackButton} currTime={this.rap ? this.rap.currentTime : null} endTime={this.rap ? this.rap.duration : null} seekTime={() => this.seekTime} /></div> : <div className='footer'><FooterControls playPause={playPause} prevTrackButton={() => console.log('Prev')} nextTrackButton={() => console.log('Next')} currTime={this.rap ? this.state.currentTime : null} duration={this.rap ? this.state.duration : null} seekTime={this.seekTime} /></div> : null;
        return (
            <div>
                {audio}
                {/* <button onClick={this.props.play}>Play</button>
                <button onClick={this.props.pause}>Pause</button> */}
                {footerControls}
            </div>
        )
    };
}

const mapStateToProps = (state) => {
    return {
        playing: state.playerReducer.playing,
        musicInfo: state.musicReducer,
        screenStr: state.screenReducer.screenStr,
    };
};

const mapDispatchToProps = dispatch => ({
    play: () => dispatch(setPlayingTrueThunk()),
    pause: () => dispatch(setPlayingFalseThunk())
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPlayer)