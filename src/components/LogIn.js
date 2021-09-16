import React from 'react'

class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            screen: 'login'
        }
    }

    render() {

        return (
            <div>
                <h1>{this.state.screen === 'login' ? 'Login' : 'Sign Up'}</h1>
                <form method="POST" action={this.state.screen === 'login' ? "/auth/login" : "/auth/register"}>
                    <div>
                    Enter Email:<input type='text' name='uname'></input>
                    </div>
                    <div>
                    Enter Password:<input type='password' name='pw'></input>
                    </div>
                    <input type="submit" value="Submit"></input>
                </form>
                <button onClick={this.state.screen === 'login' ? () => this.setState({screen: 'signup'}) : () => this.setState({screen: 'login'})}>{this.state.screen === 'login' ? 'Sign up instead' : 'Login instead'}</button>
            </div>
        )
    }
}

export default Login