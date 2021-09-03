import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Provider, connect} from 'react-redux'
import store from './ReduxStore'
import {render} from 'react-dom'
import {fetchUser} from './redux/isLogged'
import {fetchCollectionsAndSessions} from './redux/collections'
import Routes from './components/Routes'
import { BrowserRouter as Router, withRouter } from 'react-router-dom'


const Main = class extends React.Component { 
  async componentDidMount() {
      await this.props.fetchUser();
      await this.props.fetchCollectionsAndSessions();
  }

  render() {
    if (this.props.user.isFetching || this.props.collections.isFetching) {
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
    collections: state.collectionReducer.collections
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
