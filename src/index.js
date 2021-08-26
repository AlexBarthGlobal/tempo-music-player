import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {Provider, connect} from 'react-redux'
import store from './ReduxStore'
import {render} from 'react-dom'
import {fetchUser} from './redux/isLogged'


const Main = class extends React.Component { 
  componentDidMount() {
    // this.props.fetchUser();
  }

  render() {
    return (
      <App />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchUser: () => dispatch(fetchUser())
})

const WrappedMain = connect(mapStateToProps, mapDispatchToProps)(Main)

render(
  <Provider store={store}>
  <React.StrictMode>
    <WrappedMain />
  </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
