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

            try {
                await axios.post('/auth/login', {uname: this.state.uname.toLowerCase(), pw: this.state.pw});
                window.location.reload()
                return;
            } catch (err) {
                this.setState({error: 'Wrong email/password combination.'})
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
            window.location.reload()
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
                <h1 id='mainTitle'>Tempo Music Player</h1>
            <div className='loginScreen'>
                <h1>{this.state.screen === 'login' ? 'Login' : 'Sign Up'}</h1>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <Input className='browseSongsInput' 
                                        sx={{
                                            fontSize: 16,
                                            color: 'white',
                                            ':not($focused)': { borderBottomColor: 'white' },
                                            ':before': { borderBottomColor: 'grey' },
                                            ':after': { borderBottomColor: 'white' },
                                            }} inputProps={{ spellCheck: false }} type='text' name='uname' placeholder='E-mail' onChange={this.handleChange} value={uname} />
                    </div>
                    <div>
                        <Input className='browseSongsInput' 
                                        sx={{
                                            fontSize: 16,
                                            color: 'white',
                                            ':not($focused)': { borderBottomColor: 'white' },
                                            ':before': { borderBottomColor: 'grey' },
                                            ':after': { borderBottomColor: 'white' },
                                            }} inputProps={{ spellCheck: false }} type={this.state.viewPw ? 'text' : 'password'} name='pw' placeholder='Password' onChange={this.handleChange} value={pw} />
                    </div>
                    <div className='modalErrorPadding'>{this.state.error}</div>
                    <div className='buttonsOnLogin'>
                        <StyledButton type="submit" title='Submit' value="Submit"/>
                        <div className='buttonSeparator'></div>
                        <StyledButton func={this.viewPw} title={this.state.viewPw ? 'Hide password' : 'View password'} />
                    </div>
                </form>
                <div className='spaceBelow'>
                    <StyledButton title={this.state.screen === 'login' ? 'Sign up instead' : 'Login instead'} func={this.state.screen === 'login' ? () => this.setState({screen: 'signup', error: null}) : () => this.setState({screen: 'login', error: null})} />
                </div>
                <div id='bottomLoginButton'>
                    <StyledButton func={this.enterAsGuest} title='Enter as Guest' />
                </div>
            </div>
            </div>
            </div>
        )
    }
}

export default Login