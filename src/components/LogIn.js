import React from 'react'
import axios from 'axios'

class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            screen: 'login',
            uname: '',
            pw: '',
            error: null,
            viewPw: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.viewPw = this.viewPw.bind(this)
    }

    async handleSubmit(evt) {
        evt.preventDefault()
        if (this.state.screen === 'login') {
            try {
                await axios.post('/auth/login', {uname: this.state.uname, pw: this.state.pw});
                window.location.reload()
            } catch (err) {
                this.setState({error: 'Wrong email/password combination.'})
            }
        } else {
            try {
                await axios.post('/auth/register', {uname: this.state.uname, pw: this.state.pw});
                await axios.post('/auth/login', {uname: this.state.uname, pw: this.state.pw});
                window.location.reload()
            } catch(err) {
                this.setState({error: 'Email already exists.'})
            }
        };
    };

    handleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        });
    };

    viewPw(evt) {
        evt.preventDefault()
        this.setState({viewPw: this.state.viewPw ? false : true})
    };

    render() {
        const { uname, pw } = this.state;
        return (
            <div className='centerThis'>
                <h1>{this.state.screen === 'login' ? 'Login' : 'Sign Up'}</h1>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <input type='text' name='uname' placeholder='E-mail' onChange={this.handleChange} value={uname}></input>
                    </div>
                    <div>
                        <input type={this.state.viewPw ? 'text' : 'password'} name='pw' placeholder='Password' onChange={this.handleChange} value={pw}></input>
                    </div>
                    <div>{this.state.error}</div>
                    <input type="submit" value="Submit"></input>
                    <button onClick={this.viewPw}>{this.state.viewPw ? 'Hide password' : 'View password'}</button>
                </form>
                <button onClick={this.state.screen === 'login' ? () => this.setState({screen: 'signup', error: null}) : () => this.setState({screen: 'login', error: null})}>{this.state.screen === 'login' ? 'Sign up instead' : 'Login instead'}</button>
            </div>
        )
    }
}

export default Login