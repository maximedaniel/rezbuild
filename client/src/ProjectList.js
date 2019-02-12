import React, { Component } from 'react'
import axios from 'axios'
//import $ from 'jquery'
//import M from "materialize-css/dist/js/materialize.js";
import CreateProjectForm from './forms/CreateProjectForm'
import JoinProjectForm from './forms/JoinProjectForm'
import RemoveProjectForm from './forms/RemoveProjectForm'
import {browserHistory} from 'react-router'
import Navbar from './Navbar'

var $ = window.$


class ProjectList extends Component {
  constructor(props){
    super(props);
    this.state = {user: null, projectList : null, error : false, pending : false}
  }
  updateProjectList(){
    this.setState({user : null, projectList : null, error : false, pending : true})
    axios.get('/api/user/listauthorizedproject')
    .then(res => {
        this.setState({user: res.data.user, projectList : res.data.projectList, error : false, pending : false})
       // M.FloatingActionButton.init($('.fixed-action-btn'), {});
        //M.Tooltip.init($('.tooltipped'), {});
    })
    .catch(err => {
        console.log(err)
        if(err && err.response && err.response.data){
            this.setState({user : null,  projectList : null, error : err.response.data, pending : false});
            browserHistory.push('/signin')
        } else {
            this.setState({user : null,  projectList : null, error : 'Network error', pending : false});
        }
    });
  }
  componentDidMount() {
    this.updateProjectList()
    $('.modal').modal();
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
        let navbarComponent;

        if (this.state.user){
            navbarComponent =  <Navbar user={this.state.user} path={['Projects']}/>
        }

        let projectListComponent;

        if (this.state.projectList){
            projectListComponent = this.state.projectList.map((project, index) =>
                  <tr key={index}>
                    <td>{project.name}</td>
                    <td>{project.hasAuthorizedUsers}</td>
                    <td>{new Date(project.date).toString().split('GMT')[0]}</td>
                    <td>
                        <a className="btn-floating waves-effect waves-light" onClick={() => browserHistory.push('/project/'+project._id) }><i className="material-icons">folder_open</i></a>
                        <a className="btn-floating waves-effect waves-light white modal-trigger" href={"#modal_removeproject_"+project._id}>
                            <i className="material-icons rezbuild-text">close</i>
                        </a>
                        <RemoveProjectForm project={project} updateProjectList={this.updateProjectList.bind(this)}/>
                    </td>
                  </tr>
            );
        }
        return (
                <div>
                 {navbarComponent}
                 <div className='container white ' style={{marginTop:'2rem'}}>
                    <div className='row'>
                      <div className='col s12'>
                          <table>
                            <thead className='rezbuild-text'>
                              <tr style={{borderBottom: '2px solid #f7931e'}}>
                                  <th>Name</th>
                                  <th>Owner</th>
                                  <th>Last update</th>
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
                      <a className="btn-floating btn-large">
                        <i className="large material-icons">mode_edit</i>
                      </a>
                      <ul>
                        <li><a className="btn-floating tooltipped modal-trigger" href="#modal_joinproject" data-position="left" data-tooltip="Join a project"><i className="material-icons">publish</i></a></li>
                        <li><a className="btn-floating tooltipped modal-trigger" href="#modal_createproject" data-position="left" data-tooltip="Create a project"><i className="material-icons">add</i></a></li>
                      </ul>
                    </div>
                    <CreateProjectForm updateProjectList={this.updateProjectList.bind(this)}/>
                    <JoinProjectForm updateProjectList={this.updateProjectList.bind(this)}/>
                </div>
               </div>
        );
  }
}

export default ProjectList;
