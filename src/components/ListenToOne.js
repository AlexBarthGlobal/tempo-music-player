import React from 'react';
import {connect} from 'react-redux'

const ListenToOne = (props) => {



console.log('Info from LISTENTO1', props.musicInfo)
    return (
        <div> </div>
    )


}

const mapStateToProps = (state) => {
    // console.log('State from App.js', state)
    return {
        playIdx: state.musicReducer.activeSession ? state.musicReducer.activeSession.playIdx : null
    }
}

export default connect(mapStateToProps)(ListenToOne)