/**
 * @class ProjectList
 * @extends Component
 * @description Create the project list
 */
 import React, { Component } from 'react'
import CreateProjectForm from './createProjectForm'
import JoinProjectForm from './joinProjectForm'
import RemoveProjectForm from './removeProjectForm'
import {browserHistory} from 'react-router'
import SocketContext from '../../SocketContext'

var $ = window.$


class ProjectListCore extends Component {

  constructor(props){
    super(props);
    this.state = {projects : null, projectsToApprove : null, user : null, error : false, pending : false}
  }

  // Fetch the projects of the user
  fetch(){
    this.setState({projects : null, projectsToApprove : null, error : false, pending : true}, () => {
      var filter = {users: { "$in" : ["token"] } };
      this.props.socket.emit('/api/project/get', filter, (res) => {
        if (res.projects) {
          this.setState({projects : res.projects, user : res.user, error : false, pending : false})
        } else {
          if(res.error){
              this.setState({projects : null, user : null, error : res.error, pending : false})
          } else {
              this.setState({projects : null, user : null, error : 'Network error', pending : false})
          }
        }
        var filter2 = {usersToVerify: { "$in" : ["token"] } };
        this.props.socket.emit('/api/project/get', filter2, (res2) => {
          if (res2.projects) {
            this.setState({projectsToApprove : res2.projects, user : res.user, error : false, pending : false})
          }
        });
      });
    });
  }

  componentDidMount() {
    this.fetch();
    this.props.socket.on('/api/project/done', () => {this.fetch()});
  }

  componentDidUpdate(prevProps, prevState) {
      if (prevState.projects !== this.state.projects) {
            $('.modal').modal();
            $('.tooltipped').tooltip({delay:0, html:true});
      }
  }

  componentWillUnmount() {
    $('.tooltipped').tooltip('remove');
    this.props.socket.off('/api/project/done', () => {this.fetch()})
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
            projectListComponent = 
            <div className="col s12">
              <div className="col s2  l2 rezbuild-text left-align"> <h6>Name</h6> </div>
              <div className="col s3  l3 rezbuild-text left-align"> <h6>Owner</h6> </div>
              <div className="col s3  l3 rezbuild-text left-align"><h6>Creation Date</h6> </div>
              <div className="col s2  l2 rezbuild-text left-align"><h6>&nbsp;</h6> </div>
              <div className="col s2  l2 rezbuild-text left-align"><h6>&nbsp;</h6> </div>
             {
                this.state.projects.map((project, index) => {
                    return (
                      <div className="col s12" style={{marginBottom:'1rem', padding:'0'}} key={index}>
                        <div  className="col s2  l2 left-align">{project.name}</div>
                        <div  className="col s3  l3 left-align">{project.owner.firstname} {project.owner.lastname}</div>
                        <div  className="col s3  l3 left-align">{new Date(project.date).toString().split('GMT')[0]}</div>
                        <div  className="col s2  l2 left-align">
                          <a className="hide-on-large-only btn waves-effect waves-light" href="#!" onClick={() => browserHistory.push('/'+project._id) }><i className="material-icons">open_in_browser</i></a>
                          <a className="hide-on-med-and-down btn waves-effect waves-light" href="#!" onClick={() => browserHistory.push('/'+project._id) }> Open <i className="material-icons right">open_in_browser</i></a>
                        </div>
                        { (project.owner._id !== this.state.user._id) ?
                          <div  className="col s2  l2 left-align">
                            <a className="hide-on-large-only btn waves-effect waves-light white rezbuild-text" href={"#modal_removeproject_"+project._id}><i className="material-icons">remove_circle</i></a>
                            <a className="hide-on-med-and-down btn waves-effect waves-light white rezbuild-text" href={"#modal_removeproject_"+project._id}><i className="material-icons left">remove_circle</i> Remove</a>
                          </div>
                          : ''
                        }
                        <RemoveProjectForm project={project}/>
                      </div>);
                })
              }
           </div>
        }

        let projectToApproveListComponent;

        if (this.state.projectsToApprove && this.state.projectsToApprove.length != 0){
          projectToApproveListComponent = 
            <div>
            <div><h5 className="rezbuild-text">Pending join requests</h5></div>
            <div className="col s12">
              <div className="col s2  l2 rezbuild-text left-align"> <h6>Name</h6> </div>
              <div className="col s3  l3 rezbuild-text left-align"> <h6>Owner</h6> </div>
              <div className="col s3  l3 rezbuild-text left-align"><h6>Creation Date</h6> </div>
              <div className="col s2  l2 rezbuild-text left-align"><h6>&nbsp;</h6> </div>
              <div className="col s2  l2 rezbuild-text left-align"><h6>&nbsp;</h6> </div>
             {
                this.state.projectsToApprove.map((project, index) => {
                    return (
                      <div className="col s12" style={{marginBottom:'1rem', padding:'0'}} key={index}>
                        <div  className="col s2  l2 left-align">{project.name}</div>
                        <div  className="col s3  l3 left-align">{project.owner.firstname} {project.owner.lastname}</div>
                        <div  className="col s3  l3 left-align">{new Date(project.date).toString().split('GMT')[0]}</div>
                        <div  className="col s2  l2 left-align">
                        </div>
                        <div  className="col s2  l2 left-align">
                          <a className="hide-on-large-only btn waves-effect waves-light white rezbuild-text" href={"#modal_removeproject_"+project._id}><i className="material-icons">remove_circle</i></a>
                          <a className="hide-on-med-and-down btn waves-effect waves-light white rezbuild-text" href={"#modal_removeproject_"+project._id}><i className="material-icons left">remove_circle</i> Remove</a>
                        </div>
                        <RemoveProjectForm project={project}/>
                      </div>);
                })
              }
           </div>
           </div>
            
        }

        let actionComponent;
        if (this.state.projects){
          actionComponent = 
          <div>
            <div className= 'col s4 left-align'>
                <h5 className="rezbuild-text">Project List</h5>
            </div>
            <div className= 'col s8 right-align' style={{paddingTop:'0.5rem'}}>  
                <a  className="hide-on-med-and-up btn modal-trigger"                      href="#modal_createproject"><i className="material-icons">add_box</i></a>
                <a  className="hide-on-med-and-up btn white rezbuild-text modal-trigger"  href="#modal_joinproject" style={{marginLeft:'1rem'}}><i className="material-icons">add_to_photos</i></a>
                <a  className="hide-on-small-only btn modal-trigger"                      href="#modal_createproject"><i className="material-icons right">add_box</i> NEW</a>
                <a  className="hide-on-small-only btn white rezbuild-text modal-trigger"  href="#modal_joinproject" style={{marginLeft:'1rem'}}><i className="material-icons left">add_to_photos</i>JOIN</a>
                {/* <a  className="hide-on-small-only btn white rezbuild-text modal-trigger"  href="#" onClick = {() => $('#modal_joinproject').modal('show')} style={{marginLeft:'1rem'}}><i className="material-icons left">add_to_photos</i>JOIN</a> */}
             </div>
          </div>
        }

        if (this.state.projects){
          return (
          <div className='container' style={{marginTop:'2rem'}}>
              <div className='row'>
                <div className='section col s12'>
                  <div className= 'section col s12 transparent'  style={{marginBottom:'1rem'}}>
                            {actionComponent}
                  </div>
                  <div className='section col s12 white z-depth-1' style={{paddingTop:'0.5rem'}}>
                          {projectListComponent}
                  </div>
                  <div className='section col s12 white z-depth-1' style={{paddingTop:'0.5rem'}}>
                          {projectToApproveListComponent}
                  </div>
                  <div className='section col s12 center'>
                            {preloaderComponent}
                  </div>
                  <div className='section col s12 center'>
                      {errorComponent}
                  </div>
                </div>
            </div>
            <CreateProjectForm/>
            <JoinProjectForm/>
          </div>
          )
        } else return <div/>;
  }
}

const ProjectListComponent = props => (
  <SocketContext.Consumer>
  { (context) => <ProjectListCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default ProjectListComponent
