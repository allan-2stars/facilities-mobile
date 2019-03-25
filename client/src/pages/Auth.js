import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import AuthContext from '../context/auth-context';

import * as graphql from '../graphql';

class AuthPage extends Component {
  state = {
    isLogin: true
  };

  // use Context
  // name convension use contextType
  // and use this.context to assign value
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.passwordConfirmEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = event => {
    // prevent default behaviour
    event.preventDefault();

    // create a new apollo client for graphql
    const client = new ApolloClient({
      uri: 'http://localhost:8000/graphql'
    });
    // get values for input
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    const role = 'Restricted'; // default value
    const active = true; // default value

    // input validation
    // TODO: Validation show up on page in red
    if (email.trim().length === 0 || password.trim().length === 0) {
      console.log('email or password cannot be empty.');
      return;
    }
    if (!this.state.isLogin) {
      const passwordConfirm = this.passwordConfirmEl.current.value;
      if (passwordConfirm.trim() !== password.trim()) {
        console.log('confirmed password not match.');
        return;
      }
    }

    // Login user
    if (this.state.isLogin) {
      client
        .query({
          query: graphql.LOG_IN,
          variables: {
            email,
            password
          }
        })
        .then(res => {
          if (res.loading) {
            return <h1>Loading...</h1>;
          }
          return res;
        })
        .then(resData => {
          if (resData.data.login) {
            this.context.login(
              resData.data.login.token,
              resData.data.login.userId,
              resData.data.login.tokenExpiration
            );
          }
        })
        .catch(err => {
          console.log('Errors Happening:', err);
        });
    }

    // Create new user
    if (!this.state.isLogin) {
      client
        .mutate({
          mutation: graphql.CREATE_USER,
          variables: {
            email,
            password,
            role,
            active
          }
        })
        .then(res => {
          this.setState({ isLogin: true });
          // redirect to login page
          console.log('create user successful.', res.data);
        })
        .catch(err => {
          console.log('Errors Happening:', err);
        });
    }
    ///
  };
  ///
  render() {
    // Confirm password for Sign up page
    let confirmPassword = '';
    if (!this.state.isLogin) {
      confirmPassword = (
        <div className='form-group'>
          <label htmlFor='password2'>Confirm Password</label>
          <input
            className='form-control'
            type='password'
            id='password2'
            ref={this.passwordConfirmEl}
          />
        </div>
      );
    }
    return (
      <div className='auth'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-8 m-auto'>
              <form onSubmit={this.submitHandler}>
                <div className='text-right'>
                  <button
                    className='btn btn-primary text-right mt-3'
                    type='button'
                    onClick={this.switchModeHandler}
                  >
                    Switch to {this.state.isLogin ? 'Sign Up' : 'Login'}
                  </button>
                </div>

                <div className='form-group'>
                  <label htmlFor='email'>Email</label>
                  <input
                    className='form-control'
                    type='email'
                    id='email'
                    ref={this.emailEl}
                  />
                  <small id='emailHelp' className='form-text text-muted'>
                    We'll never share your email with anyone else.
                  </small>
                </div>
                <div className='form-group'>
                  <label htmlFor='password'>Password</label>
                  <input
                    className='form-control'
                    type='password'
                    id='password'
                    ref={this.passwordEl}
                  />
                </div>
                {confirmPassword}

                <button className='btn btn-info btn-block mt-4' type='submit'>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AuthPage;
