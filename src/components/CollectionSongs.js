import React from 'React'
import {connect} from 'react-redux'
import {fetchActiveCollectionSongs, removeSongFromCollectionThunk, updateCollectionNameThunk} from '../redux/musicDispatchers';
import {changeScreenThunk} from '../redux/screenDispatchers'
import CollectionSingleSong from './CollectionSingleSong'
import Modal from 'react-modal'
import {selectCollectionAndChangeScreenThunk} from '../redux/screenDispatchers'
import Metronome from '../icons/metronome.svg'

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

    componentDidMount() {
        this.props.fetchActiveCollectionSongs(this.props.selectedCollection)
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
        console.log('REMOVED', songId)
        await this.props.removeSongFromCollection(this.props.selectedCollection, songId, !!this.props.user.listened.songs[songId]);
    };
    
    render() {
        // const buttonLabel = this.props.musicInfo.activeSession && this.props.musicInfo.activeSession.collectionId === this.props.selectedCollection ? 'Change Tempo' : 'Select Tempo and Play'
        const songList = [];
        if (this.props.musicInfo.collections[this.props.selectedCollection].songs) {
            for (const [id, song] of this.props.musicInfo.collections[this.props.selectedCollection].songs) {
                songList.push(song);
            };
            songList.sort((a,b) => a.BPM-b.BPM)
            let idx = 0;
            for (const song of songList) {
                songList[idx] = <CollectionSingleSong key={idx} songId={song.id} songName={song.songName} artistName={song.artistName} albumName={song.albumName} BPM={song.BPM} duration={song.duration} artURL={song.artURL} editMode={this.props.editMode} removeSongFromCollection={this.removeSongFromCollection} listenedBool={!!this.props.user.listened.songs[song.id]} />
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
                                    // minHeight: '106px',
                                    // maxHeight: '106px',
                                    height: '106px',
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
                            <div>No songs in this collection yet!</div>
                            <div>
                                {this.props.musicInfo.collections[this.props.selectedCollection].collectionOwner === this.props.user.id ? <button onClick={() => this.props.changeScreen('BrowseSongs')}>Add Songs</button> : null}
                            </div>
                            <div>
                                <button onClick={() => this.props.selectCollectionAndChangeScreen(null, 'Collections')}>Go back</button>
                            </div>
                        </div>
                    </Modal>
                    <div className='screenTitle'>
                        <div>
                            {this.props.musicInfo.collections[this.props.selectedCollection].collectionName}
                        </div>
                        <div>
                            <button onClick={() => this.props.changeScreen('Tempo')}>{buttonLabel}</button>
                        </div>
                    </div>
                    {/* <ul>
                      {songList}
                    </ul> */}
                </div>      
            )
        } else return (
            <div>
                <div className='screenTitle'>
                    <div>
                        {this.props.editMode ? <input name='editedCollectionName' onFocus={this.clearNameOnFocus} value={this.state.editedCollectionName} onChange={this.handleChange}></input> : this.state.collectionName}
                    </div>
                    <div>
                        <Metronome id='metronomeMain' onClick={() => this.props.changeScreen('Tempo')} />
                    </div>
                </div>
                
                <ul style ={{listStyle:'none'}}>
                    {songList}
                </ul>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // selectedCollectionName: state.musicReducer.collections[state.screenReducer.selectedCollection].collectionName,
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