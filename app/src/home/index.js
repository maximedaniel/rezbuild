
/**
 * @class Home
 * @extends Component
 * @description Create the home page
 */

import React, { Component } from 'react'
import SocketContext from '../SocketContext'
import NavbarComponent from '../navbar'
import ProjectListComponent from './projectList'

class HomeCore extends Component {
  render() {
        return (
            <div>
                 <NavbarComponent path={['Projects']}/>
                 <ProjectListComponent />
            </div>
        );
  }

}

const Home = props => (
  <SocketContext.Consumer>
  { (context) => <HomeCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default Home
