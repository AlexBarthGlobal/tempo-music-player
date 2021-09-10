import React from 'react';
import {connect} from 'react-redux'
import {changeScreenThunk} from '../redux/screenDispatchers'
import {updateSessionBpmThunk, popOneFromActiveSessionSongsThunk, applySongsInRange, fetchOnTempoChangeThunk} from '../redux/musicDispatchers'
import songsInRange from '../components/songsInRange'

// this.props.musicInfo.collections[this.props.selectedCollection] && this.props.musicInfo.collections[this.props.selectedCollection].collectionSessions.length ? this.props.musicInfo.collections[this.props.selectedCollection].collectionSessions[0].currBPM : null

class Tempo extends React.Component {
    constructor (props) {
        console.log('PROPS from Constructor',props)
        super()
        this.state = {
            BPM: props.musicInfo.collections[props.selectedCollection] && props.musicInfo.collections[props.selectedCollection].collectionSessions.length ? props.musicInfo.collections[props.selectedCollection].collectionSessions[0].currBPM : 0
        };

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.isActive = this.isActive.bind(this)
    };

    isActive = (collectionId) => {
        return (this.props.musicInfo.activeSession && this.props.musicInfo.activeSession.collectionId === collectionId)
    };

    handleSubmit = async (evt) => {
        evt.preventDefault();
        if (this.isActive(this.props.selectedCollection)) this.props.popOneFromActiveSessionSongs();
        if (this.isActive(this.props.selectedCollection)) await this.props.updateSessionBpm(this.props.selectedCollection, this.state.BPM) //update the BPM of the already activeSession or create new session
        else await this.props.fetchOnTempoChange(this.props.selectedCollection, this.state.BPM); //load the collection and include its songs & session & its sessionSongs
        
        if (/*this.props.musicInfo.activeSession &&*/ this.props.musicInfo.collections[this.props.musicInfo.activeSession.collectionId].songs.length) {
            const results = songsInRange(this.props.user.listened.songs, this.props.musicInfo.collections[this.props.musicInfo.activeSession.collectionId].songs, this.props.musicInfo.activeSession.currBPM)  //Run this when updating BPM
            this.props.applySongsInRange(results);
            this.props.changeScreen('PlayerScreen')
            // if (this.props.player.paused /*&& this.props.musicInfo.activeSession.songs.length > 2*/) {
                let idx = this.props.musicInfo.activeSession.playIdx
                while (this.props.musicInfo.activeSession.songs[idx].BPM < this.props.musicInfo.activeSession.currBPM-2 || this.props.musicInfo.activeSession.songs[idx].BPM > this.props.musicInfo.activeSession.currBPM+3 || this.props.user.listened.songs[this.props.musicInfo.activeSession.songs[idx].id]) {
                    console.log(this.props.musicInfo.activeSession.currBPM)
                    idx++;
                    this.props.next();
                };
            // };
            this.props.play();
        } else {
            console.log('No songs at this BPM, choose a different BPM or add songs to collection!');
            console.log('Or clear listened')
        };
    };

    handleChange = (evt) => {
        this.setState({
          [evt.target.name]: Number(evt.target.value)
        })
    };

    render() {
        console.log('PROPS from TEMPO', this.props)
        const { BPM } = this.state;
        return (
            <div>
                <div className='screenTitle'>
                    Tempo Screen
                </div>
                <div className='centerThis'>
                    <div>Confirm BPM {BPM}</div>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <input name='BPM' onChange={this.handleChange} value={BPM}/>
                        </div>
                        <div>
                            <button type='submit'>Confirm</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    };
};

const mapStateToProps = (state) => {
    return { 
        user: state.userReducer.user,
        musicInfo: state.musicReducer,
        screenStr: state.screenReducer.screenStr,
        selectedCollection: state.screenReducer.selectedCollection,
    }
}
  
const mapDispatchToProps = dispatch => ({
    changeScreen: (screen) => dispatch(changeScreenThunk(screen)),
    updateSessionBpm: (selectedCollectionId, newBPM) => dispatch(updateSessionBpmThunk(selectedCollectionId, newBPM)),
    popOneFromActiveSessionSongs: () => dispatch(popOneFromActiveSessionSongsThunk()),
    applySongsInRange: (songs) => dispatch(applySongsInRange(songs)),
    fetchOnTempoChange: (selectedCollectionId, newBPM) => dispatch(fetchOnTempoChangeThunk(selectedCollectionId, newBPM))
})

export default connect(mapStateToProps, mapDispatchToProps)(Tempo)