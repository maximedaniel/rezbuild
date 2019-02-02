import React, { Component } from 'react'
import Navbar from './Navbar'
import ProjectList from './ProjectList'
import Project from './Project'

class Home extends Component {

  constructor(props){
   super(props)
  }

  render() {
        return  (
        <div>
            <Navbar path={['Projects']}/>
            <ProjectList/>
        </div>
        );
    }
}

export default Home;
