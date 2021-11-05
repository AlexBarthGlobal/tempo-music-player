import React from 'react';
import {connect} from 'react-redux'
import Modal from 'react-modal'
import Collections from './Collections'
import Tempo from './Tempo'
import PlayerScreen from './PlayerScreen'
// import AddSongs from './AddSongs'
import BrowseSongs from './BrowseSongs'
import CollectionSongs from './CollectionSongs'
// import {logout} from '../redux/isLogged'
import {Redirect} from 'react-router-dom'
import {enqueueSongThunk, incrementPlayIdxThunk, decrementPlayIdxThunk, setCurrentSongThunk, clearSessionsThunk, createCollectionThunk, clearActiveSessionThunk, popOneFromActiveSessionSongsThunk, updateSessionBpmThunk, applySongsInRange} from '../redux/musicDispatchers'
import {changeScreenThunk, selectCollectionAndChangeScreenThunk} from '../redux/screenDispatchers'
import {addToListenedAndSessionThunk, clearListenedThunk, setMetronomeSoundOptionThunk} from '../redux/userDispatchers'
import songsInRange from '../components/songsInRange'
import axios from 'axios';
import { isBrowser, isMobile } from 'react-device-detect';
import MainPlayer from './MainPlayer'
import {setPlayingTrueThunk, setPlayingFalseThunk} from '../redux/playerReducer'
import { slide as Menu } from 'react-burger-menu'
// import HomeButton from '../icons/home.svg'
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddIcon from '@mui/icons-material/Add';
import LibraryMusicSharpIcon from '@mui/icons-material/LibraryMusicSharp';
import Metronome from '../icons/metronome.svg'
import ShareIcon from '@mui/icons-material/Share';
// import ClearIcon from '@mui/icons-material/Clear';

const styles = {
    bmBurgerButton: {
      position: 'fixed',
      width: '28.8px',
      height: '24px',
    //   left: '30px',
    //   top: '30px'
    left: '14px',
    top: '18px'
    },
    bmBurgerBars: {
    //   background: '#373a47',
    background: '#F3F3F3'
    },
    bmBurgerBarsHover: {
      background: '#a90000'
    },
    bmCrossButton: {
      height: '24px',
      width: '24px'
    },
    bmCross: {
      background: '#bdc3c7'
    },
    bmMenuWrap: {
      position: 'fixed',
      top: '0',
      height: '100%'
    },
    bmMenu: {
      position: 'fixed',
      top: '0',
      background: '#373a47',
      padding: '2.5em 1.5em 0',
      fontSize: '1.15em',
    //   width: '260px'
      paddingTop: '0px !important',
    },
    bmMorphShape: {
      fill: '#373a47'
    },
    bmItemList: {
      color: '#b8b7ad',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none'
    },
    bmItem: {
      display: 'inline-block'
    },
    bmOverlay: {
      position: 'fixed',
      top: '0',
      background: 'rgba(0, 0, 0, 0.3)'
    }
  }

let tempActiveCollectionSession = null;
Modal.setAppElement('#root')
class App extends React.Component {
    constructor() {
        super()
        this.state = {
        //Local player info
        //   playing: false,
          addCollectionModal: false,
          addSongModal: false,
          collectionName: '',
          collectionArtURL: '',
          noNextSong: false,
          shareCollectionModal: false,
          recipientEmail: '',
          shareConfirmation: '',
          editCollection: false,
          editCollections: false,
        }; 
    
        this.nextTrack = this.nextTrack.bind(this);
        // this.play = this.play.bind(this);
        // this.pause = this.pause.bind(this);
        this.checkIfLoaded = this.checkPlayerReady.bind(this);
        this.resetInfo = this.resetInfo.bind(this);
        this.changeTempoFromModal = this.changeTempoFromModal.bind(this);
        this.addSongsFromModal = this.addSongsFromModal.bind(this);
        // this.seekTime = this.seekTime.bind(this)

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleShare = this.handleShare.bind(this)
    };

    checkPlayerReady() {
        return (this.props.musicInfo.activeSession && this.props.musicInfo.activeSession.songsInRange && /*this.props.musicInfo.activeSession.songsInRange &&*/ this.props.musicInfo.activeSession.songs[this.props.playIdx] /*&& this.props.musicInfo.activeSession.songs[this.props.playIdx] !== 'S'*/);
    };
    //Instead of above check, check this.state.currSrc

