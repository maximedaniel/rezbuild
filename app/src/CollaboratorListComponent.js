import React, { Component } from 'react'
import SocketContext from './SocketContext'
import AddUserForm from './forms/AddUserForm'

class CollaboratorListCore extends Component {

  constructor(props){
    super(props);
    this.state = {users : null,  error : false, pending : false}
  }

  update(){
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
    this.update()
    this.props.socket.on('/api/project/done', res => {
        this.update()
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
                        this.state.users.map((collaborator, index) => <div className="col s12 rezbuild-text" key={index}> {collaborator.firstname} {collaborator.lastname} ({collaborator.roles})</div>)
            }

            addUserButtonComponent = <a className="btn-floating waves-effect waves-light modal-trigger" href="#modal_adduser">
                    <i className="material-icons">add</i>
                    </a>
            addUserFormComponent =  <AddUserForm project={this.props.project} params={this.props.params}/>
        }





        return (
                <div>
                    {errorComponent}
                    {preloaderComponent}
                    {addUserButtonComponent}
                    {addUserFormComponent}
                    {usersComponent}
               </div>
        );
  }
}

const CollaboratorListComponent = props => (
  <SocketContext.Consumer>
  {socket => <CollaboratorListCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default CollaboratorListComponent;
