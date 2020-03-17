// App.js

import React, { Component } from 'react'
import {Route, Router, browserHistory} from 'react-router'
import SigninForm from './signinForm'
import SignupForm from './signupForm'
import Home from './home'
import Project from './project'
import TechnologyLibrary from './technologyLibrary'
import io from 'socket.io-client';
import SocketIOFileUpload  from 'socketio-file-upload'
import SocketContext from './SocketContext'

/**
 * @class App
 * @extends Component
 * @description Create the routes of the REZBUILD application
 */
class App extends Component {

  constructor(props){
    super(props);
    let {host} = window.location
    if(host.indexOf(':') !== -1){
        host = host.replace('3000','3001')
    } else {
        host = host.replace('app','api')
    }
    var socket = io(host)
    var uploader = new SocketIOFileUpload(socket);
    this.state = {host, socket, uploader}
  }

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
         <SocketContext.Provider value={this.state}>
            <Router history={browserHistory}>
                    <Route path ='/' component={Home} />
                    <Route path='/signin' component={SigninForm} />
                    <Route path='/signup' component={SignupForm} />
                    <Route path='/technologies' component={TechnologyLibrary} />
                    <Route path='/:_id' component={Project} />
                    <Route path='/:_id/signin' component={SigninForm} />
                    <Route path='/:_id/signup' component={SignupForm} />
            </Router>
         </SocketContext.Provider>
       </div>
    );
  }
}
export default App;