/**
 * @class RemoveProjectForm
 * @extends Component
 * @description Create the form for removing a project
 */

import React, { Component } from 'react'
import SocketContext from '../../../SocketContext'

var $ = window.$

class RemoveProjectFormCore extends Component {

  constructor(props){
   super(props);
   this.handleRemoveProject = this.submit.bind(this);
   this.state = {error : false, pending : false}
  }

  componentDidMount() {
      $("#modal_removeproject_"+this.props.project._id).modal();
  }

  componentWillUnmount() {
      $("#modal_removeproject_"+this.props.project._id).modal('close');
  }

  // Remove the user from the project
  submit(event){
   event.preventDefault();
    this.setState({error : false, pending : true}, () => {
       var filter = {_id: this.props.project._id}
       var update = {"$pull" : {users : "token"}}
       this.props.socket.emit('/api/project/update', filter, update, res => {
            if (res.projects) {
                this.setState({error : false, pending : false}, () => {
                    $("#modal_removeproject_"+this.props.project._id).modal('close');
                })
            }
            if (res.error) {
                this.setState({error : res.error, pending : false});
            }
       });
    })
  };

  render() {
    return (
    <div id={"modal_removeproject_"+this.props.project._id} className="modal">
        <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>Remove project</h4>
        </div>
          <form className="col s12" lang="en">
          <div className="row">
              <div className="col s12 center">
              <h5 className="rezbuild-text">Do you want to remove <strong style={{fontWeight:'900'}}>{this.props.project.name}</strong> ?</h5>
              </div>
              <div className="input-field col s6 right-align">
                  <a className="btn waves-effect waves-light" href="#!" onClick={this.handleRemoveProject}><i className="material-icons right">check</i>YES</a>
              </div>
              <div className="input-field col s6 left-align">
                  <a className="btn waves-effect waves-light white rezbuild-text" href="#!"  onClick={() => $("#modal_removeproject_"+this.props.project._id).modal('close')}> <i className="material-icons left">clear</i>NO</a>
              </div>
                { this.state.pending ?
                 <div className="preloader-wrapper small active">
                    <div className="spinner-layer">
                      <div className="circle-clipper left">
                        <div className="circle"></div>
                      </div><div className="gap-patch">
                        <div className="circle"></div>
                      </div><div className="circle-clipper right">
                        <div className="circle"></div>
                      </div>
                    </div>
                  </div> : ''
                }

                { this.state.error ?
                <div className="row">
                    <div className="col s12">
                        <h6 className='rezbuild-text'>{this.state.error}</h6>
                    </div>
                </div> : ''
                }
          </div>
          </form>
    </div>
    );
  }
}

const RemoveProjectForm = props => (
  <SocketContext.Consumer>
  { (context) => <RemoveProjectFormCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default RemoveProjectForm;
