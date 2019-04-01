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
  componentDidMount(){
     $('#input_date').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false, // Close upon selecting a date,
        container: undefined, // ex. 'body' will append picker to body
      });
  }
  componentDidUpdate(){
     $('#input_date').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false, // Close upon selecting a date,
        container: undefined, // ex. 'body' will append picker to body
      });
  }

  render() {
    let taskFormBody;

    let TodoFormBody;
    if(this.props.event.fromLaneId === 'lane_todo'){
        TodoFormBody =  <div>
                            <div className="input-field col s12">
                                  <input id="input_name" type="text"  ref="name" placeholder="e.g., LCA Indicator Task"/>
                                  <label className="active" htmlFor="input_name">Assignment</label>
                            </div>
                            <div className="input-field col s12">
                                <input id="input_date" type="text" class="datepicker"  ref="date"/>
                                <label htmlFor="input_date">Date</label>
                            </div>
                        </div>
    }
    let DoneFormBody;
    if(this.props.event.fromLaneId === 'lane_done'){
        DoneFormBody =  <div>
                        <a class="waves-effect waves-light btn">DOWNLOAD BIM</a>
                        <h5 className="rezbuild-text">Requirements</h5>
                         <div className="file-field input-field col s12">
                          <div className="btn">
                            <span>UPLOAD BIM</span>
                            <input type="file"/>
                          </div>
                          <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" placeholder="Upload a BIM file"/>
                          </div>
                        </div>
                        <div className="input-field col s12">
                            <input id="input_kpi" type="text"  ref="name"/>
                              <label htmlFor="input_kpi">KPI VALUE</label>
                        </div>
                        </div>
    }
    if(this.props.task) {
    taskFormBody =
        <div>
            <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>{this.props.task.title}</h4>
            </div>
            <div className="modal-content">
                  <form className="col s12">
                     <div className="row">
                        {TodoFormBody}
                        {DoneFormBody}
                     </div>
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
