// App.js

import React, { Component } from 'react';
import {Route, Router, browserHistory} from 'react-router'
import Home from './Home'
import Signin from './Signin'
import Signup from './Signup'
import Project from './Project'
//import Add from './add.component';
//import GroceriesList from './groceriesList.component';

class App extends Component {

  render() {
    return (
        <Router history={browserHistory}>
            <Route path ='/' component={Home} />
            <Route path='/signin' component={Signin} />
            <Route path='/signup' component={Signup} />
            <Route path='/project/:oid' component={Project} />
        </Router>
    );
  }
}

export default App;