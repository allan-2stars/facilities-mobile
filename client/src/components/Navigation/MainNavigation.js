import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
//import './MainNavigation.css';

const mainNavigation = props => (
  <AuthContext.Consumer>
    {/* // Consumer will get the context value */}
    {context => {
      return (
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
          <Link to='/' className='navbar-brand'>
            FF Training
          </Link>
          <div className='collapse navbar-collapse '>
            <ul className='nav navbar-nav navbar-right'>
              {/* // only rendered Authenticate while not authenticated */}
              {!context.token && (
                <li className='nav-item'>
                  <NavLink className='nav-link' to='/auth'>
                    Authenticate
                  </NavLink>
                </li>
              )}
              <li className='nav-item'>
                <NavLink className='nav-link' to='/events'>
                  Events
                </NavLink>
              </li>
              {/* // only rendered after authenticated */}
              {context.token && (
                <React.Fragment>
                  <li className='nav-item'>
                    <NavLink className='nav-link' to='/courses'>
                      Courses
                    </NavLink>
                  </li>
                  <li className='nav-item'>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </div>
        </nav>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