    checkIfListened() {
        if (/*this.props.musicInfo.activeSession.songs[this.props.playIdx] &&*/ !this.props.user.listened.songs[this.props.musicInfo.activeSession.songs[this.props.playIdx].id]) {
            this.props.addToListenedAndSession(this.props.musicInfo.activeSession.songs[this.props.playIdx], this.props.musicInfo.activeSession.id); //pass in the songId and activeSessionId
        };
    };

    componentDidUpdate(prevProps, prevState) {
        console.log('UPDATED HERE')
        if (prevState.collectionName !== this.state.collectionName || prevState.collectionArtURL !== this.state.collectionArtURL) return;
        if (prevState.recipientEmail !== this.state.recipientEmail) return;
        if (prevProps.screenStr !== this.props.screenStr && (this.state.editCollection || this.state.editCollections)) {
            this.setState({
                editCollection: false,
                editCollections: false
            })
        };
        //Modal stuff above

        if (this.checkPlayerReady()) {
            this.checkIfListened();
        } else {
            // this.rap.src = null;
        }
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

    resetInfo = async () => {
        console.log('RESETTING INFO')
        await this.props.clearSessions()
        await this.props.clearListened(this.props.user.listened.id)
        this.props.pause();
        if (this.props.screenStr === 'PlayerScreen') this.props.changeScreen('Collections')
        if (this.state.noNextSong) this.setState({noNextSong: false})
    }

    nextTrack = async () => {
        if (this.props.musicInfo.activeSession.songs[this.props.playIdx]) {
            if (!this.props.musicInfo.activeSession.songs[this.props.playIdx+2]) this.props.enqueueSong();
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
                this.props.play();
            };
        };
    };

    changeTempoFromModal() {
        this.setState({noNextSong: false})
        this.props.selectCollectionAndChangeScreen(tempActiveCollectionSession, 'Tempo')
        tempActiveCollectionSession = null;
    };

    addSongsFromModal() {
        this.setState({noNextSong: false})
        this.props.selectCollectionAndChangeScreen(tempActiveCollectionSession, 'BrowseSongs')
        tempActiveCollectionSession = null;
    };

    showSettings (event) {
        event.preventDefault();
    };

