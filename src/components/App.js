import React from 'react';
import {connect} from 'react-redux'
import Collections from './Collections'
import Tempo from './Tempo'
import PlayerScreen from './PlayerScreen'
import FooterControls from './FooterControls'
import {logout} from '../redux/isLogged'
import {Redirect} from 'react-router-dom'

const tracks = ["https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/FastLane1.1.mp3","https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Pop-Smoke-Dior-Instrumental-Prod.-By-808Melo.mp3", "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Pop-Smoke-Invincible-Instrumental-Prod.-By-Yoz-Beatz.mp3", "https://frado-music-player-bucket.s3.us-east-2.amazonaws.com/Boomit3.mp3"]

class App extends React.Component {
    constructor() {
        super()
        this.state = {
          screenStr: sessionStorage.getItem('screenStr') || 'Collections',
          screen: sessionStorage.getItem('screen') || <Collections />,
          playing: false,
        //   idx: 0
        }; 
    
        this.nextTrack = this.nextTrack.bind(this);
        this.prevTrack = this.prevTrack.bind(this);
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
    };

    // componentDidMount() {
    //     // if (!this.props.user.id) this.props.history.push('login');
    // }

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
        console.log(this.props)
        if (!this.props.user.id) return <Redirect to='/login' />;

        const logout = async () => {
            // await this.props.logoutUser();
            // this.props.history.push('login')
            location.href = "/auth/logout"
        };

        const homeLogout = this.state.screenStr === 'Collections' ? <button onClick={logout}>Logout</button> : <button onClick={() => this.setState({screen: <Collections />, screenStr: 'Collections'})}>Home</button>
        const createOrAddToCollection = this.state.screenStr === 'Collections' ? <button>Create Collection</button> :
        this.state.screenStr === 'PlayerScreen' ? <button>Add to Collection</button> : null;
        const audio = <audio src={tracks[this.state.idx]} preload="auto" autoPlay={this.state.playing ? true : false} onEnded={this.nextTrack} ref={(element) => {this.rap = element}}/>
        const clearListened = <button>Clear Listened</button>
        const playPause = this.state.playing ? <button onClick={this.pause}>Pause</button> : <button onClick={this.play}>Play</button>
        const footerControls = /*this.props.musicInfo.activeSession.playIdx && */this.state.screenStr !== 'PlayerScreen' ? <div className='footer'><FooterControls playPause={playPause} nextTrack={this.nextTrack} prevTrack={this.prevTrack} /></div> : null;

        return (
            <div>
                {audio}
                <div className='topButtons'>{homeLogout}{createOrAddToCollection}</div>
                <div className='secondButtons'>{clearListened}</div>
                <div>
                    {this.state.screen}
                    {/* <button onClick={() => this.setState({screen: <Tempo />, screenStr: 'Tempo'})}>TempoScr</button>
                    <button onClick={() => this.setState({screen: <PlayerScreen />, screenStr: 'PlayerScreen'})}>PlayerScr</button> */}
                </div>             
                    {footerControls}
            </div>
        );
    };
};


const mapStateToProps = (state) => {
    console.log('Mapping state')
    return {
        user: state.userReducer.user,
        musicInfo: state.musicInfoReducer
    }
}
  
const mapDispatchToProps = (dispatch) => ({
    logoutUser: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)