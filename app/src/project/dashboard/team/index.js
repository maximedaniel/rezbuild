/**
 * @class Team
 * @extends Component
 * @description Create the team part of the dashboard
 */
import React, { Component } from 'react'
import SocketContext from '../../../SocketContext'
import AddUserForm from './addUserForm'
import ApproveMemberForm from './approveMemberForm'
import common from 'common'

class TeamCore extends Component {

  constructor(props){
    super(props);
    this.state = {users : null, usersToVerify : null,  error : false, pending : false}
  }

  
   // Fetch the users of the project
  fetch(){
    this.setState({users : null, usersToVerify : null, error : false, pending : true}, () => {
      var filter = {_id: this.props.project._id }
      this.props.socket.emit('/api/project/getfull', filter, res => {
          if(res.projects){
            this.setState({users : res.projects[0].users, usersToVerify : res.projects[0].usersToVerify, error : false, pending : false});
          }
          if(res.error){
              this.setState({users : null, usersToVerify : null, error : false, pending : false});
          }
      });
    })
  }

  componentDidMount() {
    this.fetch();
    this.props.socket.on('/api/project/done', res => {
      this.fetch()
     });
    this.props.socket.on('/api/user/done', res => {
      this.fetch()
    });
  }


  render() {
        let errorComponent;
        let preloaderComponent;
        let usersComponent;
        let usersToVerifyComponent;
        let addUserComponent;

        if (this.state.error){
            errorComponent = <div className="row">
                                <div className="col s12">
                                    <h6 className='rezbuild-text'>{this.state.error}</h6>
                                </div>
                            </div>
        }

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
        } else {

            if (this.state.users){

                usersComponent =
                <div>
                  {
                              this.state.users.map((collaborator, index) => {
                              return (
                                <div className="col s12" style={{marginBottom:'1rem', padding:'0'}} key={index}>
                                  <div  className="col s4 l4 left-align">
                                    <span className="title rezbuild-text" style={{fontWeight:'900'}}>{collaborator.firstname} {collaborator.lastname}</span>
                                  </div>
                                  <div  className="col s4  l4 left-align">
                                    {collaborator.roles.filter(role => common.ROLES.hasOwnProperty(role)).map(role => common.ROLES[role].name).join(', ')}
                                  </div>
                                  <div  className="col s2  l2 right-align">
                                  </div>
                                  <div  className="col s2  l2 right-align">
                                    <a href={"mailto:"+collaborator.email} className="btn secondary-content"><i className="material-icons right">email</i> EMAIL</a>
                                  </div>
                                </div>);
                          })
                        }
                </div>
            }

            if (this.state.usersToVerify && this.state.usersToVerify.length > 0){

              usersToVerifyComponent =
                      <div>
                        <h6 className="rezbuild-text">Collaborators requested to join the project:</h6>
                        {
                          this.state.usersToVerify.map((collaborator, index) => {
                              return (
                                <div className="col s12" style={{marginBottom:'1rem', padding:'0'}} key={index}>
                                  <div  className="col s4 l4 left-align">
                                    <span className="title rezbuild-text" style={{fontWeight:'900'}}>{collaborator.firstname} {collaborator.lastname}</span>
                                  </div>
                                  <div  className="col s4  l4 left-align">
                                    {collaborator.roles.filter(role => common.ROLES.hasOwnProperty(role)).map(role => common.ROLES[role].name).join(', ')}
                                  </div>
                                  <div  className="col s2  l2 right-align">
                                    <a className="btn waves-effect waves-light modal-trigger" href={"#modal_approvemember_" + this.props.project._id + "_" + collaborator._id}>Manage</a>
                                    <ApproveMemberForm project={this.props.project} user={collaborator}/>
                                  </div>
                                  <div  className="col s2  l2 right-align">
                                    <a href={"mailto:"+collaborator.email} className="btn secondary-content"><i className="material-icons right">email</i> EMAIL</a>
                                  </div>
                                </div>);
                          })
                        }
                        </div>
          }

          if (this.props.user._id == this.props.project.owner._id) {
            addUserComponent = 
            <div>
              <p><a className="btn waves-effect waves-light modal-trigger" href="#modal_adduser"><i className="material-icons left">person_add</i>Invite</a></p>
              <AddUserForm project={this.props.project} params={this.props.params}/>
            </div>
          }
        }

        return (
                <div className="col s12 white z-depth-1" style={{paddingTop:'0.5rem'}} >
                    {errorComponent}
                    {preloaderComponent}
                    {addUserComponent}
                    {usersComponent}
                    {usersToVerifyComponent}
               </div>
        );
  }
}

const TeamComponent = props => (
  <SocketContext.Consumer>
  { (context) => <TeamCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default TeamComponent;