    render() {
        console.log('Props on App.js RENDER', this.props)
        console.log('STATE', this.state)
        if (!this.props.user.id) return <Redirect to='/login' />;

        const logout = () => {
            location.href = "/auth/logout"
        };

        const homeLogout = this.props.screenStr === 'Collections' ? null : <HomeIcon className='navButton toTheLeft' onClick={() => this.props.changeScreen('Collections')}/>
        const createOrAddToCollection = this.props.screenStr === 'Collections' ? <AddIcon className='navButton' onClick={() => this.setState({addCollectionModal: true})} /> : this.props.musicInfo.collections[this.props.selectedCollection].collectionOwner === this.props.user.id && (this.props.screenStr === 'Tempo' || this.props.screenStr === 'CollectionSongs') ? <PlaylistAddIcon className='navButton' onClick={() => this.props.changeScreen('BrowseSongs')} />: null;
        const editSongs = this.props.screenStr === 'CollectionSongs' && this.props.musicInfo.collections[this.props.selectedCollection].collectionOwner === this.props.user.id ? this.state.editCollection ? <CheckIcon className="navButton" onClick={() => this.setState({editCollection: false})}/> : <EditIcon className="navButton" onClick={() => this.setState({editCollection: true})}/> : this.props.screenStr === 'Collections' ? this.state.editCollections ? <CheckIcon className="navButton" onClick={() => this.setState({editCollections: false})} /> : <EditIcon className="navButton" onClick={() => this.setState({editCollections: true})} /> : null;
        const clearListened = this.props.screenStr !== 'BrowseSongs' ? <RestartAltIcon className='navButton' onClick={this.resetInfo} /> : null;
        const navToCollectionSongs = this.props.screenStr === 'PlayerScreen' || this.props.screenStr === 'Tempo' || this.props.screenStr === 'BrowseSongs' ? <LibraryMusicSharpIcon className="navButton toTheLeft" onClick={() => this.props.changeScreen('CollectionSongs')} /> : null;
        let changeTempo;
        let selectedScreen = <Collections editMode={this.state.editCollections}/>
        if (this.props.screenStr === 'Tempo') selectedScreen = <Tempo play={this.play} next={this.nextTrack} setMetronomeSoundOption={this.props.setMetronomeSoundOption} player={this.rap} />
        else if (this.props.screenStr === 'PlayerScreen') {
            selectedScreen = <PlayerScreen />
            changeTempo = <Metronome id='metronomeNavButton' onClick={() => this.props.changeScreen('Tempo')} />
        } else if (this.props.screenStr === 'BrowseSongs') selectedScreen = <BrowseSongs play={this.play} pause={this.pause} /*playPauseBool={this.state.playing}*//>    
        else if (this.props.screenStr === 'CollectionSongs') selectedScreen = <CollectionSongs editMode={this.state.editCollection} editModeDone={() => this.setState({editCollection: false})} />
        let shareCollection;
        if (this.props.screenStr === 'CollectionSongs') shareCollection = <ShareIcon className='navButton' onClick={() => this.setState({shareCollectionModal: true})} />
        const burgerMenu = <Menu styles={styles}>
            {/* <a id="home" className="menu-item" href="/">Home</a>
            <a id="about" className="menu-item" href="/about">About</a>
            <a id="contact" className="menu-item" href="/contact">Contact</a> */}
        <div onClick={ this.showSettings } className="menu-item--small" href="">{this.props.user.email}</div>
        <div onClick={logout} className='logoutOption'>Logout</div>
        </Menu>
        // const escapeExitSongs = this.state.editCollection ? <ClearIcon onClick={() => this.setState({editCollection: false})} className='navButton'/> : null;

        return (
            <div>
                {this.props.screenStr === 'Collections' ? burgerMenu : null}
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
                                height: '118px',
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
                                height: '142px',
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
                <div id='headerContainer'>
                    <div className='topButtons'>{homeLogout}{editSongs}{clearListened}</div>
                    <div className='secondButtons'>{navToCollectionSongs}{changeTempo}{shareCollection}{createOrAddToCollection}</div>
                </div>
                <div>
                    {selectedScreen}
                </div>             
                    {this.checkPlayerReady() ? <MainPlayer nextTrack={this.nextTrack} noNextSong={this.state.noNextSong} selectCollectionAndChangeScreen={this.props.selectCollectionAndChangeScreen}/> : null}
            </div>
        );
    };
};


const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user,
        musicInfo: state.musicReducer,
        screenStr: state.screenReducer.screenStr,
        selectedCollection: state.screenReducer.selectedCollection,
        playIdx: state.musicReducer.activeSession ? state.musicReducer.activeSession.playIdx : null,
        // playing: state.playerReducer.playing
    }
}
  
const mapDispatchToProps = (dispatch) => ({
    enqueueSong: () => dispatch(enqueueSongThunk()),
    incrementPlayIdx: (sessionId) => dispatch(incrementPlayIdxThunk(sessionId)),
    // decrementPlayIdx: (sessionId) => dispatch(decrementPlayIdxThunk(sessionId)),
    changeScreen: (screen) => dispatch(changeScreenThunk(screen)),
    addToListenedAndSession: (song, collectionSessionId) => dispatch(addToListenedAndSessionThunk(song, collectionSessionId)),
    clearListened: (listenedId) => dispatch(clearListenedThunk(listenedId)),
    clearSessions: () => dispatch(clearSessionsThunk()),
    createCollection: (collectionName, collectionArtURL) => dispatch(createCollectionThunk(collectionName, collectionArtURL)),
    selectCollectionAndChangeScreen: (collectionId, screen) => dispatch(selectCollectionAndChangeScreenThunk(collectionId, screen)),
    clearActiveSession: (collectionSessionId) => dispatch(clearActiveSessionThunk(collectionSessionId)),
    popOneFromActiveSessionSongs: () => dispatch(popOneFromActiveSessionSongsThunk()),
    updateSessionBpm: (selectedCollectionId, newBPM) => dispatch(updateSessionBpmThunk(selectedCollectionId, newBPM)),
    applySongsInRange: (songs) => dispatch(applySongsInRange(songs)),
    setMetronomeSoundOption: (boolean) => dispatch(setMetronomeSoundOptionThunk(boolean)),
    play: () => dispatch(setPlayingTrueThunk()),
    pause: () => dispatch(setPlayingFalseThunk()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)