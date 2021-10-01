import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Provider, connect} from 'react-redux'
import store from './ReduxStore'
import {render} from 'react-dom'
import {fetchUser} from './redux/userDispatchers'
import {fetchCollectionsAndSessions, fetchActiveCollectionSongs, applySongsInRange} from './redux/musicDispatchers'
import Routes from './components/Routes'
import { BrowserRouter as Router, withRouter, Redirect } from 'react-router-dom'
import songsInRange from './components/songsInRange'

const Main = class extends React.Component { 

  async componentDidMount() {
      await this.props.fetchUser();
      if (this.props.user.id) await this.props.fetchCollectionsAndSessions();
      if (this.props.musicInfo.activeSession) {
        await this.props.fetchActiveCollectionSongs(this.props.musicInfo.activeSession.collectionId); // Put all active collection songs onto redux.
        if (this.props.musicInfo.collections[this.props.musicInfo.activeSession.collectionId].songs.size) {
          const results = songsInRange(this.props.user.listened.songs, this.props.musicInfo.collections[this.props.musicInfo.activeSession.collectionId].songs, this.props.musicInfo.activeSession.currBPM)  //Run this when updating BPM
          this.props.applySongsInRange(results[0]);
        }
      }
  }

  render() {
    const isFetching = () => {
      if (this.props.user.isFetching) return true;
      if (this.props.musicInfo && this.props.musicInfo.isFetching) return true;
      return false;
    };

    if (isFetching()) {
      return (
        //Loading animation while user is fetching when they refresh the page
        <h1></h1>
      )
    }

    return (
      <Routes props={this.props}/>
    )
  }
}

const mapStateToProps = (state) => {
  console.log('State (not props) from index.js', state)
  return {
    user: state.userReducer.user,
    musicInfo: state.musicReducer
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchUser: () => dispatch(fetchUser()),
  fetchCollectionsAndSessions: () => dispatch(fetchCollectionsAndSessions()),
  fetchActiveCollectionSongs: (activeCollectionId) => dispatch(fetchActiveCollectionSongs(activeCollectionId)),
  applySongsInRange: (songs) => dispatch(applySongsInRange(songs))
})

const WrappedMain = withRouter(connect(mapStateToProps, mapDispatchToProps)(Main))

render(
  <Provider store={store}>
  <Router>
    <WrappedMain />
  </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
