import React from 'React'
import {connect} from 'react-redux'
import {fetchActiveCollectionSongs, removeSongFromCollectionThunk, updateCollectionNameThunk} from '../redux/musicDispatchers';
import {changeScreenThunk} from '../redux/screenDispatchers'
import CollectionSingleSong from './CollectionSingleSong'
import Modal from 'react-modal'
import {selectCollectionAndChangeScreenThunk} from '../redux/screenDispatchers'
import Metronome from '../icons/metronome.svg'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { isBrowser } from 'react-device-detect';
import StyledButton from './StyledButton'
import Input from '@mui/material/Input';

class CollectionSongs extends React.Component {
    constructor(props) {
        super()
        this.state = {
            collectionName: props.musicInfo.collections[props.selectedCollection].collectionName,
            editedCollectionName: props.musicInfo.collections[props.selectedCollection].collectionName,
            exited: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.clearNameOnFocus = this.clearNameOnFocus.bind(this)
    };

    async componentDidMount() {
        window.scrollTo(0, 0);
        await this.props.fetchActiveCollectionSongs(this.props.selectedCollection)
        document.addEventListener('keydown', e => {
            if (e.key === 'Enter' && this.props.editMode) {
                this.setState({
                    collectionName: this.state.editedCollectionName
                })
                this.props.editModeDone();
            } 
            if (e.key === "Escape" && this.props.editMode) {
                this.setState({
                    exited: true,
                    editedCollectionName: this.props.musicInfo.collections[this.props.selectedCollection].collectionName
                })
                this.props.editModeDone();
            };
        });
    };

    componentWillUnmount() {
        document.removeEventListener('keypress', () => {});
    };

    async componentDidUpdate(prevProps) {
        if (prevProps.editMode && !this.props.editMode) {
            if (!this.state.exited && this.state.editedCollectionName !== this.props.musicInfo.collections[this.props.selectedCollection].collectionName) {
                this.setState({collectionName: this.state.editedCollectionName})
                await this.props.updateCollectionName(this.state.editedCollectionName, this.props.selectedCollection);
            } else this.setState({exited: false})
        };
    };

    handleChange = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value
        });
    };

    clearNameOnFocus = () => {
        this.setState({editedCollectionName: ''})
    }

    removeSongFromCollection = async (songId) => {
        await this.props.removeSongFromCollection(this.props.selectedCollection, songId, !!this.props.user.listened.songs[songId]);
    };
    
    render() {
        const songList = [];
        if (this.props.musicInfo.collections[this.props.selectedCollection].songs) {
            for (const [id, song] of this.props.musicInfo.collections[this.props.selectedCollection].songs) {
                songList.push(song);
            };
            songList.sort((a,b) => a.BPM-b.BPM)
            let idx = 0;
            for (const song of songList) {
                songList[idx] = <CollectionSingleSong key={idx} songId={song.id} songName={song.songName} artistName={song.artistName} albumName={song.albumName} BPM={song.BPM} duration={song.duration} artURL={song.artURL} editMode={this.props.editMode} removeSongFromCollection={this.removeSongFromCollection} listenedBool={!!this.props.user.listened.songs[song.id]} songIsPlaying={this.props.musicInfo.activeSession && this.props.musicInfo.activeSession.songs && this.props.musicInfo.activeSession.songs[this.props.musicInfo.activeSession.playIdx] && this.props.musicInfo.activeSession.songs[this.props.musicInfo.activeSession.playIdx].id === song.id} />
                idx++;
            };
        };

        // return loading screen while loading songs for selected collection
        if (!this.props.musicInfo.collections[this.props.selectedCollection].songs) {
            return (
            <div className='screenTitle'>
                
            </div>
            )
        } else if (!songList.length) {
            return (
                <div>
                    <Modal 
                        isOpen={true} 
                        onRequestClose={() => this.props.selectCollectionAndChangeScreen(null, 'Collections')}
                        style={
                            {
                                content: {
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    height: '118px',
                                    position: 'absolute',
                                    width: '50vw',
                                    minWidth: '244px',
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
                            <div className='modalText modalTextPadding'>No songs in this collection yet!</div>
                            <div className='modalButton'>
                                {this.props.musicInfo.collections[this.props.selectedCollection].collectionOwner === this.props.user.id ? <StyledButton title='Add songs' func={() => this.props.changeScreen('BrowseSongs')} /> : null}
                            </div>
                            <div className='modalButton'>
                                <StyledButton title='Go back' func={() => this.props.selectCollectionAndChangeScreen(null, 'Collections')} />
                            </div>
                        </div>
                    </Modal>
                    <div className='screenTitle'>
                        <div>
                            {this.props.musicInfo.collections[this.props.selectedCollection].collectionName}
                        </div>
                        <div>
                            <Metronome id='metronomeMain' onClick={() => this.props.changeScreen('Tempo')} />
                        </div>
                    </div>
                </div>      
            )
        } else return (
            <div>
                <div className='screenTitle'>
                    <div>
                        {this.props.editMode ? <Input className='browseSongsInput' 
                                        sx={{
                                            fontFamily: 'inherit',
                                            fontSize: 30,
                                            color: 'white',
                                            ':not($focused)': { borderBottomColor: 'white' },
                                            ':before': { borderBottomColor: 'rgb(160, 160, 160)' },
                                            ':after': { borderBottomColor: 'white' },
                                            }} inputProps={{ spellCheck: false, style: { textAlign: 'center' }}} name='editedCollectionName' onFocus={this.clearNameOnFocus} value={this.state.editedCollectionName} onChange={this.handleChange} variant="outlined" /> : this.state.collectionName}
                    </div>
                    <div>
                        <Metronome id='metronomeMain' onClick={() => this.props.changeScreen('Tempo')} />
                    </div>
                </div>
                <div>
                    <table className={`collectionSongsTable ${isBrowser ? 'collectionSongsTableDesktop clearFooterPaddingDesktopSongs' : 'clearFooterPaddingMobile'}`}>
                        <tbody>
                            <tr>
                                <th></th>
                                <th>Title</th>
                                {isBrowser ? <th>Album</th> : null}
                                <th>BPM</th>
                                <th id='durationIconContainer'><AccessTimeIcon id='durationIcon' /></th>
                            </tr>
                            {songList}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user,
        musicInfo: state.musicReducer,
        screenStr: state.screenReducer.screenStr,
        selectedCollection: state.screenReducer.selectedCollection,
        playIdx: state.musicReducer.activeSession ? state.musicReducer.activeSession.playIdx : null,
    };
};
  
const mapDispatchToProps = (dispatch) => ({
    fetchActiveCollectionSongs: (collectionId) => dispatch(fetchActiveCollectionSongs(collectionId)),
    changeScreen: (screen) => dispatch(changeScreenThunk(screen)),
    selectCollectionAndChangeScreen: (collectionId, screen) => dispatch(selectCollectionAndChangeScreenThunk(collectionId, screen)),
    removeSongFromCollection: (collectionId, songId, listenedBool) => dispatch(removeSongFromCollectionThunk(collectionId, songId, listenedBool)),
    updateCollectionName: (newCollectionName, collectionId) => dispatch(updateCollectionNameThunk(newCollectionName, collectionId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionSongs)