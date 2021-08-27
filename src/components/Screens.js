import React from 'react';
// import {connect} from 'react-redux'
import Collections from './Collections'
import Tempo from './Tempo'
import Player from './Player'

class Screens extends React.Component {
    constructor() {
        super()
        this.state = {
            screen: 'Collections'
        }; 
    };

    render() {
        let screen;
        if (this.state.screen === 'Collections') screen = <Collections />
        else if (this.state.screen === 'Tempo') screen = <Tempo />

        return (
            <div>
                <a href="/auth/logout"><button>Logout</button></a>
                <button onClick={() => this.setState({screen: 'Collections'})} style={this.state.screen === 'Collections' ? {display: 'none'} : {display: 'inline'}}>Home</button>
                <button onClick={() => this.setState({screen: 'Tempo'})}>Tempo</button>
                {screen}
                <Player />
            </div>
        )
    };
}




export default Screens

// export default connect(mapState, mapDispatch)(Checkout)