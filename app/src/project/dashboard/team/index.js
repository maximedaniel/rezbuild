/**
 * @class Team
 * @extends Component
 * @description Create the team part of the dashboard
 */
import React, { Component } from 'react'
import SocketContext from '../../../SocketContext'
import AddUserForm from './addUserForm'
import common from 'common'

class TeamCore extends Component {

  constructor(props){
    super(props);
    this.state = {users : null,  error : false, pending : false}
  }

  
   // Fetch the users of the project
  fetch(){
    this.setState({users : null, error : false, pending : true}, () => {
        var filter = {_id: this.props.project._id }
        this.props.socket.emit('/api/project/get', filter, res => {
            if(res.projects){
                var filter = {_id: { "$in" : res.projects[0].users}}
                this.props.socket.emit('/api/user/get', filter, res => {
                    if(res.users){
                        this.setState({users : res.users, error : false, pending : false})
                    }
                    if(res.error){
                        this.setState({users : null, error : false, pending : false});
                    }
                });
            }
            if(res.error){
                this.setState({users : null, error : false, pending : false});
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
        let addUserFormComponent;
        let addUserButtonComponent;

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
                        <ul className="collection" style={{border:0}}>
                        {this.state.users.map((collaborator, index) =>
                            <li className="collection-item avatar" key={index}>
                              <i className="medium material-icons circle white rezbuild-text" style={{fontSize:'42px'}}>account_circle</i>
                              <span className="title rezbuild-text" style={{fontWeight:'900'}}>{collaborator.firstname} {collaborator.lastname}</span>
                              <p>
                              {
                                collaborator.roles
                                .filter(role => common.ROLES.hasOwnProperty(role))
                                .map(role => common.ROLES[role].name)
                                .join(', ')
                              }
                              </p>
                              <a href={"mailto:"+collaborator.email} className="btn secondary-content"><i className="material-icons right">email</i> EMAIL</a>
                            </li>
                        )}
                        </ul>

            }

            addUserButtonComponent = <a className="btn waves-effect waves-light modal-trigger" href="#modal_adduser">
                    <i className="material-icons left">person_add</i>
                    Invite
                    </a>
            addUserFormComponent =  <AddUserForm project={this.props.project} params={this.props.params}/>
        }





        return (
                <div className="col s12 white z-depth-1" style={{paddingTop:'0.5rem'}} >
                    {errorComponent}
                    {preloaderComponent}
                    {addUserButtonComponent}
                    {addUserFormComponent}
                    {usersComponent}
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
