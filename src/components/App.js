import React from 'react';
import {connect} from 'react-redux'
import Player from './Player'
import Collections from './Collections'
import Tempo from './Tempo'
import Screens from './Screens'

class App extends React.Component {
    constructor() {
        super()
        this.state = {

        }; 
    };

    render() {
        console.log(this.props)
        return (
            <div>
                <Screens />
                {/* <Player /> */}
            </div>
        );
    };
};

const mapStateToProps = (state) => {
    console.log('Mapping state')
    return { 
        user: state.userReducer.user
    }
  }
  
  const mapDispatchToProps = dispatch => ({
    
  })

export default connect(mapStateToProps, mapDispatchToProps)(App)


// This is how I change tabs: Set the state

// <button onClick={() => this.setState({
//                          screen: 'Tempo'
//                      })}></button>

// sessionStorage.setItem('screen', 'Collections')

// const screens = [<Collections />, <Tempo />, <Player />]


        // if (sessionStorage.getItem('screen') === 'Collections') screen = <Collections />
        // else if (sessionStorage.getItem('screen') === 'Tempo') screen = <Tempo />

        // if (sessionStorage.getItem('screen') === 'Collections' || !this.props.screen) {
        //     return (
        //         <Player />
        //     )
        // } else if (sessionStorage.getItem('screen') === 'Player') {
        //     return (
        //             <Player />
        //     )
        // } else if (this.props.screen === 'Tempo') {
        //     return (
        //             <Tempo />
        //     )
        // };    