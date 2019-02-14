// App.js

import React, { Component } from 'react';
import {Route, Router, browserHistory} from 'react-router'
import SigninForm from './forms/SigninForm'
import SignupForm from './forms/SignupForm'
import Project from './Project'
import ProjectList from './ProjectList'
import openSocket from 'socket.io-client';
//import Add from './add.component';
//import GroceriesList from './groceriesList.component';
import SocketContext from './SocketContext'

const socket = openSocket('http://localhost:3001')

class App extends Component {
  render() {
    return (

        <div>
        <div style={
         {position:'fixed',
          top:0,
          bottom:0,
          zIndex:-1,
          minHeight: '100%',
          minWidth: '1024px',
          width:'100%',
          height:'auto',
          background: "url('/img/png/background.png') no-repeat center center fixed",
          opacity:0.2,
          backgroundSize:"cover"}}>
        </div>
         <SocketContext.Provider value={socket}>
        <Router history={browserHistory}>
            <Route path ='/' component={ProjectList} />
            <Route path='/signin' component={SigninForm} />
            <Route path='/signup' component={SignupForm} />
            <Route path='/project/:_id' component={Project} />
        </Router>
        </SocketContext.Provider>
       </div>
    );
  }
}

export default App;