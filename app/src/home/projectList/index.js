import React, { Component } from 'react'
import CreateProjectForm from './createProject'
import JoinProjectForm from './joinProject'
import RemoveProjectForm from './removeProject'
import {browserHistory} from 'react-router'
import SocketContext from '../../SocketContext'

var $ = window.$


class ProjectListCore extends Component {

  constructor(props){
    super(props);
    this.state = {projects : null, error : false, pending : false}
  }

  update(){
    this.setState({projects : null, error : false, pending : true}, () => {
        var filter = {users: { "$in" : ["token"] } }
        this.props.socket.emit('/api/project/get', filter, (res) => {
            if (res.projects) {
                this.setState({projects : res.projects, error : false, pending : false})
            }
            else {
                if(res.error){
                    this.setState({projects : null, error : res.error, pending : false})
                } else {
                    this.setState({projects : null, error : 'Network error', pending : false})
                }
            }
        });
    })
  }

  componentDidMount() {
    this.update()
    this.props.socket.on('/api/project/done', () => {this.update()})
  }

  componentDidUpdate(prevProps, prevState) {
      if (prevState.projects !== this.state.projects) {
            $('.modal').modal();
      }
  }

  render() {
        let preloaderComponent;

        if (this.state.pending){
            preloaderComponent = <div className="preloader-wrapper small active">
                                    <div className="spinner-layer">
                                      <div className="circle-clipper left">
                                        <div className="circle"></div>
                                      </div><div className="gap-patch">
                                        <div className="circle"></div>
                                      </div><div className="circle-clipper right">
                                        <div className="circle"></div>
                                      </div>
                                    </div>
                                  </div>
        }

        let errorComponent;

        if (this.state.error){
            errorComponent = <div className="row">
                                <div className="col s12">
                                    <h6 className='rezbuild-text'>{this.state.error}</h6>
                                </div>
                            </div>

        }

        let projectListComponent;

        if (this.state.projects){
            projectListComponent = this.state.projects.map((project, index) =>
                  <tr key={index}>
                    <td>{project.name}</td>
                    <td>{project.hasAuthorizedUsers}</td>
                    <td>{new Date(project.date).toString().split('GMT')[0]}</td>
                    <td>
                        <a className="btn-floating waves-effect waves-light" href="#!" onClick={() => browserHistory.push('/'+project._id) }><i className="material-icons">folder_open</i></a>
                        <a className="btn-floating waves-effect waves-light white modal-trigger" href={"#modal_removeproject_"+project._id}>
                            <i className="material-icons rezbuild-text">close</i>
                        </a>
                        <RemoveProjectForm project={project}/>
                    </td>
                  </tr>
            );
        }
        return (
                 <div className='container transparent' style={{marginTop:'2rem'}}>
                    <div className='row'>
                      <div className='col s12'>
                          <table>
                            <thead className='rezbuild-text'>
                              <tr style={{borderBottom: '2px solid #f7931e'}}>
                                  <th>Name</th>
                                  <th>Owner</th>
                                  <th>Creation date</th>
                                  <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                               {projectListComponent}
                            </tbody>
                          </table>
                      </div>
                    </div>
                    {preloaderComponent}
                    {errorComponent}
                    <div className="fixed-action-btn">
                      <a className="btn-floating btn-large" href="#!">
                        <i className="large material-icons">mode_edit</i>
                      </a>
                      <ul>
                        <li><a className="btn-floating tooltipped modal-trigger" href="#modal_joinproject" data-position="left" data-tooltip="Join a project"><i className="material-icons">publish</i></a></li>
                        <li><a className="btn-floating tooltipped modal-trigger" href="#modal_createproject" data-position="left" data-tooltip="Create a project"><i className="material-icons">add</i></a></li>
                      </ul>
                    </div>
                    <CreateProjectForm/>
                    <JoinProjectForm/>
                </div>
        );
  }
}

const ProjectListComponent = props => (
  <SocketContext.Consumer>
  { (context) => <ProjectListCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default ProjectListComponent
