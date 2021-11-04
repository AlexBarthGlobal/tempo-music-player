import React from 'react';
import { connect } from 'react-redux';
import { setPlayingTrueThunk, setPlayingFalseThunk } from '../redux/playerReducer';
import { isBrowser, isMobile } from 'react-device-detect';
import FooterControls from './FooterControls'
import FooterControlsMobile from './FooterControlsMobile'
import {incrementSongPlayedThunk, decrementPlayIdxThunk} from '../redux/musicDispatchers'
import PlayerComponent from '../components/PlayerComponent'

class MainPlayer extends React.Component {
    constructor() {
        super()
        console.log(sessionStorage.getItem('loop'))
        this.state = {
            currentTime: 0,
            duration: 0,
            currSrc: null,
            loop: JSON.parse(sessionStorage.getItem('loop'))
        };

        this.seekTime = this.seekTime.bind(this)
        this.toggleLoop = this.toggleLoop.bind(this)
        this.prevTrack = this.prevTrack.bind(this)
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
            } else if (this.state.currentTime > e.target.currentTime && this.rap.loop) {
                this.setState({
                    currentTime: e.target.currentTime
                })
                this.props.incrementSongPlayed(this.props.musicInfo.activeSession.songs[this.props.musicInfo.activeSession.playIdx].id);
            }
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
            if (!this.props.noNextSong && this.rap.currentTime === 0 && !this.rap.loop) {
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

    toggleLoop = () => {
        if (!this.state.loop) {
            sessionStorage.setItem('loop', true)
            this.setState({loop: true});
        } else {
            sessionStorage.removeItem('loop')
            this.setState({loop: false});
        };
    };

    prevTrack = async () => {
        if (this.props.musicInfo.activeSession.songs[this.props.playIdx-1]) {
           await this.props.decrementPlayIdx(this.props.musicInfo.activeSession.id);
        };
        this.props.play();
    };

    render () {
        console.log('REFRESHED MAINPLAYER')
        const audio = <audio src={this.state.currSrc} preload='auto' autoPlay={this.props.playing ? true : false} onEnded={this.props.nextTrack} loop={this.state.loop} ref={(element) => {this.rap = element}}/>

        const player = this.props.screenStr === 'PlayerScreen' ? 
            <PlayerComponent play={this.props.play} pause={this.props.pause} playing={this.props.playing} prevTrack={this.prevTrack} nextTrack={this.props.nextTrack} currTime={this.rap ? this.state.currentTime : null} duration={this.rap ? this.state.duration : null} seekTime={this.seekTime} toggleLoop={this.toggleLoop} isLooping={this.state.loop} /> : 
                this.props.musicInfo.activeSession ? 
                    isMobile ?
                        <div className='footer'><FooterControlsMobile play={this.props.play} pause={this.props.pause} playing={this.props.playing} nextTrack={this.props.nextTrack} currTime={this.rap ? this.state.currentTime : null} duration={this.rap ? this.state.duration : null} /></div> : 
                        <div className='footer'><FooterControls play={this.props.play} pause={this.props.pause} playing={this.props.playing} prevTrack={this.prevTrack} nextTrack={this.props.nextTrack} currTime={this.rap ? this.state.currentTime : null} duration={this.rap ? this.state.duration : null} seekTime={this.seekTime} toggleLoop={this.toggleLoop} isLooping={this.state.loop} /></div> : 
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
    incrementSongPlayed: (songId) => dispatch(incrementSongPlayedThunk(songId)),
    decrementPlayIdx: (sessionId) => dispatch(decrementPlayIdxThunk(sessionId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPlayer)