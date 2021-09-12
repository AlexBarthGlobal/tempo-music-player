import React from 'React'
import {connect} from 'react-redux'
import {fetchActiveCollectionSongs} from '../redux/musicDispatchers';
import {changeScreenThunk} from '../redux/screenDispatchers'
import SingleSong from './SingleSong'


class CollectionSongs extends React.Component {
    constructor() {
        super()
        this.state = {

        };
    };

    componentDidMount() {
        this.props.dispatchFetchActiveCollectionSongs(this.props.selectedCollection)
    }

    render() {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!', this.props)

        let songList = [];
        if (this.props.musicInfo.collections[this.props.selectedCollection].songs) {
            let idx = 0;
            for (const song of this.props.musicInfo.collections[this.props.selectedCollection].songs) {
                songList.push(<SingleSong key={idx} songName={song.songName} artistName={song.artistName} albumName={song.albumName} BPM={song.BPM} duration={song.duration} artURL={song.artURL} />)
                idx++;
            }
        }


        // return loading screen if no songs loaded yet for the selected collection
        if (!this.props.musicInfo.collections[this.props.selectedCollection].songs) return (
            <div className='screenTitle'>
                
            </div>
        )
        else return (
            <div>
                <div className='screenTitle'>
                    <div>
                        {this.props.musicInfo.collections[this.props.selectedCollection].collectionName}
                    </div>
                    <div>
                        <button onClick={() => this.props.changeScreen('Tempo')}>Select Tempo and Play</button>
                    </div>
                </div>
                <ul>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionSongs)