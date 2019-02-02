import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery'
import M from "materialize-css/dist/js/materialize.js";
import CreateProjectForm from './CreateProjectForm'
import JoinProjectForm from './JoinProjectForm'
import RemoveProjectForm from './RemoveProjectForm'
import {browserHistory} from 'react-router'

class ProjectList extends Component {
  constructor(props){
    super(props);
    this.state = {projectList : null, error : false, pending : false}
  }
  updateProjectList(){
    this.state = {projectList : null, error : false, pending : false}
    axios.get('http://localhost:3001/api/projectList')
    .then(res => {
        this.setState({projectList : res.data.projectList, error : false, pending : false})
        var elem = $('.fixed-action-btn');
        M.FloatingActionButton.init(elem, {});
        var elems = $('.tooltipped');
        M.Tooltip.init(elems, {});
    })
    .catch(err => {
        console.log(err)
        if(err && err.response && err.response.data){
            this.setState({projectList : null, error : err.response.data, pending : false});
        } else {
            this.setState({projectList : null, error : 'Network error', pending : false});
        }
    });
  }
  componentDidMount() {
    this.updateProjectList()
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

        if (this.state.projectList){
            projectListComponent = this.state.projectList.map((project, index) =>
                  <tr key={index}>
                    <td>{project.name}</td>
                    <td>{project.hasAuthorizedUsers}</td>
                    <td>{new Date(project.createdDate).toString().split('GMT')[0]}</td>
                    <td>
                        <a className="btn-floating waves-effect waves-light" onClick={() => browserHistory.push('/project/'+project.oid)}><i className="material-icons">folder_open</i></a>
                        <a className="btn-floating waves-effect waves-light white modal-trigger" href={"#modal_createproject_"+project.oid}>
                            <i className="material-icons rezbuild-text">close</i>
                        </a>
                        <RemoveProjectForm project={project} updateProjectList={this.updateProjectList.bind(this)}/>
                    </td>
                  </tr>
            );
        }
        return (
                 <div className='container white' style={{marginTop:'2rem'}}>
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
        );
  }
}

export default ProjectList;
