import React, { Component } from 'react'
//import $ from 'jquery'
//import M from "materialize-css/dist/js/materialize.js";
import axios from 'axios'
import SocketContext from '../SocketContext'

axios.defaults.withCredentials = true

var $ = window.$

class RemoveTaskFormCore extends Component {

  constructor(props){
   super(props);
   this.handleRemoveTask = this.handleRemoveTask.bind(this);
   this.state = {error : false, pending : false}
  }

  componentDidMount() {
      $("#modal_removetask_"+this.props.task._id).modal();
  }

  componentWillUnmount() {
      $("#modal_removetask_"+this.props.task._id).modal('close');
  }

  handleRemoveTask(event){
   event.preventDefault();
    this.setState({error : false, pending : true}, () => {
        var filter = {_id:this.props.task._id}
        this.props.socket.emit('/api/task/delete', filter, res => {
            if(res.tasks) {
                this.setState({error : false, pending : false}, () => $("#modal_removetask_"+this.props.task._id).modal('close'));
            }
            if (res.error) {
                this.setState({error : res.error, pending : false}, () => $("#modal_removetask_"+this.props.task._id).modal('close'));
            }
        })
    })
  };

  render() {
    return (
    <div id={"modal_removetask_"+this.props.task._id} className="modal">
        <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>Remove task</h4>
        </div>
          <form className="col s12">
          <div className="row">
              <div className="col s12 center">
              <h5 className="rezbuild-text">Do you want to remove <strong style={{fontWeight:'900'}}>{this.props.task.name}</strong> ?</h5>
              </div>
              <div className="input-field col s6 right-align">
                  <a className="btn waves-effect waves-light" href="#!" onClick={this.handleRemoveTask}>YES</a>
              </div>
              <div className="input-field col s6 left-align">
                  <a className="btn waves-effect waves-light white rezbuild-text" href="#!"  onClick={() => $("#modal_removetask_"+this.props.task._id).modal('close')}>NO</a>
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

const RemoveTaskForm = props => (
  <SocketContext.Consumer>
  { (context) => <RemoveTaskFormCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default RemoveTaskForm;
