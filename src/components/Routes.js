import React from "react";
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from "react-router-dom";
import Login from '../components/LogIn'
import App from '../components/App'

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route exact path='/login' component={Login} />
                <Route path='/' component={App} />
            </Switch>
        </Router>
    )
}

export default Routes