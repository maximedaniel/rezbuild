import React, { Component } from 'react'
import SocketContext from './SocketContext'
import NavbarComponent from './NavbarComponent'
import ProjectListComponent from './ProjectListComponent'

class RezbuildCore extends Component {

  render() {
        return (
            <div>
                 <NavbarComponent path={['Projects']}/>
                 <ProjectListComponent />
            </div>
        );
  }

}

const RezbuildComponent = props => (
  <SocketContext.Consumer>
  {socket => <RezbuildCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default RezbuildComponent
