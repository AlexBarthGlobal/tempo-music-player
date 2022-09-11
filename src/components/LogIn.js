import React from 'react'
import axios from 'axios'
import StyledButton from './StyledButton';
import Input from '@mui/material/Input';
import * as EmailValidator from 'email-validator'
import PasswordValidator from '../../functions/server/lib/validatePw'

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
        this.enterAsGuest = this.enterAsGuest.bind(this)
    }

    async handleSubmit(evt) {
        evt.preventDefault()

        if (this.state.screen === 'login') {    // LOGIN
            if (!EmailValidator.validate(this.state.uname)) {
                this.setState({error: "That's not a valid email address."})
                return;
            };

            if (!this.state.pw.length) {
                this.setState({error: 'Please enter a password.'})
                return;
            }

            try {
                await axios.post('/auth/login', {uname: this.state.uname.toLowerCase(), pw: this.state.pw});
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
                
                return;
            } catch (err) {
                this.setState({error: 'Invalid email/password combination.'})
            }
        } else {    // SIGN UP
            if (!EmailValidator.validate(this.state.uname) || this.state.uname.includes('@tempomusicplayer.io')) {
                this.setState({error: "That's not a valid email address."})
                return;
            };

            if (!PasswordValidator.validate(this.state.pw)) {
                this.setState({error: "Choose a stronger password."})
                return;
            };

            try {
                await axios.post('/auth/register', {uname: this.state.uname.toLowerCase(), pw: this.state.pw});
                window.location.reload()
            } catch(err) {
                this.setState({error: 'Email already exists.'})
            };
        };
    };

    async enterAsGuest() {  // GUEST ENTER
        try {
            await axios.post('/auth/enterAsGuest')
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (err) {
            console.log(err)
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
            <div id='loginOutermostWrapper'>
            
            <div id='loginScreenWrapper'>
            <div className='loginScreen'>
                    <h1 id='mainTitle'>Tempo Music Player</h1>
                <form onSubmit={this.handleSubmit} id='loginForm'>
                    <div>
                        <Input className='browseSongsInput' 
                                        sx={{
                                            width: '100%',
                                            fontSize: 16,
                                            color: 'white',
                                            ':not($focused)': { borderBottomColor: 'white' },
                                            ':$focused': {borderBottomColor: 'orange'},
                                            ':before': { borderBottomColor: 'rgb(255 255 255 / 50%)'},
                                            ':after': { borderBottomColor: 'white' }, 
                                            }} inputProps={{ spellCheck: false }} type='text' name='uname' placeholder='E-mail' onChange={this.handleChange} value={uname} />
                    </div>
                    <div>
                        <Input className='browseSongsInput' 
                                        sx={{
                                            width: '100%',
                                            fontSize: 16,
                                            color: 'white',
                                            ':not($focused)': { borderBottomColor: 'white' },
                                            ':before': { borderBottomColor: 'rgb(255 255 255 / 50%)' },
                                            ':after': { borderBottomColor: 'white' },
                                            }} inputProps={{ spellCheck: false }} type={this.state.viewPw ? 'text' : 'password'} name='pw' placeholder='Password' onChange={this.handleChange} value={pw} />
                    </div>
                    <div className='loginErrorPadding'>{this.state.error}</div>
                    <div className='buttonsOnLogin'>
                            <StyledButton type="submit" width='100%' title={this.state.screen === 'login' ? 'Log in' : 'Sign up'} value="Submit"/>
                    </div>
                </form>
                <div id='loginBelowButtons'>
                    <StyledButton func={this.enterAsGuest} width='100%' title='Enter as Guest' />
                    <div id='loginAltButtons'>
                        <span onClick={this.viewPw} className='loginAltButton'>{this.state.viewPw ? 'Hide Password' : 'View Password'}</span><span className='loginAltButton' onClick={this.state.screen === 'login' ? () => this.setState({ screen: 'signup', error: null }) : () => this.setState({ screen: 'login', error: null })}>{this.state.screen === 'login' ? 'Sign up' : 'Log in'}</span>
                    </div>
                </div>
            </div>
            </div>
            </div>
        )
    }
}

export default Login