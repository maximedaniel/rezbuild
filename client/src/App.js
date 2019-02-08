// App.js

import React, { Component } from 'react';
import {Route, Router, browserHistory} from 'react-router'
import SigninForm from './forms/SigninForm'
import SignupForm from './forms/SignupForm'
import Project from './Project'
import ProjectList from './ProjectList'
//import Add from './add.component';
//import GroceriesList from './groceriesList.component';

class App extends Component {

  render() {
    return (
        <Router history={browserHistory}>
            <Route path ='/' component={ProjectList} />
            <Route path='/signin' component={SigninForm} />
            <Route path='/signup' component={SignupForm} />
            <Route path='/project/:_id' component={Project} />
        </Router>
    );
  }
}

export default App;