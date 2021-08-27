import React from 'react'
import {connect} from 'react-redux'
import {login} from '../redux/isLogged'

const Login = class extends React.Component {

    componentDidMount() {
        console.log(this.props)
    }

  render() {
      
    return (
    <form onSubmit={this.props.handleSubmit}>
      <div className='flex column'>
        <div className='flex column m1'>
          <label htmlFor='email'>Email</label>
          <input type='uname' name='uname' className='input' />
        </div>
        <div className='flex column m1'>
          <label htmlFor='email'>Password</label>
          <input type='pw' name='pw' className='input' />
        </div>
        <div className='m1'>
          <button type='submit' className='btn bg-blue white p1 rounded'>Submit</button>
        </div>
      </div>
    </form>
  )
}
}


const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        async handleSubmit(evt) {
            evt.preventDefault()
            const uname = evt.target.uname.value
            const pw = evt.target.pw.value
            await dispatch(login({uname, pw}))
            ownProps.history.push('/');
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)