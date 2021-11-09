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
import {addToListenedAndSessionThunk, clearListenedThunk, setMetronomeSoundOptionThunk, clearInitialLoginThunk, upgradeToUserThunk} from '../redux/userDispatchers'
import songsInRange from '../components/songsInRange'
import axios from 'axios';
import { isBrowser, isMobile } from 'react-device-detect';
import MainPlayer from './MainPlayer'
import {setPlayingTrueThunk, setPlayingFalseThunk} from '../redux/playerDispatchers'
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
import SpringScrollbars from './SpringScrollbars';
import StyledButton from './StyledButton';
import Input from '@mui/material/Input';
import * as EmailValidator from 'email-validator'
import PasswordValidator from '../../server/lib/validatePw'

let tempActiveCollectionSession = null;
Modal.setAppElement('#root')
class App extends React.Component {
    constructor() {
        super()
        this.state = {
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
          registerModal: false,
          registerUsername: '',
          registerPw: '',
          registerMessage: '',
          menuOpen: false,
          initialLoginModal: false
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
        this.handleRegister = this.handleRegister.bind(this)
        this.closeMenu = this.closeMenu.bind(this)
        this.handleStateChange = this.handleStateChange.bind(this)
        // this.logoutGuest = this.logoutGuest.bind(this)
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
        if (prevState.registerUsername !== this.state.registerUsername || prevState.registerPw !== this.state.registerPw) return;
        //Modal stuff above

        if (this.checkPlayerReady()) this.checkIfListened();
    };

    handleChange(evt) {
        if (this.state.shareConfirmation.length) this.setState({shareConfirmation: ''})
        this.setState({
            [evt.target.name]: evt.target.value
        });
    };

    handleSubmit = async (evt) => {
        evt.preventDefault();
        if (!this.state.collectionName) return;
        this.setState({addCollectionModal: false})
        await this.props.createCollection(this.state.collectionName, this.state.collectionArtURL)
        this.setState({collectionName: ''})
        this.setState({collectionArtURL: ''})
    };

    handleShare = async (evt) => {
        evt.preventDefault();
        if (this.state.recipientEmail === this.props.user.email.toLowerCase()) {
            this.setState({shareConfirmation: `You can't share this with yourself!`});
        } else {
            try {
                await axios.post('/api/shareCollection', {collectionId: this.props.selectedCollection, recipientEmail: this.state.recipientEmail.toLowerCase()})
                this.setState({shareConfirmation: 'Shared successfully.'})
            } catch (err) {
                this.setState({shareConfirmation: `Recipient doesn't exist!`})
            };
        };
        
        this.setState({recipientEmail: ''});
    };
    
    handleRegister = async (evt) => {
        evt.preventDefault()
        if (!EmailValidator.validate(this.state.registerUsername) || this.state.registerUsername.includes('@tempomusicplayer.io')) {
            this.setState({registerMessage: "That's not a valid email address."})
            return;
        };
        if (!PasswordValidator.validate(this.state.registerPw)) {
            this.setState({registerMessage: "Choose a stronger password."})
            return;
        };
        
        axios.put('/api/incrementModalSignups')
        await this.props.upgradeToUser(this.state.registerUsername.toLowerCase(), this.state.registerPw);
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

    closeMenu() {
        this.setState({menuOpen: false})
    };

    handleStateChange (state) {
        this.setState({menuOpen: state.isOpen})  
    };

    // logoutGuest = async() => {
    //     try {
    //         await axios.delete('/auth/logoutGuest', {uname: this.state.registerUsername, pw: this.state.registerPw});
    //         location.href = "/auth/logout"
    //     } catch (err) {
    //         console.log(err)
    //     };
    // };

    render() {
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
              width: '24px',
              top: '0',
              right: '1',
              marginTop: '3px',
              marginLeft: '3px',
            },
            bmCross: {
              background: '#bdc3c7',
            //   backgroundColor: 'white'
            },
            bmMenuWrap: {
              position: 'fixed',
            //   height: '100%',
              height: `${isBrowser && this.props.musicInfo.activeSession ? 'calc(100vh - 90px)' : '100%' }`,
              width: '276px',
              top: '0',
              backdropFilter: 'blur(5px)'
            },
            bmMenu: {
              position: 'fixed',
              top: '0',
            //   background: '#373a47',
            //   background: 'rgb(62 60 68 / 91%)',
              background: 'rgba(52, 52, 52, 0.82)',
              backdropFilter: 'blur(5px)',
              padding: '1.5em 1.5em 0',
              fontSize: '1.15em',
              paddingTop: '0px !important',
              height: `${isBrowser && this.props.musicInfo.activeSession ? 'calc(100vh - 90px)' : '100%' }`
              
            },
            bmMorphShape: {
              fill: '#373a47'
            },
            bmItemList: {
              color: '#b8b7ad',
              display: 'flex',
              flexDirection: 'column',
              minWidth: '220px',
              maxWidth: '220px'
            },
            bmItem: {
              display: 'inline-block'
            },
            bmOverlay: {
              position: 'fixed',
              top: '0',
              background: 'rgba(0, 0, 0, 0.3)',
              height: `${isBrowser && this.props.musicInfo.activeSession ? 'calc(100vh - 90px)' : '100%' }`
            }
        };
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
        
        const burgerMenu = <Menu styles={styles} isOpen={this.state.menuOpen} onStateChange={(state) => this.handleStateChange(state)} disableAutoFocus>
            <h4 className='burgerName'>{this.props.user.userType === 'GUEST' ? 'Guest' : this.props.user.email}</h4>
            {this.props.user.userType === 'GUEST' ? <div id='guestSignUp' className='burgerMenuItem' onClick={() => {
                this.setState({menuOpen: false, registerModal: true})
                axios.put('/api/incrementBurgerSignups')}}>Sign Up</div> : null}
            {this.props.user.userType === 'GUEST' ? <div className='burgerMenuItem' onClick={logout}>Exit</div> : <div onClick={logout} className='burgerMenuItem'>Logout</div>}
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
                                height: '188px',
                                position: 'absolute',
                                width: '50vw',
                                minWidth: '222px',
                                maxWidth: '518px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                top: '28%',
                                border: '1px solid #00000096',
                                backgroundColor: `rgb(52 52 52 ${isBrowser ? '/ 82%' : ''})`,
                                backdropFilter: 'blur(5px)'
                            },
                            overlay: {
                                backgroundColor: '#36363614',
                                zIndex: 2
                            }
                        }
                    }
                >
                    <div>
                        <div className='modalText'>Name your collection:</div>
                        <div>
                            <form onSubmit={this.handleSubmit}>
                                <div>
                                    <Input className='browseSongsInput' 
                                        sx={{
                                            fontSize: 16,
                                            color: 'white',
                                            ':not($focused)': { borderBottomColor: 'white' },
                                            ':before': { borderBottomColor: 'grey' },
                                            ':after': { borderBottomColor: 'white' },
                                            }} inputProps={{ spellCheck: false }} name='collectionName' value={this.state.collectionName} onChange={this.handleChange} variant="outlined" />
                                </div>
                                <div className='modalText'>Art URL:</div>
                                <div>
                                    <Input className='browseSongsInput' 
                                        sx={{
                                            fontSize: 16,
                                            color: 'white',
                                            ':not($focused)': { borderBottomColor: 'white' },
                                            ':before': { borderBottomColor: 'grey' },
                                            ':after': { borderBottomColor: 'white' },
                                        }} inputProps={{ spellCheck: false }} name='collectionArtURL' placeholder="Search" value={this.state.collectionArtURL} onChange={this.handleChange} placeholder={'Optional'} variant="outlined" />
                                </div>
                                <div>
                                    <StyledButton type='submit' title='Create' disabled={this.state.collectionName.length > 30}/>
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
                                height: '234px',
                                position: 'absolute',
                                width: '50vw',
                                minWidth: '255px',
                                maxWidth: '518px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                top: '28%',
                                border: '1px solid #00000096',
                                paddingBottom: '24px',
                                backgroundColor: `rgb(52 52 52 ${isBrowser ? '/ 82%' : ''})`,
                                backdropFilter: 'blur(5px)'
                            },
                            overlay: {
                                backgroundColor: '#36363614',
                                zIndex: 2
                            }
                        }
                    }
                >
                    <div>
                        <div className='modalText modalTextPadding'>No more songs in this BPM range!</div>
                        <div className='modalText modalTextPadding'>Choose a different collection, or:</div>
                        <div className='modalButton'>
                            <StyledButton title='Change BPM' func={this.changeTempoFromModal} />
                        </div>
                        <div className='modalButton'>
                            {this.props.musicInfo.activeSession && this.props.musicInfo.collections[this.props.musicInfo.activeSession.collectionId].collectionOwner === this.props.user.id ? <StyledButton title='Add songs to collection' func={this.addSongsFromModal} /> : null}
                        </div>
                        <div className='modalButton'>
                            <StyledButton title='Clear Listened' func={this.resetInfo} />
                        </div>
                        <div className='modalButton'>
                            <StyledButton title='Close' func={() => this.setState({noNextSong: false})} />
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
                                height: '150px',
                                position: 'absolute',
                                width: '50vw',
                                minWidth: '222px',
                                maxWidth: '518px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                top: '28%',
                                border: '1px solid #00000096',
                                paddingBottom: '30px',
                                backgroundColor: `rgb(52 52 52 ${isBrowser ? '/ 82%' : ''})`,
                                backdropFilter: 'blur(5px)'
                            },
                            overlay: {
                                backgroundColor: '#36363614',
                                zIndex: 2
                            }
                        }
                    }
                >
                    <div>
                        <div className='modalText'>Enter recipient's E-mail:</div>
                        <div>
                            <form onSubmit={this.handleShare}>
                                <div>
                                    <Input className='browseSongsInput' 
                                        sx={{
                                            fontSize: 16,
                                            color: 'white',
                                            ':not($focused)': { borderBottomColor: 'white' },
                                            ':before': { borderBottomColor: 'grey' },
                                            ':after': { borderBottomColor: 'white' },
                                            }} inputProps={{ spellCheck: false }} name='recipientEmail' value={this.state.recipientEmail} onChange={this.handleChange} variant="outlined" />
                                </div>
                                <div className='modalText noRecipientPadding'>
                                    {this.state.shareConfirmation}
                                </div>
                                <div>
                                    <StyledButton title='Share' type='submit' />
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
                <Modal 
                    isOpen={this.state.registerModal} 
                    onRequestClose={() => this.setState({registerModal: false, registerUsername: '', registerPw: ''})}
                    style={
                        {
                            content: {
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                height: '246px',
                                position: 'absolute',
                                width: '50vw',
                                minWidth: '222px',
                                maxWidth: '518px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                top: '28%',
                                border: '1px solid #00000096',
                                backgroundColor: `rgb(52 52 52 ${isBrowser ? '/ 82%' : ''})`,
                                backdropFilter: 'blur(5px)'
                            },
                            overlay: {
                                backgroundColor: '#36363614',
                                zIndex: 2
                            }
                        }
                    }
                >
                    <div>
                        <div>
                            <form onSubmit={this.handleRegister}>
                                {this.props.signUpStatusMessage !== 'Signed up successfully.' ? <div>
                                    <div className='modalText'>E-mail</div>
                                    <Input className='browseSongsInput' 
                                        sx={{
                                            fontSize: 16,
                                            color: 'white',
                                            ':not($focused)': { borderBottomColor: 'white' },
                                            ':before': { borderBottomColor: 'grey' },
                                            ':after': { borderBottomColor: 'white' },
                                            }} inputProps={{ spellCheck: false }} name='registerUsername' value={this.state.registerUsername} onChange={this.handleChange} variant="outlined" />
                                </div> : null}
                                {this.props.signUpStatusMessage !== 'Signed up successfully.' ? <div>
                                    <div className='modalText'>Password</div>
                                    <Input className='browseSongsInput' 
                                        sx={{
                                            fontSize: 16,
                                            color: 'white',
                                            ':not($focused)': { borderBottomColor: 'white' },
                                            ':before': { borderBottomColor: 'grey' },
                                            ':after': { borderBottomColor: 'white' },
                                        }} inputProps={{ spellCheck: false }} type='password' name='registerPw' value={this.state.regsiterPw} onChange={this.handleChange} variant="outlined" />
                                </div> : null}
                                <div className='modalText modalErrorPadding'>{this.props.signUpStatusMessage === 'Signed up successfully.' ? this.props.signUpStatusMessage : this.state.registerMessage}</div>
                                {this.props.signUpStatusMessage !== 'Signed up successfully.' ? <div>
                                    <StyledButton type='submit' title='Sign Up' /*disabled={this.state.collectionName.length > 30}*//>
                                </div> : null}
                            </form>
                        </div>
                    </div>
                </Modal>
                <Modal 
                    isOpen={this.props.user.initialLogin} 
                    onRequestClose={async () => {
                        this.setState({initialLoginModal: false})
                        this.props.clearInitialLogin();
                    }}
                    style={
                        {
                            content: {
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                height: '188px',
                                position: 'absolute',
                                width: '50vw',
                                minWidth: '222px',
                                maxWidth: '518px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                top: '28%',
                                border: '1px solid #00000096',
                                backgroundColor: `rgb(52 52 52 ${isBrowser ? '/ 82%' : ''})`,
                                backdropFilter: 'blur(5px)'
                            },
                            overlay: {
                                backgroundColor: '#36363614',
                                zIndex: 2
                            }
                        }
                    }
                >
                    <div>
                        <div>
                            <div>
                                <div className='modalText'>Welcome to Tempo Music Player</div>
                            </div>
                        </div>
                    </div>
                </Modal>
                {this.props.screenStr !== 'PlayerScreen' && isBrowser ? <SpringScrollbars ref='scrollbars' style={{height: this.props.musicInfo.activeSession ? `calc(100vh - 90px)` : `100vh`}}>
                <div id='headerContainer'>
                    <div className='topButtons'>{homeLogout}{editSongs}{clearListened}</div>
                    <div className='secondButtons'>{navToCollectionSongs}{changeTempo}{shareCollection}{createOrAddToCollection}</div>
                </div>
                <div className='headerRoom'>
                    {selectedScreen}
                </div> 
                </SpringScrollbars> :
                <div>
                <div id='headerContainer'>
                    <div className='topButtons'>{homeLogout}{editSongs}{clearListened}</div>
                    <div className='secondButtons'>{navToCollectionSongs}{changeTempo}{shareCollection}{createOrAddToCollection}</div>
                </div>
                <div className='headerRoom'>
                    {selectedScreen}
                </div>
                </div> }
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
        signUpStatusMessage: state.userReducer.user.signUpStatusMessage
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
    clearInitialLogin: () => dispatch(clearInitialLoginThunk()),
    upgradeToUser: (registerUsername, registerPw) => dispatch(upgradeToUserThunk(registerUsername, registerPw))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)