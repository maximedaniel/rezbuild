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
  { (context) => <RezbuildCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default RezbuildComponent
