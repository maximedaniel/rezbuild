import React, { Component } from 'react'
import axios from 'axios'
import SocketContext from '../SocketContext'

axios.defaults.withCredentials = true

var $ = window.$

class TaskFormCore extends Component {

  constructor(props){
   super(props);
   this.submit = this.submit.bind(this);
   this.cancel = this.cancel.bind(this);
   this.state = {error : false, pending : false}
  }

  submit(){
    this.props.submit()
   $('#modal_task').modal('close');
  }
  cancel(){
    this.props.cancel()
    $('#modal_task').modal('close');
  }


  render() {
    let taskFormBody;

    if(this.props.task) {
    taskFormBody =
        <div>
            <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>{this.props.task.title}</h4>
            </div>
            <div className="modal-content">
                  <form className="col s12">
                     <div className="row">
                      <div className="input-field col s6 center">
                          <a className="btn waves-effect waves-light" href='#!' onClick={this.submit}>SUBMIT</a>
                      </div>
                      <div className="input-field col s6 center">
                          <a className="btn waves-effect waves-light rezbuild-text white" href='#!' onClick={this.cancel}>CANCEL</a>
                      </div>
                     </div>
                  </form>
            </div>
        </div>
    }

    return (
    <div id="modal_task" className="modal">
        {taskFormBody}
    </div>
    );
  }
}

const TaskForm = props => (
  <SocketContext.Consumer>
  {socket => <TaskFormCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default TaskForm;
