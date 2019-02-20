// App.js

import React, { Component } from 'react';
import {Route, Router, browserHistory} from 'react-router'
import SigninForm from './forms/SigninForm'
import SignupForm from './forms/SignupForm'
import Project from './Project'
import ProjectList from './ProjectList'
import io from 'socket.io-client';
//import Add from './add.component';
//import GroceriesList from './groceriesList.component';
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
    this.state = {socket: io(host)}
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
         <SocketContext.Provider value={this.state.socket}>
            <Router history={browserHistory}>
                    <Route path ='/' component={ProjectList} />
                    <Route path='/signin' component={SigninForm} />
                    <Route path='/signup' component={SignupForm} />
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