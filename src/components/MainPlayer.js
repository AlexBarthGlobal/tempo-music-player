import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { setPlayingTrueThunk, setPlayingFalseThunk } from '../redux/playerReducer';
import { isBrowser, isMobile } from 'react-device-detect';
import FooterControls from './FooterControls'
import FooterControlsMobile from './FooterControlsMobile'
import secondsToTimestamp from './secondsToTimestamp'
import {addToListenedAndSessionThunk} from '../redux/userDispatchers'
import {enqueueSongThunk, popOneFromActiveSessionSongsThunk, incrementSongPlayedThunk} from '../redux/musicDispatchers'
import songsInRange from '../components/songsInRange'
import { duration } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import PlayerComponent from '../components/PlayerComponent'
import FooterSlider from '../components/FooterSlider'

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
        if (this.props.noNextSong && this.state.currentTime >= this.state.duration) {
            this.props.pause();
            this.setState({
                currentTime: 0
            });
        };
        if (!this.props.playing) {
            this.rap.pause();
        } else {
            this.rap.play();
            if (!this.props.noNextSong && this.rap.currentTime === 0) {
                //Increment played in DB for the song
                this.props.incrementSongPlayed(this.props.musicInfo.activeSession.songs[this.props.musicInfo.activeSession.playIdx].id)
            };
        };
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
        const playPause = this.props.playing ? <PauseIcon className='footerCenterItem playPausePadding' sx={{fontSize: 36}} onClick={this.props.pause} /> : <PlayArrow className='footerCenterItem playPausePadding' sx={{fontSize: 36}} onClick={this.props.play} />

        const player = this.props.screenStr === 'PlayerScreen' ? 
            <PlayerComponent /> : 
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
    pause: () => dispatch(setPlayingFalseThunk()),
    incrementSongPlayed: (songId) => dispatch(incrementSongPlayedThunk(songId))
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPlayer)