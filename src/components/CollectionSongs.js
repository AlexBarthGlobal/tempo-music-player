import React from 'React'
import {connect} from 'react-redux'
import {fetchActiveCollectionSongs} from '../redux/musicDispatchers';
import {changeScreenThunk} from '../redux/screenDispatchers'
import CollectionSingleSong from './CollectionSingleSong'
import Modal from 'react-modal'
import {selectCollectionAndChangeScreenThunk} from '../redux/screenDispatchers'

class CollectionSongs extends React.Component {
    // constructor() {
    //     super()
    //     this.state = {
    //         emptyCollectionModal: true
    //     };
    // };

    componentDidMount() {
        this.props.dispatchFetchActiveCollectionSongs(this.props.selectedCollection)
    };
    
    render() {
        const buttonLabel = this.props.musicInfo.activeSession && this.props.musicInfo.activeSession.collectionId === this.props.selectedCollection ? 'Change Tempo' : 'Select Tempo and Play'
        let songList = [];
        if (this.props.musicInfo.collections[this.props.selectedCollection].songs) {
            let idx = 0;
            for (const song of this.props.musicInfo.collections[this.props.selectedCollection].songs) {
                songList.push(<CollectionSingleSong key={idx} songName={song.songName} artistName={song.artistName} albumName={song.albumName} BPM={song.BPM} duration={song.duration} artURL={song.artURL} />)
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
                        {this.props.musicInfo.collections[this.props.selectedCollection].collectionName}
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
    dispatchFetchActiveCollectionSongs: (collectionId) => dispatch(fetchActiveCollectionSongs(collectionId)),
    changeScreen: (screen) => dispatch(changeScreenThunk(screen)),
    dispatchSelectCollectionAndChangeScreen: (collectionId, screen) => dispatch(selectCollectionAndChangeScreenThunk(collectionId, screen))
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionSongs)