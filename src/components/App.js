import React from 'react';
import {connect} from 'react-redux'
import Collections from './Collections'
import Tempo from './Tempo'
import PlayerScreen from './PlayerScreen'

class App extends React.Component {
    constructor() {
        super()
        this.state = {
          screenStr: 'Collections',
          screen: <Collections />,
          idx: 0,
        }; 
    
        // this.nextTrack = this.nextTrack.bind(this);
        // this.prevTrack = this.prevTrack.bind(this);
      };

    render() {
        console.log(this.props)
        const homeLogout = this.state.screenStr === 'Collections' ? <a href="/auth/logout"><button>Logout</button></a> : <button onClick={() => this.setState({screen: <Collections />, screenStr: 'Collections'})}>Home</button>
        const createOrAddToCollection = this.state.screenStr === 'Collections' ? <button>Create Collection</button> :
        this.state.screenStr === 'PlayerScreen' ? <button>Add to Collection</button> : null;
        const clearListened = <button>Clear Listened</button>

        return (
            <div>
                <div className='topButtons'>{homeLogout}{createOrAddToCollection}</div>
                <div className='secondButtons'>{clearListened}</div>
                <div>
                    {this.state.screen}
                    <button onClick={() => this.setState({screen: <Tempo />, screenStr: 'Tempo'})}>TempoScr</button>
                    <button onClick={() => this.setState({screen: <PlayerScreen />, screenStr: 'PlayerScreen'})}>PlayerScr</button>
                </div>
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