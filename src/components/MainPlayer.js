import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { setPlayingTrueThunk, setPlayingFalseThunk } from '../redux/playerReducer';
import { isBrowser, isMobile } from 'react-device-detect';
import FooterControls from './FooterControls'
import FooterControlsMobile from './FooterControlsMobile'
import secondsToTimestamp from './secondsToTimestamp'
import {addToListenedAndSessionThunk} from '../redux/userDispatchers'
import {enqueueSongThunk, popOneFromActiveSessionSongsThunk/*incrementPlayIdxThunk, decrementPlayIdxThunk, setCurrentSongThunk, clearSessionsThunk, createCollectionThunk, clearActiveSessionThunk, updateSessionBpmThunk, applySongsInRange*/} from '../redux/musicDispatchers'
import songsInRange from '../components/songsInRange'
import { duration } from '@mui/material';

{/* <audio src={this.checkPlayerReady() ? this.props.musicInfo.activeSession.songs[this.props.playIdx].songURL : null} preload="auto" autoPlay={this.props.playing ? true : false} onEnded={this.nextTrack} ref={(element) => {this.rap = element}}/> */}

class MainPlayer extends React.Component {
    constructor() {
        super()
        this.state = {
            currentTime: 0,
            duration: 0,
            currSrc: null
        };

        this.seekTime = this.seekTime.bind(this)
    };

    componentDidMount = () => {
        if (this.props.musicInfo.activeSession) this.setState({
            currSrc: this.props.musicInfo.activeSession.songs[this.props.playIdx].songURL,
            duration: this.props.musicInfo.activeSession.songs[this.props.playIdx].duration //e.target.duration
        });
        this.rap.addEventListener('timeupdate', e => {
            if (Math.floor(e.target.currentTime) - Math.floor(this.state.currentTime) >= 1) {
                this.setState({
                    currentTime: e.target.currentTime,
                });
            } else return;
        });
    };

    componentWillUnmount() {
        this.rap.removeEventListener('timeupdate', () => {});
    };

    componentDidUpdate = (prevProps) => {
        if (this.props.noNextSong) {
            if (this.state.currentTime >= this.state.duration) {
                this.props.pause();
                this.setState({
                    currentTime: 0
                });
            };
        };
        if (!this.props.playing) {
            this.rap.pause();
        } else this.rap.play();
        if (prevProps.playIdx !== this.props.playIdx) {
            this.setState({
                currentTime: 0,
                duration: this.props.musicInfo.activeSession.songs[this.props.playIdx].duration,
                currSrc: this.props.musicInfo.activeSession.songs[this.props.playIdx].songURL
            });
        };
    };

    seekTime = (newTime) => {
        this.rap.currentTime = newTime;
        this.setState({
            currentTime: newTime
        })
    };

    render () {
        console.log('REFRESHED MAINPLAYER')
        const audio = <audio src={this.state.currSrc} preload='auto' autoPlay={this.props.playing ? true : false} onEnded={this.props.nextTrack} ref={(element) => {this.rap = element}}/>
        const playPause = this.props.playing ? <button onClick={this.props.pause}>Pa</button> : <button onClick={this.props.play}>Pl</button>

        const player = this.props.screenStr === 'PlayerScreen' ? 
            <div>Main Player here</div> : 
                this.props.musicInfo.activeSession ? 
                    isMobile ?
                        <div className='footer'><FooterControlsMobile playPause={playPause} nextTrack={this.props.nextTrack} currTime={this.rap ? this.state.currentTime : null} duration={this.rap ? this.state.duration : null} /></div> : 
                        <div className='footer'><FooterControls playPause={playPause} prevTrack={this.props.prevTrack} nextTrack={this.props.nextTrack} currTime={this.rap ? this.state.currentTime : null} duration={this.rap ? this.state.duration : null} seekTime={this.seekTime} /></div> : 
                null;

        return (
            <div>
                {audio}
                {player}
            </div>
        )
    };
}

const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user,
        playing: state.playerReducer.playing,
        musicInfo: state.musicReducer,
        screenStr: state.screenReducer.screenStr,
        playIdx: state.musicReducer.activeSession ? state.musicReducer.activeSession.playIdx : null
    };
};

const mapDispatchToProps = dispatch => ({
    play: () => dispatch(setPlayingTrueThunk()),
    pause: () => dispatch(setPlayingFalseThunk())
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPlayer)