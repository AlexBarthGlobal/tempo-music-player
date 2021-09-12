import React from 'react'
import {connect} from 'react-redux'

class BrowseSongs extends React.Component {
    constructor() {
        super()
        this.state = {

        };
    };
    
    

    render() {

        return (
            <div>
                BrowseSongs page
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

export default connect(mapStateToProps, mapDispatchToProps)(BrowseSongs)