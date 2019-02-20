import React, { Component } from 'react'
import SocketContext from './SocketContext'
import AddUserForm from './forms/AddUserForm'

class CollaboratorListCore extends Component {

  constructor(props){
    super(props);
    this.state = {authorizedUsers : null,  error : false, pending : false}
  }

  updateAuthorizedUsers(){
    this.setState({authorizedUsers : null, error : false, pending : true}, () => {
        this.props.socket.emit('/api/user/authorizedusersproject', { pid: this.props.project._id });
        this.props.socket.on('/api/user/authorizedusersproject', res => {
            console.log(res)
            if(res.authorizedUsers){
                this.setState({authorizedUsers : res.authorizedUsers, error : false, pending : false})
            }
            if(res.error){
                this.setState({authorizedUsers : null, error : false, pending : false});
            }
        });
    })
  }

  componentDidMount() {
    this.updateAuthorizedUsers()
    this.props.socket.on('/api/user/adduserproject', res => {
        this.updateAuthorizedUsers()
     });
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

        let authorizedUsersComponent;

        if (this.state.authorizedUsers){

            authorizedUsersComponent =
                    this.state.authorizedUsers.map((collaborator, index) => <div className="col s12 rezbuild-text" key={index}> {collaborator.firstname} {collaborator.lastname} ({collaborator.roles})</div>)
        }
        return (
                <div>
                    {authorizedUsersComponent}
                    {preloaderComponent}
                    {errorComponent}
                    <a className="btn-floating waves-effect waves-light modal-trigger" href="#modal_adduser">
                    <i className="material-icons">add</i>
                    </a>
                    <AddUserForm project={this.props.project} params={this.props.params}/>
               </div>
        );
  }
}

const CollaboratorList = props => (
  <SocketContext.Consumer>
  {socket => <CollaboratorListCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default CollaboratorList;
