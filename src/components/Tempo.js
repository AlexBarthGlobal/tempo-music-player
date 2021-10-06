import React from 'react';
import {connect} from 'react-redux'
import {changeScreenThunk} from '../redux/screenDispatchers'
import {updateSessionBpmThunk, popOneFromActiveSessionSongsThunk, applySongsInRange, fetchOnTempoChangeThunk} from '../redux/musicDispatchers'
import songsInRange from '../components/songsInRange'
import Modal from 'react-modal'

class Tempo extends React.Component {
    constructor (props) {
        console.log('PROPS from Constructor',props)
        super()
        this.state = {
            BPM: props.musicInfo.collections[props.selectedCollection] && props.musicInfo.collections[props.selectedCollection].collectionSessions.length ? props.musicInfo.collections[props.selectedCollection].collectionSessions[0].currBPM : '',
            noMoreMusic: false
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
        const results = songsInRange(this.props.user.listened.songs, this.props.musicInfo.collections[this.props.selectedCollection].songs, this.state.BPM)  //Run this when updating BPM
        if (results[0].length) {
            if (this.isActive(this.props.selectedCollection)) this.props.popOneFromActiveSessionSongs();     
            if (this.isActive(this.props.selectedCollection)) await this.props.updateSessionBpm(this.props.selectedCollection, this.state.BPM) //update the BPM of the already activeSession or create new session
            else await this.props.fetchOnTempoChange(this.props.selectedCollection, this.state.BPM); //load the session and its sessionSongs 
            // if (/*this.props.musicInfo.activeSession &&*/ this.props.musicInfo.collections[this.props.musicInfo.activeSession.collectionId].songs.length) {
            this.props.applySongsInRange(results[0]);
            this.props.changeScreen('PlayerScreen')
            let idx = this.props.musicInfo.activeSession.playIdx
            while (this.props.musicInfo.activeSession.songs[idx].BPM < this.props.musicInfo.activeSession.currBPM-2 || this.props.musicInfo.activeSession.songs[idx].BPM > this.props.musicInfo.activeSession.currBPM+3 || this.props.user.listened.songs[this.props.musicInfo.activeSession.songs[idx].id] || this.props.musicInfo.activeSession.songs[idx] === 'S') {
                idx++;
                await this.props.next();
            };
            this.props.play();
            // }
        } else {
            this.setState({noMoreMusic: true})
            console.log('No more music')
        }
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
                <Modal 
                    isOpen={this.state.noMoreMusic}
                    onRequestClose={() => this.setState({noMoreMusic: false})}
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
                        <div>No more music at the selected BPM!</div>
                        <div>Try a different BPM,</div>
                        <div>add songs, or clear listened.</div>
                        <div>
                            
                        </div>
                    </div>
                </Modal>
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
                            <button type='submit'>Play</button>
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