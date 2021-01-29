/**
 * @class ApproveMemberForm
 * @extends Component
 * @description Create the form to approve or desapprove user joint request for the project
 */
import React, { Component } from 'react'
import SocketContext from '../../../../SocketContext'

var $ = window.$

class ApproveMemberFormCore extends Component {

  constructor(props){
   super(props);
   this.componentId = "modal_approvemember_" + this.props.project._id + "_" + this.props.user._id;
   this.handleApproveMember = this.handleApproveMember.bind(this);
   this.handleDesapproveMember = this.handleDesapproveMember.bind(this);
   this.state = {error : false, pending : false}
  }

  componentDidMount() {
    $(document).ready(() => {
      $("#" + this.componentId).modal();
    })
  }

  componentWillUnmount() {
    $("#" + this.componentId).modal('close');
  }

  // Remove the user from the project
  submit(event) {
    event.preventDefault();


    this.setState({error : false, pending : true}, () => {
      var req = {
        filter : {_id: this.props.project._id},
        update : {"$pull" : {users : "token"}}
      }
        this.props.socket.emit('/api/project/update', req, res => {
            if (res.project) {
                this.setState({error : false, pending : false}, () => {
                  $("#" + this.componentId).modal('close');
                })
            }
            if (res.error) {
                this.setState({error : res.error, pending : false});
            }
        });
    })
  };
  
  handleApproveMember(event) {
    event.preventDefault();
    this.props.socket.emit('/api/project/approveMember', {project: this.props.project, user: this.props.user}, res => {
      if (res.success) {
        this.setState({error : false, pending : false}, () => {
          $("#" + this.componentId).modal('close');
        })
      } else if (res.error) {
        this.setState({error : res.error, pending : false});
      }
    });
  };

  handleDesapproveMember(event) {
    event.preventDefault();
    this.props.socket.emit('/api/project/desapproveMember', {project: this.props.project, user: this.props.user}, res => {
      if (res.success) {
        this.setState({error : false, pending : false}, () => {
          $("#" + this.componentId).modal('close');
        })
      } else if (res.error) {
        this.setState({error : res.error, pending : false});
      }
    });
  };

  render() {

    let preloaderComponent;
    let errorComponent;

    if (this.state.pending){
      preloaderComponent = 
      <div className="row">
        <div className="preloader-wrapper small active center">
          <div className="spinner-layer">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div>
            <div className="gap-patch">
              <div className="circle"></div>
            </div>
            <div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>
        </div>
      </div>
    }

    if (this.state.error){
      errorComponent = 
        <div className="row">
          <div className="col s12 center">
            <h6 className='rezbuild-text'>{this.state.error}</h6>
          </div>
        </div>
    }

    let qst = "Manage " + this.props.user.firstname + " " + this.props.user.lastname + " membership request for your project " + this.props.project.name;
    // let qstApprove = "Do you want to approve " + this.props.user.firstname + " " + this.props.user.lastname + " to your project " + this.props.project.name + "?";
    // let qstDesapprove = "Do you want to remove " + this.props.user.firstname + " " + this.props.user.lastname + " from your project " + this.props.project.name + "?";

    return (

      
      <div id={this.componentId} className="modal">
        <div className="rezbuild center" style={{marginBottom:'0'}}>
          <h4 className="white-text" style={{lineHeight:'150%'}}>Manage project join request</h4>
        </div>
        <form className="col s12" lang="en">
        <div className="row">
          <div className="col s12 center">
            <h5 className="rezbuild-text">{qst}</h5>
          </div>
          <div className="input-field col s3 right-align">
          </div>
          <div className="input-field col s2 right-align">
            <a className="btn waves-effect waves-light" href="#!" onClick={this.handleApproveMember}><i className="material-icons right">check</i>APPROVE</a>
          </div>
          <div className="input-field col s2 right-align">
            <a className="btn waves-effect waves-light" href="#!" onClick={this.handleDesapproveMember}><i className="material-icons right">remove</i>REMOVE</a>
          </div>
          <div className="input-field col s2 right-align">
            <a className="btn waves-effect waves-light white rezbuild-text" href="#!"  onClick={() => $("#" + this.componentId).modal('close')}> <i className="material-icons left">clear</i>CANCEL</a>
          </div>
          <div className="input-field col s3 right-align">
          </div>
        </div>

        {preloaderComponent}
        {errorComponent}

        </form>
      </div>
    );
  }
}

const ApproveMemberForm = props => (
  <SocketContext.Consumer>
  { (context) => <ApproveMemberFormCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default ApproveMemberForm

