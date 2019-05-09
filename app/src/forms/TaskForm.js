import React, { Component } from 'react'
import axios from 'axios'
import SocketContext from '../SocketContext'
import DatePicker from 'react-datepicker'
import "../project/dashboard/trello/card/createTask/node_modules/react-datepicker/dist/react-datepicker.css";

axios.defaults.withCredentials = true

var $ = window.$

class TaskFormCore extends Component {

  constructor(props){
   super(props);
   this.submit = this.submit.bind(this);
   this.cancel = this.cancel.bind(this);
   this.state = {
       error : false,
       pending : false,
       startDate: this.props.task.startDate,
       endDate: this.props.task.endDate
   }
   this.handleStartDateChange = this.handleStartDateChange.bind(this);
   this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  handleStartDateChange(date) {
    this.setState({
      startDate: date
    });
  }

  handleEndDateChange(date) {
    this.setState({
      endDate: date
    });
  }

 submit(event){
   event.preventDefault();
   this.props.cancel()
   $('#modal_task').modal('close');
   var filter = {}
   var update = {}
      /* this.setState({pending:true, error: false}, () => {
       })*/
  }


  cancel(){
    this.props.cancel()
    $('#modal_task').modal('close');
  }

  render() {
    let taskFormBody;

    let TodoFormBody;
    if(this.props.event.fromLaneId === 'lane_todo' && this.props.task){
        TodoFormBody =  <div>
                          <div className="input-field col s6">
                            <label className="active">From date</label>
                            <DatePicker
                                selected={this.state.startDate}
                                selectsStart
                                maxDate={this.state.endDate}
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                onChange={this.handleStartDateChange}
                            />
                          </div>
                          <div className="input-field col s6">
                            <label className="active">To date</label>
                            <DatePicker
                                selected={this.state.endDate}
                                selectsEnd
                                minDate={this.state.startDate}
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                onChange={this.handleEndDateChange}
                            />
                           </div>
                        </div>
    }

    if(this.props.task) {
    taskFormBody =
        <div>
            <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>{this.props.task.name}</h4>
            </div>
            <div className="modal-content">
                  <form className="col s12">
                     <div className="row">
                        {TodoFormBody}
                     </div>
                     <div className="row" style={{marginTop:'250px'}}>
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
    <div id="modal_task" className="modal" style={{minHeight:'500px'}}>
        {taskFormBody}
    </div>
    );
  }
}

const TaskForm = props => (
  <SocketContext.Consumer>
  { (context) => <TaskFormCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default TaskForm;
