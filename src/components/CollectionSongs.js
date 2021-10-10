import React from 'React'
import {connect} from 'react-redux'
import {fetchActiveCollectionSongs, removeSongFromCollectionThunk, updateCollectionNameThunk} from '../redux/musicDispatchers';
import {changeScreenThunk} from '../redux/screenDispatchers'
import CollectionSingleSong from './CollectionSingleSong'
import Modal from 'react-modal'
import {selectCollectionAndChangeScreenThunk} from '../redux/screenDispatchers'
import {removeSongFromListenedThunk} from '../redux/userDispatchers'

class CollectionSongs extends React.Component {
    constructor(props) {
        console.log('PROPS from COLLECTIONSONGS CONSTRUCTOR',props.musicInfo.collections[props.selectedCollection].collectionName)
        super()
        this.state = {
            collectionName: props.musicInfo.collections[props.selectedCollection].collectionName
        }

        this.handleChange = this.handleChange.bind(this)
        this.clearNameOnFocus = this.clearNameOnFocus.bind(this)
    };

    componentDidMount() {
        this.props.fetchActiveCollectionSongs(this.props.selectedCollection)
    };

    async componentDidUpdate(prevProps) {
        if (prevProps.editMode && !this.props.editMode) {
            if (this.state.collectionName !== this.props.musicInfo.collections[this.props.selectedCollection].collectionName) {
                console.log('UPDATE COLLECTION NAME IN DB')
                await this.props.updateCollectionName(this.state.collectionName, this.props.selectedCollection)
                //this.setState({collectionName: this.props.musicInfo.collections[this.props.selectedCollection].collectionName})
            };
        };
    };

    handleChange = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value
        });
    };

    clearNameOnFocus = () => {
        this.setState({collectionName: ''})
    }

    removeSongFromCollection = async (songId) => {
        console.log('REMOVED', songId)
        await this.props.removeSongFromCollection(this.props.selectedCollection, songId, !!this.props.user.listened.songs[songId]);
    };

    removeSongFromListened = async (songId) => {
        console.log('Removing', songId)
        await this.props.removeSongFromListened(songId)
    };
    
    render() {
        console.log('FROM COLLECTIONSONGS', this.props.editMode)
        console.log('Collection name', this.state.collectionName)
        const buttonLabel = this.props.musicInfo.activeSession && this.props.musicInfo.activeSession.collectionId === this.props.selectedCollection ? 'Change Tempo' : 'Select Tempo and Play'
        let songList = [];
        if (this.props.musicInfo.collections[this.props.selectedCollection].songs) {
            console.log(this.props.musicInfo.collections[this.props.selectedCollection].songs)
            let idx = 0;
            for (const [id, song] of this.props.musicInfo.collections[this.props.selectedCollection].songs) {
                songList.push(<CollectionSingleSong key={idx} songId={id} songName={song.songName} artistName={song.artistName} albumName={song.albumName} BPM={song.BPM} duration={song.duration} artURL={song.artURL} editMode={this.props.editMode} removeSongFromCollection={this.removeSongFromCollection} listenedBool={!!this.props.user.listened.songs[id]} removeSongFromListened={this.removeSongFromListened} />)
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
                        onRequestClose={() => this.props.dispatchSelectCollectionAndChangeScreen(null, 'Collections')}
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
                                <button onClick={() => this.props.dispatchSelectCollectionAndChangeScreen(null, 'Collections')}>Go back</button>
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
                        {this.props.editMode ? <input name='collectionName' onFocus={this.clearNameOnFocus} value={this.state.collectionName} onChange={this.handleChange}></input> : this.state.collectionName}
                    </div>
                    <div>
                        <button onClick={() => this.props.changeScreen('Tempo')}>{buttonLabel}</button>
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
    dispatchSelectCollectionAndChangeScreen: (collectionId, screen) => dispatch(selectCollectionAndChangeScreenThunk(collectionId, screen)),
    removeSongFromCollection: (collectionId, songId, listenedBool) => dispatch(removeSongFromCollectionThunk(collectionId, songId, listenedBool)),
    updateCollectionName: (newCollectionName, collectionId) => dispatch(updateCollectionNameThunk(newCollectionName, collectionId)),
    removeSongFromListened: (songId) => dispatch(removeSongFromListenedThunk(songId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionSongs)