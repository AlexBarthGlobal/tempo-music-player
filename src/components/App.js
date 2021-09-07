import React from 'react';
import {connect} from 'react-redux'
import Collections from './Collections'
import Tempo from './Tempo'
import PlayerScreen from './PlayerScreen'
import FooterControls from './FooterControls'
// import {logout} from '../redux/isLogged'
import {Redirect} from 'react-router-dom'
import {enqueueSongThunk, incrementPlayIdxThunk, decrementPlayIdxThunk} from '../redux/musicDispatchers'
import {changeScreenThunk} from '../redux/screenDispatchers'

const tracks = ["https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/FastLane1.1.mp3","https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Pop-Smoke-Dior-Instrumental-Prod.-By-808Melo.mp3", "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Pop-Smoke-Invincible-Instrumental-Prod.-By-Yoz-Beatz.mp3", "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Boomit3.mp3"]

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
    };  

    checkPlayerReady() {
        return (this.props.musicInfo.activeSession && this.props.musicInfo.activeSession.songsInRange && /*this.props.musicInfo.activeSession.songsInRange &&*/ this.props.musicInfo.activeSession.songs[this.props.playIdx]);
    };

    checkIfListened() {
        if (this.props.musicInfo.activeSession.songs[this.props.playIdx] && !this.props.user.listened.songs[this.props.musicInfo.activeSession.songs[this.props.playIdx].id]) {
            this.props.addToListenedAndSession(); //pass in the songId and activeSessionId
        };
    }

    componentDidUpdate() {
        if (this.checkPlayerReady()) {
            // this.checkIfListened();
        };
    };

    play() {
        this.rap.play();
        this.setState({
            playing: true
        })  
    };
    
    pause() {
        this.rap.pause();
        this.setState({
            playing: false
        })  
    };

    nextTrack () {
        //Line below prevents next/enqueue if current song is null.
        if (/*this.props.musicInfo.activeSession.songs[this.props.playIdx] &&*/ !this.props.musicInfo.activeSession.songs[this.props.playIdx+2]) this.props.enqueueSong();
        if (this.props.musicInfo.activeSession.songs[this.props.playIdx]) this.props.incrementPlayIdx();
        // this.checkIfListened();
    };
    
    prevTrack () {
        this.props.decrementPlayIdx();
    };

    render() {
        console.log('Props on App.js RENDER', this.props)
        if (!this.props.user.id) return <Redirect to='/login' />;

        const logout = () => {
            location.href = "/auth/logout"
        };

        // if (this.props.musicInfo.activeSession && !this.props.musicInfo.activeSession.songs[playIdx]) // render a modal saying to change bpm,
        // // change collection, or clear listened

        const homeLogout = this.props.screenStr === 'Collections' ? <button onClick={logout}>Logout</button> : <button onClick={() => this.props.changeScreen('Collections')}>Home</button>
        const createOrAddToCollection = this.props.screenStr === 'Collections' ? <button>Create Collection</button> :
        this.props.screenStr === 'PlayerScreen' || this.props.screenStr === 'Tempo' ? <button>Add to Collection</button> : null;
        let audio;
        // if (this.props.musicInfo.activeSession && this.props.musicInfo.activeSession.songsInRange && this.props.musicInfo.activeSession.songsInRange.length) audio = <audio src={this.props.musicInfo.activeSession.songs[this.props.playIdx] ? this.props.musicInfo.activeSession.songs[this.props.playIdx].songURL : null} preload="auto" autoPlay={this.state.playing ? true : false} onEnded={this.nextTrack} ref={(element) => {this.rap = element}}/>
        audio = <audio src={this.checkPlayerReady() ? this.props.musicInfo.activeSession.songs[this.props.playIdx].songURL : null} preload="auto" autoPlay={this.state.playing ? true : false} onEnded={this.nextTrack} ref={(element) => {this.rap = element}}/>
        const clearListened = <button>Clear Listened</button>
        const playPause = this.state.playing ? <button onClick={this.pause}>Pause</button> : <button onClick={this.play}>Play</button>
        const footerControls = this.props.musicInfo.activeSession && this.props.screenStr !== 'PlayerScreen' ? <div className='footer'><FooterControls playPause={playPause} prevTrack={this.prevTrack} nextTrack={this.nextTrack} /></div> : null;
        let selectedScreen = <Collections />
        if (this.props.screenStr === 'Tempo') selectedScreen = <Tempo />
        else if (this.props.screenStr === 'PlayerScreen') selectedScreen = <PlayerScreen />

        return (
            <div>
                {audio}
                <div className='topButtons'>{homeLogout}{clearListened}</div>
                <div className='secondButtons'>{createOrAddToCollection}</div>
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
        playIdx: state.musicReducer.activeSession ? state.musicReducer.activeSession.playIdx : null
    }
}
  
const mapDispatchToProps = (dispatch) => ({
    enqueueSong: () => dispatch(enqueueSongThunk()),
    incrementPlayIdx: () => dispatch(incrementPlayIdxThunk()),
    decrementPlayIdx: () => dispatch(decrementPlayIdxThunk()),
    changeScreen: (screen) => dispatch(changeScreenThunk(screen))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)