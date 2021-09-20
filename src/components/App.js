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
import {enqueueSongThunk, incrementPlayIdxThunk, decrementPlayIdxThunk, setCurrentSongThunk, clearSessionsThunk, createCollectionThunk, clearActiveSessionThunk, popOneFromActiveSessionSongsThunk, updateSessionBpmThunk, applySongsInRange} from '../redux/musicDispatchers'
import {changeScreenThunk, selectCollectionAndChangeScreenThunk} from '../redux/screenDispatchers'
import {addToListenedAndSessionThunk, clearListenedThunk} from '../redux/userDispatchers'
import songsInRange from '../components/songsInRange'
import axios from 'axios';

let tempActiveCollectionSession = null;
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
          collectionArtURL: '',
          noNextSong: false,
          shareCollectionModal: false,
          recipientEmail: '',
          shareConfirmation: ''
        }; 
    
        this.nextTrack = this.nextTrack.bind(this);
        this.prevTrack = this.prevTrack.bind(this);
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.checkIfLoaded = this.checkPlayerReady.bind(this);
        this.resetInfo = this.resetInfo.bind(this);
        this.changeTempoFromModal = this.changeTempoFromModal.bind(this);
        this.addSongsFromModal = this.addSongsFromModal.bind(this);

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleShare = this.handleShare.bind(this)
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
    };

    handleShare = async (evt) => {
        evt.preventDefault();
        if (this.state.recipientEmail === this.props.user.email) {
            this.setState({shareConfirmation: `You can't share this with yourself!`});
        } else {
            try {
                await axios.post('/api/shareCollection', {collectionId: this.props.selectedCollection, recipientEmail: this.state.recipientEmail})
                this.setState({shareConfirmation: 'Shared successfully.'})
            } catch (err) {
                this.setState({shareConfirmation: `Recipient doesn't exist!`})
            };
        };
        
        this.setState({recipientEmail: ''});
    };

    resetInfo() {
        console.log('RESETTING INFO')
        this.props.clearSessions()
        this.props.clearListened(this.props.user.listened.id)
        if (this.state.noNextSong) this.setState({noNextSong: false})
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
        // console.log('PREV STATE', prevState)
        // console.log('CURR STATE', this.state)
        // console.log('!!!!!!', tempActiveCollectionSession)
        if (prevState.collectionName !== this.state.collectionName || prevState.collectionArtURL !== this.state.collectionArtURL) return;
        if (prevState.recipientEmail !== this.state.recipientEmail) return;

        if (this.checkPlayerReady()) {
            this.checkIfListened();
        } else {
            // if (!this.state.playing && this.props.musicInfo.activeSession && this.props.musicInfo.activeSession.songs && !this.props.musicInfo.activeSession.songs[this.props.playIdx]) {
            this.rap.src = null;
            // }
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

    nextTrack = async () => {
        if (this.props.musicInfo.activeSession.songs[this.props.playIdx]) {
            if (!this.props.musicInfo.activeSession.songs[this.props.playIdx+2] /*|| !this.props.musicInfo.activeSession.songs[this.props.playIdx+1]*/) this.props.enqueueSong();
            if (!this.props.musicInfo.activeSession.songs[this.props.playIdx+1]) {
                const results = songsInRange(this.props.user.listened.songs, this.props.musicInfo.collections[this.props.musicInfo.activeSession.collectionId].songs, this.props.musicInfo.activeSession.currBPM, 'up')
                if (results[0].length) {
                    this.props.popOneFromActiveSessionSongs();
                    await this.props.updateSessionBpm(this.props.musicInfo.activeSession.collectionId, results[1])
                    this.props.applySongsInRange(results[0]);
                } else {
                    // if playback is at 0, pause. It means the song has ended on its own and I can set the Pause button back to where it says Play.
                    tempActiveCollectionSession = this.props.musicInfo.activeSession.collectionId //This keeps track of the collectionId after we clear the activeSession.
                    this.setState({noNextSong: true});
                };
            };
            if (this.props.musicInfo.activeSession.songs[this.props.playIdx+1]) {
                await this.props.incrementPlayIdx(this.props.musicInfo.activeSession.id);
                this.play();
            };
        };

        // if (!this.props.musicInfo.activeSession.songs[this.props.playIdx]) {
        //     // this.pause();
        //     // First check for music at slightly higher bpm
            
            
        //     } else {
        //     // Then still if no more songs, in DB and Redux:
        // tempActiveCollectionSession = this.props.musicInfo.activeSession.collectionId //This keeps track of the collectionId after we clear the activeSession.
        //         // await this.props.clearActiveSession(this.props.musicInfo.activeSession.id)
                
        //     };
        // }
    };
    
    prevTrack = async () => {
        if (this.props.musicInfo.activeSession.songs[this.props.playIdx-1]) {
           await this.props.decrementPlayIdx(this.props.musicInfo.activeSession.id);
        };
    };

    changeTempoFromModal() {
        this.setState({noNextSong: false})
        this.props.dispatchSelectCollectionAndChangeScreen(tempActiveCollectionSession, 'Tempo')
        tempActiveCollectionSession = null;
    };

    addSongsFromModal() {
        this.setState({noNextSong: false})
        this.props.dispatchSelectCollectionAndChangeScreen(tempActiveCollectionSession, 'BrowseSongs')
        tempActiveCollectionSession = null;
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
        const createOrAddToCollection = this.props.screenStr === 'Collections' ? <button onClick={() => this.setState({addCollectionModal: true})}>Create Collection</button> : this.props.musicInfo.collections[this.props.selectedCollection].collectionOwner === this.props.user.id && 
        /*this.props.screenStr === 'PlayerScreen' ||*/ (this.props.screenStr === 'Tempo' || this.props.screenStr === 'CollectionSongs') ? <button onClick={() => this.props.changeScreen('BrowseSongs')}>Add Songs</button> : null;
        let audio;
        audio = <audio src={this.checkPlayerReady() ? this.props.musicInfo.activeSession.songs[this.props.playIdx].songURL : null} preload="auto" autoPlay={this.state.playing ? true : false} onEnded={this.nextTrack} ref={(element) => {this.rap = element}}/>
        const clearListened = this.props.screenStr !== 'BrowseSongs' ? <button onClick={this.resetInfo}>Clear Listened</button> : null;
        const playPause = this.state.playing ? <button onClick={this.pause}>Pause</button> : <button onClick={this.play}>Play</button>
        const navToCollectionSongs = this.props.screenStr === 'PlayerScreen' || this.props.screenStr ==='Tempo' ? <button onClick={() => this.props.changeScreen('CollectionSongs')}>View Songs</button> : null
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
        let shareCollection;
        if (this.props.screenStr === 'CollectionSongs') shareCollection = <button onClick={() => this.setState({shareCollectionModal: true})}>Share Collection</button>

        return (
            <div>
                <Modal 
                    isOpen={this.state.addCollectionModal} 
                    onRequestClose={() => this.setState({addCollectionModal: false, collectionName: '', collectionArtURL: ''})}
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
                                // maxHeight: '116px',
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
                <Modal 
                    isOpen={this.state.noNextSong} 
                    onRequestClose={() => this.setState({noNextSong: false})}
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
                                height: '140px',
                                // maxHeight: '126px',
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
                        <div>No more music in this BPM range!</div>
                        <div>
                            Choose a different collection, or:
                        </div>
                        <div>
                            <button onClick={this.changeTempoFromModal}>Change BPM</button>
                        </div>
                        <div>
                            {this.props.musicInfo.activeSession && this.props.musicInfo.collections[this.props.musicInfo.activeSession.collectionId].collectionOwner === this.props.user.id ? <button onClick={this.addSongsFromModal}>Add songs to collection</button> : null}
                        </div>
                        <div>
                            <button onClick={this.resetInfo}>Clear Listened</button>
                        </div>
                        <div>
                            <button onClick={() => this.setState({noNextSong: false})}>Close</button>
                        </div>
                    </div>
                </Modal>
                <Modal 
                    isOpen={this.state.shareCollectionModal} 
                    onRequestClose={() => this.setState({shareCollectionModal: false, recipientEmail: ''})}
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
                                // maxHeight: '116px',
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
                        <div>Enter the recipient's E-mail:</div>
                        <div>
                            <form onSubmit={this.handleShare}>
                                <div>
                                    <input name='recipientEmail' onChange={this.handleChange} value={this.state.recipientEmail} />
                                </div>
                                <div>
                                    {this.state.shareConfirmation}
                                </div>
                                <div>
                                    <button type='submit'>Share</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
                {audio}
                <div className='topButtons'>{homeLogout}{clearListened}</div>
                <div className='secondButtons'>{navToCollectionSongs}{changeTempo}{shareCollection}{createOrAddToCollection}</div>
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
    createCollection: (collectionName, collectionArtURL) => dispatch(createCollectionThunk(collectionName, collectionArtURL)),
    dispatchSelectCollectionAndChangeScreen: (collectionId, screen) => dispatch(selectCollectionAndChangeScreenThunk(collectionId, screen)),
    clearActiveSession: (collectionSessionId) => dispatch(clearActiveSessionThunk(collectionSessionId)),
    popOneFromActiveSessionSongs: () => dispatch(popOneFromActiveSessionSongsThunk()),
    updateSessionBpm: (selectedCollectionId, newBPM) => dispatch(updateSessionBpmThunk(selectedCollectionId, newBPM)),
    applySongsInRange: (songs) => dispatch(applySongsInRange(songs)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)