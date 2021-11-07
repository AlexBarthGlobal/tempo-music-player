import React from 'react';
import {connect} from 'react-redux'
import {changeScreenThunk} from '../redux/screenDispatchers'
import {updateSessionBpmThunk, popOneFromActiveSessionSongsThunk, applySongsInRange, fetchOnTempoChangeThunk} from '../redux/musicDispatchers'
import songsInRange from '../components/songsInRange'
import Modal from 'react-modal'
import ManageBPMSliderAndTap from './ManageBPMSliderAndTap'
import { setPlayingTrueThunk } from '../redux/playerDispatchers';
import { isBrowser, isMobile } from 'react-device-detect';

class Tempo extends React.Component {
    constructor (props) {
        console.log('PROPS from Constructor',props)
        super()
        this.state = {
            noMoreMusic: false
        };

    // this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.isActive = this.isActive.bind(this)
    };

    isActive = (collectionId) => {
        return (this.props.musicInfo.activeSession && this.props.musicInfo.activeSession.collectionId === collectionId)
    };

    handleSubmit = async (selectedBPM) => {
        // evt.preventDefault();
        const results = songsInRange(this.props.user.listened.songs, this.props.musicInfo.collections[this.props.selectedCollection].songs, selectedBPM)  //Run this when updating BPM
        if (results[0].length) {
            if (this.isActive(this.props.selectedCollection)) this.props.popOneFromActiveSessionSongs();     
            if (this.isActive(this.props.selectedCollection)) await this.props.updateSessionBpm(this.props.selectedCollection, selectedBPM) //update the BPM of the already activeSession or create new session
            else await this.props.fetchOnTempoChange(this.props.selectedCollection, selectedBPM); //load the session and its sessionSongs 
            // if (/*this.props.musicInfo.activeSession &&*/ this.props.musicInfo.collections[this.props.musicInfo.activeSession.collectionId].songs.length) {
            this.props.applySongsInRange(results[0]);
            this.props.changeScreen('PlayerScreen')
            let idx = this.props.musicInfo.activeSession.playIdx
            while (this.props.musicInfo.activeSession.songs[idx] === 'S' || this.props.musicInfo.activeSession.songs[idx].BPM < this.props.musicInfo.activeSession.currBPM-2 || this.props.musicInfo.activeSession.songs[idx].BPM > this.props.musicInfo.activeSession.currBPM+3 || this.props.user.listened.songs[this.props.musicInfo.activeSession.songs[idx].id]) {
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

    changeBPM = (newBPM) => {
        console.log('CHANGE BPM', newBPM)
        this.setState({
            BPM: Number(newBPM)
        });
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
                                height: '118px',
                                position: 'absolute',
                                width: '50vw',
                                minWidth: '270px',
                                maxWidth: '518px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                top: '28%',
                                border: '1px solid #00000096',
                                // paddingBottom: '30px',
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
                        <div className='modalText'>No more songs at the selected BPM!</div>
                        <div className='modalText'>Try a different BPM,</div>
                        <div className='modalText'>add songs, or clear listened.</div>
                        {/* <div>
                            
                        </div> */}
                    </div>
                </Modal>
                <div>
                    <div className='screenTitle confirmBPMTitle'>Confirm BPM:</div>
                    <div className='centerThis'>
                        <ManageBPMSliderAndTap BPM={this.props.musicInfo.collections[this.props.selectedCollection] && this.props.musicInfo.collections[this.props.selectedCollection].collectionSessions.length ? this.props.musicInfo.collections[this.props.selectedCollection].collectionSessions[0].currBPM : 140} metronomeSound={this.props.user.metronomeSound} playing={this.props.playing} handleSubmit={this.handleSubmit} setMetronomeSoundOption={this.props.setMetronomeSoundOption}/>
                    </div>
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
        playing: state.playerReducer.playing
    }
}
  
const mapDispatchToProps = dispatch => ({
    changeScreen: (screen) => dispatch(changeScreenThunk(screen)),
    updateSessionBpm: (selectedCollectionId, newBPM) => dispatch(updateSessionBpmThunk(selectedCollectionId, newBPM)),
    popOneFromActiveSessionSongs: () => dispatch(popOneFromActiveSessionSongsThunk()),
    applySongsInRange: (songs) => dispatch(applySongsInRange(songs)),
    fetchOnTempoChange: (selectedCollectionId, newBPM) => dispatch(fetchOnTempoChangeThunk(selectedCollectionId, newBPM)),
    play: () => dispatch(setPlayingTrueThunk())
})

export default connect(mapStateToProps, mapDispatchToProps)(Tempo)