import React, { Component } from 'react'
import SocketContext from './SocketContext'
import NavbarComponent from './NavbarComponent'
import ProjectListComponent from './ProjectListComponent'

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

const HomeComponent = props => (
  <SocketContext.Consumer>
  { (context) => <HomeCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default HomeComponent
