import React from 'react';
import {connect} from 'react-redux'

class Tempo extends React.Component {

    render() {
        return (
            <div>
                <div className='screenTitle'>
                    Tempo Screen
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

  })

export default connect(mapStateToProps, mapDispatchToProps)(Tempo)