import React from 'react';
import {connect} from 'react-redux'
import Modal from 'react-modal'
import Collections from './Collections'
import Tempo from './Tempo'
import PlayerScreen from './PlayerScreen'
import FooterControls from './FooterControls'
// import AddSongs from './AddSongs'
import BrowseSongs from './BrowseSongs'
import CollectionSongs from './CollectionSongs'
// import {logout} from '../redux/isLogged'
import {Redirect} from 'react-router-dom'
import {enqueueSongThunk, incrementPlayIdxThunk, decrementPlayIdxThunk, setCurrentSongThunk, clearSessionsThunk, createCollectionThunk} from '../redux/musicDispatchers'
import {changeScreenThunk} from '../redux/screenDispatchers'
import {addToListenedAndSessionThunk, clearListenedThunk} from '../redux/userDispatchers'

Modal.setAppElement('#root')
class App extends React.Component {
    constructor() {
        super()
        this.state = {
        //Local player info
          playing: false,
          addCollectionModal: false,
          addSongModal: false,
          collectionName: '',
          collectionArtURL: ''
        }; 
    
        this.nextTrack = this.nextTrack.bind(this);
        this.prevTrack = this.prevTrack.bind(this);
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.checkIfLoaded = this.checkPlayerReady.bind(this);
        this.resetInfo = this.resetInfo.bind(this);

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    };

    handleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        });
    };

    handleSubmit = async (evt) => {
        evt.preventDefault();
        if (!this.state.collectionName.length) return;
        this.setState({addCollectionModal: false})
        await this.props.createCollection(this.state.collectionName, this.state.collectionArtURL)
        this.setState({collectionName: ''})
        this.setState({collectionArtURL: ''})
    }

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

    componentDidUpdate(prevProps, prevState) {
        if (prevState.collectionName !== this.state.collectionName || prevState.collectionArtURL !== this.state.collectionArtURL) return;
        if (this.checkPlayerReady()) {
            this.checkIfListened();
        } else {
            // no song currently available
            console.log('No song available')
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
        const createOrAddToCollection = this.props.screenStr === 'Collections' ? <button onClick={() => this.setState({addCollectionModal: true})}>Create Collection</button> :
        /*this.props.screenStr === 'PlayerScreen' ||*/ this.props.screenStr === 'Tempo' || this.props.screenStr === 'CollectionSongs' ? <button>Add Songs</button> : null;
        let audio;
        audio = <audio src={this.checkPlayerReady() ? this.props.musicInfo.activeSession.songs[this.props.playIdx].songURL : null} preload="auto" autoPlay={this.state.playing ? true : false} onEnded={this.nextTrack} ref={(element) => {this.rap = element}}/>
        const clearListened = this.props.screenStr !== 'BrowseSongs' ? <button onClick={this.resetInfo}>Clear Listened</button> : null;
        const playPause = this.state.playing ? <button onClick={this.pause}>Pause</button> : <button onClick={this.play}>Play</button>
        const navToCollectionSongs = this.props.screenStr === 'PlayerScreen' ? <button onClick={() => this.props.changeScreen('CollectionSongs')}>Songs</button> : null
        const footerControls = /*this.checkPlayerReady() &&*/ this.props.musicInfo.activeSession && this.props.screenStr !== 'PlayerScreen' ? <div className='footer'><FooterControls playPause={playPause} prevTrack={this.prevTrack} nextTrack={this.nextTrack} /></div> : null;
        //if (!this.checkPlayerReady()) check higher tempo range for more music, and if still no music there then render a modal.
        let changeTempo;
        let selectedScreen = <Collections />
        if (this.props.screenStr === 'Tempo') selectedScreen = <Tempo play={this.play} next={this.nextTrack} player={this.rap} />
        else if (this.props.screenStr === 'PlayerScreen') {
            selectedScreen = <PlayerScreen />
            changeTempo = <button onClick={() => this.props.changeScreen('Tempo')}>Change Tempo</button>
        } else if (this.props.screenStr === 'BrowseSongs') selectedScreen = <BrowseSongs />    
        else if (this.props.screenStr === 'CollectionSongs') selectedScreen = <CollectionSongs />

        return (
            <div>
                <Modal 
                    isOpen={this.state.addCollectionModal} 
                    onRequestClose={() => this.setState({addCollectionModal: false})}
                    style={
                        {
                            content: {
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                // minHeight: '116px',
                                // maxHeight: '14vh',
                                height: '116px',
                                maxHeight: '116px',
                                position: 'absolute',
                                width: '50vw',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                top: '28%',
                            }
                        }
                    }
                >
                    <div>
                        <div>Name your collection:</div>
                        <div>
                            <form onSubmit={this.handleSubmit}>
                                <div>
                                    <input name='collectionName' onChange={this.handleChange} value={this.state.collectionName} />
                                </div>
                                <div>
                                    Art URL:
                                </div>
                                <div>
                                    <input name='collectionArtURL' onChange={this.handleChange} placeholder={'Optional'} value={this.state.collectionArtURL} />
                                </div>
                                <div>
                                    <button type='submit'>Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
                {audio}
                <div className='topButtons'>{homeLogout}{clearListened}</div>
                <div className='secondButtons'>{navToCollectionSongs}{changeTempo}{createOrAddToCollection}</div>
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
    clearSessions: () => dispatch(clearSessionsThunk()),
    createCollection: (collectionName, collectionArtURL) => dispatch(createCollectionThunk(collectionName, collectionArtURL))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)