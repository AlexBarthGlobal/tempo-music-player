import React from 'react'

const Login = (props) => {
    return (
        <div>
            <h1>Login</h1>
            <form method="POST" action="/auth/login">
                <div>
                Enter Username:<input type='text' name='uname'></input>
                </div>
                <div>
                Enter Password:<input type='password' name='pw'></input>
                </div>
                <input type="submit" value="Submit"></input>
            </form>
        </div>
  )
}

export default Login