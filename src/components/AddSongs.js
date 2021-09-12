import React from 'react'
import {connect} from 'react-redux'

class AddSongs extends React.Component {
    constructor() {
        super()
        this.state = {

        };
    };
    
    

    render() {

        return (
            <div>
                AddSongs Page
            </div>
        )
    };
};

const mapStateToProps = (state) => {
    return {

    };
};
  
const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(AddSongs)