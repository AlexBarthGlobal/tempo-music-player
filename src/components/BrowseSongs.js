import React from 'react'
import {connect} from 'react-redux'
import {dispatchSearchSongs} from '../redux/musicDispatchers'

class BrowseSongs extends React.Component {
    constructor() {
        super()
        this.state = {

        };
    };
    
    

    render() {
        console.log('Props on BrowseSongs Render', this.props)
        return (
            <div className='centerThis'>
                <div className='screenTitle'>
                    Add Songs
                </div>
                <div>
                    <input type='text' placeholder='Search for songs or artists'></input>
                </div>
                <div>
                    <input type='number' placeholder='BPM'></input>
                </div>
            </div>
        )
    };
};

const mapStateToProps = (state) => {
    console.log('STATE from BROWSESONGS', state)
    return {
        selectedCollection: state.screenReducer.selectedCollection,
        searchedSongs: state.musicReducer.searchedSongs
    };
};
  
const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(BrowseSongs)