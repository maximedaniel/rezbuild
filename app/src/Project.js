import React, { Component } from 'react'
import Navbar from './Navbar'
import Dashboard from './Dashboard'
import {browserHistory} from 'react-router'
import SocketContext from './SocketContext'


class ProjectCore extends Component {

  constructor(props){
    super(props);
    this.state = {user : null, project : null, error : false, pending : false}
    //{this.props.location.pathname}
  }

  componentDidMount(){
    this.setState({user: null, project: null, error : false, pending : false}, () => {
        this.props.socket.emit('/api/user/project', { _id: this.props.params._id });
        this.props.socket.on('/api/user/project', res => {
            if(res.project){
                this.setState({user : res.user, project : res.project, error : false, pending : false})
            }
            if(res.error){
                this.setState({user : null, project : null, error : res.error, pending : false}, () => {
                    browserHistory.push('/')
                });
            }
        });
    })
  }

  render() {
        let navbarComponent;

        if (this.state.user){
            navbarComponent =  <Navbar user={this.state.user} path={['Projects', this.state.project.name]}/>
        }

        return  (
        <div>
            {navbarComponent}
            { (this.state.project) ? <Dashboard project={this.state.project}/> : ''}
         </div>
        );
    }
}


const Project = props => (
  <SocketContext.Consumer>
  {socket => <ProjectCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default Project;