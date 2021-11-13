import React from 'react';
import { connect } from 'react-redux';
import { setPlayingTrueThunk, setPlayingFalseThunk } from '../redux/playerDispatchers';
import { isMobile } from 'react-device-detect';
import FooterControls from './FooterControls'
import FooterControlsMobile from './FooterControlsMobile'
import {incrementSongPlayedThunk, decrementPlayIdxThunk} from '../redux/musicDispatchers'
import PlayerComponent from '../components/PlayerComponent'

class MainPlayer extends React.Component {
    constructor() {
        super()
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

    componentDidMount = async () => {
        this.rap.volume = this.props.volume/100;
        if (this.props.musicInfo.activeSession) this.setState({
            currSrc: this.props.musicInfo.activeSession.songs[this.props.playIdx].songURL,
            duration: this.props.musicInfo.activeSession.songs[this.props.playIdx].duration
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
        if (this.props.volume || this.props.volume === 0) this.rap.volume = this.props.volume/100;
        if (this.rap.readyState !== 4) { // Allows song to be seekable before first playing on mobile devices.
            this.rap.play();
            this.rap.pause();
        };
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

    seekTime = async (newTime) => {
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
        this.rap.pause();
        if (this.props.musicInfo.activeSession.songs[this.props.playIdx-1]) {
           this.props.decrementPlayIdx(this.props.musicInfo.activeSession.id);
        } else {
            this.rap.currentTime = 0;
            this.setState({
                currentTime: 0
            });
        };
        this.props.play();
    };

    render () {
        const audio = <audio src={this.state.currSrc} preload='auto' autoPlay={this.props.playing ? true : false} onEnded={() => {
            this.props.pause();
            this.props.nextTrack();}} loop={this.state.loop} ref={(element) => {this.rap = element}}/>

        const player = this.props.screenStr === 'PlayerScreen' ? 
            <PlayerComponent play={this.props.play} pause={this.props.pause} playing={this.props.playing} prevTrack={this.prevTrack} nextTrack={this.props.nextTrack} currTime={this.rap ? this.state.currentTime : null} duration={this.rap ? this.state.duration : null} seekTime={this.seekTime} toggleLoop={this.toggleLoop} isLooping={this.state.loop} /> : 
                this.props.musicInfo.activeSession ? 
                    isMobile ?
                        <div className='footer'><FooterControlsMobile play={this.props.play} pause={this.props.pause} playing={this.props.playing} nextTrack={this.props.nextTrack} currTime={this.rap ? this.state.currentTime : null} duration={this.rap ? this.state.duration : null} selectCollectionAndChangeScreen={this.props.selectCollectionAndChangeScreen} /></div> : 
                        <div className='footer'><FooterControls play={this.props.play} pause={this.props.pause} playing={this.props.playing} prevTrack={this.prevTrack} nextTrack={this.props.nextTrack} currTime={this.rap ? this.state.currentTime : null} duration={this.rap ? this.state.duration : null} seekTime={this.seekTime} toggleLoop={this.toggleLoop} isLooping={this.state.loop} selectCollectionAndChangeScreen={this.props.selectCollectionAndChangeScreen}/></div> : 
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
        volume: state.playerReducer.volume,
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