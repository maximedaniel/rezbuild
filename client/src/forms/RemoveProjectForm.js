import React, { Component } from 'react'
//import $ from 'jquery'
//import M from "materialize-css/dist/js/materialize.js";
import axios from 'axios'
import SocketContext from '../SocketContext'

axios.defaults.withCredentials = true

var $ = window.$

class RemoveProjectFormCore extends Component {

  constructor(props){
   super(props);
   this.handleRemoveProject = this.handleRemoveProject.bind(this);
   this.state = {error : false, pending : false}
  }

  componentDidMount() {
      $("#modal_removeproject_"+this.props.project._id).modal();
  }

  componentWillUnmount() {
      $("#modal_removeproject_"+this.props.project._id).modal('close');
  }

  handleRemoveProject(event){
   event.preventDefault();
    this.setState({error : false, pending : true}, () => {
        this.props.socket.emit('/api/user/removeproject', { _id: this.props.project._id });
        this.props.socket.on('/api/user/removeproject', res => {
            if(res.error){
                this.setState({error : res.error, pending : false}, () => {
                    $("#modal_removeproject_"+this.props.project._id).modal('close');
                });
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
          <form className="col s12">
          <div className="row">
              <div className="col s12 center">
              <h5 className="rezbuild-text">Do you want to remove <strong>{this.props.project.name}</strong> ?</h5>
              </div>
              <div className="input-field col s6 right-align">
                  <button className="btn waves-effect waves-light" onClick={this.handleRemoveProject}>YES</button>
              </div>
              <div className="input-field col s6 left-align">
                  <button className="btn waves-effect waves-light white rezbuild-text modal-close" onClick={()=>{}}>NO</button>
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
  {socket => <RemoveProjectFormCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default RemoveProjectForm;
