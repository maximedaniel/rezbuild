import React, { Component } from 'react'
import axios from 'axios'
import SocketContext from '../../../../SocketContext'
import DatePicker from 'react-datepicker'
import "../../../../../node_modules/react-datepicker/dist/react-datepicker.css"
axios.defaults.withCredentials = true

var $ = window.$

class TodoTaskFormCore extends Component {

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
    this.setState({startDate: date});
  }

  handleEndDateChange(date) {
    this.setState({endDate: date});
  }

 submit(event){
   event.preventDefault();
    this.setState({error : false, pending : true}, () => {
      var _task = this.props.task
      if(_task._id === this.props.task._id){ 
          _task.lane = 'lane_todo'
      }
      delete _task._id
      var create = _task
      this.props.socket.emit('/api/task/create', create,  res => {
            if(res.tasks) {
                this.setState({error : false, pending : false}, () => $("#modal_todotask").modal('close'));
            }
            if (res.error) {
                this.setState({error : res.error, pending : false});
            }
        })
    })
  }


  cancel(){
    this.props.cancel()
    $('#modal_todotask').modal('close');
  }

  componentDidMount(){
    $(document).ready(() => {
        $('#modal_todotask').modal();
    })
  }

  render() {
    let formBody;
    let body;
    if(this.props.task){
        formBody =  <div>
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

    body =
        <div>
            <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>{this.props.task.name}</h4>
            </div>
            <div className="modal-content">
                  <form className="col s12">
                     <div className="row">
                        {formBody}
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
    <div id="modal_todotask" className="modal" style={{minHeight:'500px'}}>
        {body}
    </div>
    );
  }
}

const TodoTaskForm = props => (
  <SocketContext.Consumer>
  { (context) => <TodoTaskFormCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default TodoTaskForm;
