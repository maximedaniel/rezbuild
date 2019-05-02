// App.js

import React, { Component } from 'react';
import {Route, Router, browserHistory} from 'react-router'
import SigninForm from './forms/SigninForm'
import SignupForm from './forms/SignupForm'
import RezbuildComponent from './RezbuildComponent'
import ProjectComponent from './ProjectComponent'
import io from 'socket.io-client';
import SocketIOFileUpload  from 'socketio-file-upload';
import SocketContext from './SocketContext'

class App extends Component {

  constructor(props){
    super(props);
    let {host} = window.location
    if(host.indexOf(':') !== -1){
        console.log("running on localhost...")
        console.log("before : ", host)
        host = host.replace('3000','3001')
        console.log("after : ", host)
    } else {
        console.log("running on distanthost...")
        console.log("before : ", host)
        host = host.replace('app','api')
        console.log("after : ", host)
    }
    var socket = io(host)
    var uploader = new SocketIOFileUpload(socket);
    this.state = {socket, uploader}
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
                    <Route path ='/' component={RezbuildComponent} />
                    <Route path='/signin' component={SigninForm} />
                    <Route path='/signup' component={SignupForm} />
                    <Route path='/:_id' component={ProjectComponent} />
                    <Route path='/:_id/signin' component={SigninForm} />
                    <Route path='/:_id/signup' component={SignupForm} />
            </Router>
         </SocketContext.Provider>
       </div>
    );
  }
}

export default App;