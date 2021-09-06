import React from 'react';
import {connect} from 'react-redux'
import Collections from './Collections'
import Tempo from './Tempo'
import PlayerScreen from './PlayerScreen'
import FooterControls from './FooterControls'
// import {logout} from '../redux/isLogged'
import {Redirect} from 'react-router-dom'

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
        this.setState({
            idx: this.state.idx+1
        });
    };
    
    prevTrack () {
        this.setState({
            idx: this.state.idx-1
        });
    };

    render() {
        console.log('Props on App.js RENDER', this.props)
        if (!this.props.user.id) return <Redirect to='/login' />;

        const logout = () => {
            location.href = "/auth/logout"
        };

        // if (this.props.musicInfo.activeSession && !this.props.musicInfo.activeSession.songs[playIdx]) // render a modal saying to change bpm,
        // // change collection, or clear listened

        const homeLogout = this.props.screenStr === 'Collections' ? <button onClick={logout}>Logout</button> : <button onClick={() => this.setState({screen: <Collections />, screenStr: 'Collections'})}>Home</button>
        const createOrAddToCollection = this.props.screenStr === 'Collections' ? <button>Create Collection</button> :
        this.props.screenStr === 'PlayerScreen' ? <button>Add to Collection</button> : null;
        let audio;
        if (this.props.musicInfo.activeSession && this.props.musicInfo.activeSession.songsInRange && this.props.musicInfo.activeSession.songsInRange.length) audio = <audio src={this.props.musicInfo.activeSession.songs[this.props.playIdx] ? this.props.musicInfo.activeSession.songs[this.props.playIdx].songURL : null} preload="auto" autoPlay={this.state.playing ? true : false} onEnded={this.nextTrack} ref={(element) => {this.rap = element}}/>
        const clearListened = <button>Clear Listened</button>
        const playPause = this.state.playing ? <button onClick={this.pause}>Pause</button> : <button onClick={this.play}>Play</button>
        const footerControls = this.props.musicInfo.activeSession && this.props.screenStr !== 'PlayerScreen' ? <div className='footer'><FooterControls playPause={playPause} nextTrack={this.nextTrack} prevTrack={this.prevTrack} /></div> : null;
        const selectedScreen = <Collections />
        if (this.props.screenStr === 'Tempo') selectedScreen = <Tempo />
        else if (this.props.screenStr === 'PlayerScreen') selectedScreen = <PlayerScreen />

        return (
            <div>
                {audio}
                <div className='topButtons'>{homeLogout}{createOrAddToCollection}</div>
                <div className='secondButtons'>{clearListened}</div>
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

})

export default connect(mapStateToProps, mapDispatchToProps)(App)