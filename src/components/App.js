import React from 'react';
import {connect} from 'react-redux'
import Player from './Player'
import Collections from './Collections'
import Tempo from './Tempo'
import LogIn from './LogIn'

// This is how I change tabs: Set the state

// <button onClick={() => this.setState({
//                          screen: 'Tempo'
//                      })}></button>

class App extends React.Component {
    constructor() {
        super()
        this.state = {
        //   screen: 'Collections', manage this in redux
        //  playIdx: 0
        }; 
    };

    // componentDidMount() {
    //     console.log('mounted')
    // }

    render() {
        console.log(this.props)
        if (!this.props.user) {
            return (
            //    <LogIn /> 
            <div>Yo</div>
            )
        };

        if (this.props.screen === 'Collections') {
            return (
                    <Collections />
            )
        } else if (this.props.screen === 'Player') {
            return (
                    <Player />
            )
        } else if (this.props.screen === 'Tempo') {
            return (
                    <Tempo />
            )
        };       
    };


};

const mapStateToProps = (state) => {
    console.log('Mapping state')
    return { 
    //   user: state.user,
    //   screen: state.screen
    }
  }
  
  const mapDispatchToProps = dispatch => ({
    
  })

export default connect(mapStateToProps, mapDispatchToProps)(App)
