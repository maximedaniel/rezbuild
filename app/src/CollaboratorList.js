import React, { Component } from 'react'
import SocketContext from './SocketContext'


class CollaboratorListCore extends Component {

  constructor(props){
    super(props);
    this.state = {user: null, users : null, error : false, pending : false}
  }

  updateCollaboratorList(){
    this.setState({user : null, users : null, error : false, pending : true}, () => {
        this.props.socket.emit('/api/user/project/users', { _id: this.props.project._id });
        this.props.socket.on('/api/user/project/users', res => {
            if(res.project){
                this.setState({user : res.user, users : res.users, error : false, pending : false})
            }
            if(res.error){
                this.setState({user : null, users : null, error : false, pending : false});
            }
        });
    })
  }

  componentDidMount() {
    this.updateCollaboratorList()
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

        let collaboratorListComponent;

        if (this.state.collaboratorListComponent){
            collaboratorListComponent = this.state.users.map((collaborator, index) =>
                    <h5 key={index}>{collaborator.name}</h5>
            );
        }
        return (
                <div>
                    {collaboratorListComponent}
                    {preloaderComponent}
                    {errorComponent}
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
