import React, { Component } from 'react'
import Navbar from './Navbar'
import ProjectList from './ProjectList'

class Home extends Component {

  componentDidMount(){

  }

  render() {
        return  (
        <div>
            <Navbar />
            <ProjectList />
        </div>
        );
    }
}

export default Home;
