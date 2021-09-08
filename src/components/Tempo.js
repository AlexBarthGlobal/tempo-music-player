import React from 'react';
import {connect} from 'react-redux'
import {changeScreenThunk} from '../redux/screenDispatchers'

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

    handleSubmit = (evt) => {
        evt.preventDefault();
        // console.log(this.state.BPM)
        // Write this out
        this.props.fetchOnTempoChange('')
        this.props.changeScreen('PlayerScreen')
    };

    handleChange = (evt) => {
        this.setState({
          [evt.target.name]: evt.target.value
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
    changeScreen: (screen) => dispatch(changeScreenThunk(screen))
})

export default connect(mapStateToProps, mapDispatchToProps)(Tempo)