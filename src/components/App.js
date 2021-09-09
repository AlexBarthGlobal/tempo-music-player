import React from 'react';
import {connect} from 'react-redux'
import Collections from './Collections'
import Tempo from './Tempo'
import PlayerScreen from './PlayerScreen'
import FooterControls from './FooterControls'
// import {logout} from '../redux/isLogged'
import {Redirect} from 'react-router-dom'
import {enqueueSongThunk, incrementPlayIdxThunk, decrementPlayIdxThunk, setCurrentSongThunk, clearSessionsThunk} from '../redux/musicDispatchers'
import {changeScreenThunk} from '../redux/screenDispatchers'
import {addToListenedAndSessionThunk, clearListenedThunk} from '../redux/userDispatchers'

let modal;
class App extends React.Component {
    constructor() {
        super()
        this.state = {
        //Local player info
          playing: false,
        }; 
    
        this.nextTrack = this.nextTrack.bind(this);
        this.prevTrack = this.prevTrack.bind(this);
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.checkIfLoaded = this.checkPlayerReady.bind(this);
        this.resetInfo = this.resetInfo.bind(this);
    };

    resetInfo() {
        console.log('RESETTING INFO')
        this.props.clearSessions()
        this.props.clearListened(this.props.user.listened.id)
    }

    checkPlayerReady() {
        return (this.props.musicInfo.activeSession && this.props.musicInfo.activeSession.songsInRange && /*this.props.musicInfo.activeSession.songsInRange &&*/ this.props.musicInfo.activeSession.songs[this.props.playIdx]);
    };

    checkIfListened() {
        if (this.props.musicInfo.activeSession.songs[this.props.playIdx] && !this.props.user.listened.songs[this.props.musicInfo.activeSession.songs[this.props.playIdx].id]) {
            this.props.addToListenedAndSession(this.props.musicInfo.activeSession.songs[this.props.playIdx], this.props.musicInfo.activeSession.id); //pass in the songId and activeSessionId
        };
    }

    componentDidUpdate() {
        if (this.checkPlayerReady()) {
            this.checkIfListened();
        } else {
            // no song currently available
            console.log('YOOOOOOOOOOOOOOO')
            this.rap.src = null;
        }
    };

    play() {
        this.rap.play();
        this.setState({
            playing: true
        })
        // this.props.setCurrentSong(this.props.musicInfo.activeSession.songs[this.props.playIdx])
    };
    
    pause() {
        this.rap.pause();
        this.setState({
            playing: false
        })  
    };

    nextTrack () {
        if (this.props.musicInfo.activeSession.songs[this.props.playIdx]) {
            if (!this.props.musicInfo.activeSession.songs[this.props.playIdx+2]) this.props.enqueueSong();
            this.props.incrementPlayIdx(this.props.musicInfo.activeSession.id);
        };
    };
    
    prevTrack () {
        if (this.props.musicInfo.activeSession.songs[this.props.playIdx-1]) {
            this.props.decrementPlayIdx(this.props.musicInfo.activeSession.id);
        };
    };

    render() {
        console.log('Props on App.js RENDER', this.props)
        console.log('STATE', this.state)
        if (!this.props.user.id) return <Redirect to='/login' />;

        const logout = () => {
            location.href = "/auth/logout"
        };

        // if (this.props.musicInfo.activeSession && !this.props.musicInfo.activeSession.songs[playIdx]) // render a modal saying to change bpm,
        // // change collection, or clear listened

        const homeLogout = this.props.screenStr === 'Collections' ? <button onClick={logout}>Logout</button> : <button onClick={() => this.props.changeScreen('Collections')}>Home</button>
        const createOrAddToCollection = this.props.screenStr === 'Collections' ? <button>Create Collection</button> :
        this.props.screenStr === 'PlayerScreen' || this.props.screenStr === 'Tempo' ? <button>Add Songs</button> : null;
        let audio;
        audio = <audio src={this.checkPlayerReady() ? this.props.musicInfo.activeSession.songs[this.props.playIdx].songURL : null} preload="auto" autoPlay={this.state.playing ? true : false} onEnded={this.nextTrack} ref={(element) => {this.rap = element}}/>
        const clearListened = <button onClick={this.resetInfo}>Clear Listened</button>
        const playPause = this.state.playing ? <button onClick={this.pause}>Pause</button> : <button onClick={this.play}>Play</button>
        const footerControls = /*this.checkPlayerReady() &&*/ this.props.musicInfo.activeSession && this.props.screenStr !== 'PlayerScreen' ? <div className='footer'><FooterControls playPause={playPause} prevTrack={this.prevTrack} nextTrack={this.nextTrack} /></div> : null;
        let changeTempo;
        let selectedScreen = <Collections />
        if (this.props.screenStr === 'Tempo') selectedScreen = <Tempo play={this.play} />
        else if (this.props.screenStr === 'PlayerScreen') {
            selectedScreen = <PlayerScreen />
            changeTempo = <button onClick={() => this.props.changeScreen('Tempo')}>Change Tempo</button>
        }

        return (
            <div>
                {audio}
                <div className='topButtons'>{homeLogout}{clearListened}</div>
                <div className='secondButtons'>{changeTempo}{createOrAddToCollection}</div>
                <div>
                    {selectedScreen}
                </div>             
                    {footerControls}
            </div>
        );
    };
};


const mapStateToProps = (state) => {
    // console.log('State from App.js', state)
    return {
        user: state.userReducer.user,
        musicInfo: state.musicReducer,
        screenStr: state.screenReducer.screenStr,
        selectedCollection: state.screenReducer.selectedCollection,
        playIdx: state.musicReducer.activeSession ? state.musicReducer.activeSession.playIdx : null,
        //currentSong: state.musicReducer.activeSession ? state.musicReducer.currentSong : null
    }
}
  
const mapDispatchToProps = (dispatch) => ({
    enqueueSong: () => dispatch(enqueueSongThunk()),
    incrementPlayIdx: (sessionId) => dispatch(incrementPlayIdxThunk(sessionId)),
    decrementPlayIdx: (sessionId) => dispatch(decrementPlayIdxThunk(sessionId)),
    changeScreen: (screen) => dispatch(changeScreenThunk(screen)),
    addToListenedAndSession: (song, collectionSessionId) => dispatch(addToListenedAndSessionThunk(song, collectionSessionId)),
    // setCurrentSong: (song) => dispatch(setCurrentSongThunk(song)),
    clearListened: (listenedId) => dispatch(clearListenedThunk(listenedId)),
    clearSessions: () => dispatch(clearSessionsThunk())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)