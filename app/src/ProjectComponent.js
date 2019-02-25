import React, { Component } from 'react'
import SocketContext from './SocketContext'
import NavbarComponent from './NavbarComponent'
import DashboardComponent from './DashboardComponent'
import {browserHistory} from 'react-router'

class ProjectCore extends Component {

  constructor(props){
    super(props);
    this.state = {project : null, error : false, pending : false}
  }

  componentDidMount(){
    this.setState({project: null, error : false, pending : false}, () => {
        var filter = { _id: this.props.params._id }
        this.props.socket.emit('/api/project/get', filter, res => {
            if(res.projects){
                this.setState({project : res.projects[0], error : false, pending : false})
            }
            if(res.error){
                this.setState({project : null, error : res.error, pending : false}, () => {
                    browserHistory.push('/')
                });
            }
        });
    })
  }

  render() {
        return  (
        <div>
            {(this.state.project) ? <NavbarComponent path={['Projects', this.state.project.name]}/> : ''}
            {(this.state.project) ? <DashboardComponent project={this.state.project} params={this.props.params} />  : ''}
         </div>
        );
    }
}

const ProjectComponent = props => (
  <SocketContext.Consumer>
  {socket => <ProjectCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default ProjectComponent
