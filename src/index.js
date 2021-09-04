import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Provider, connect} from 'react-redux'
import store from './ReduxStore'
import {render} from 'react-dom'
import {fetchUser} from './redux/isLogged'
import {fetchCollectionsAndSessions} from './redux/musicInfoReducer'
import Routes from './components/Routes'
import { BrowserRouter as Router, withRouter, Redirect } from 'react-router-dom'

const Main = class extends React.Component { 

  async componentDidMount() {
      await this.props.fetchUser();
      if (this.props.user.id) await this.props.fetchCollectionsAndSessions();
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
  console.log(state)
  return {
    user: state.userReducer.user,
    musicInfo: state.musicInfoReducer
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchUser: () => dispatch(fetchUser()),
  fetchCollectionsAndSessions: () => dispatch(fetchCollectionsAndSessions())
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
