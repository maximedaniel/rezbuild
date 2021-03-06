/**
 * @class TodoTaskForm
 * @extends Component
 * @description Create the form for a TODO task
 */
import React, { Component } from 'react'
import SocketContext from '../../../../SocketContext'
import DatePicker from 'react-datepicker'
import "../../../../../node_modules/react-datepicker/dist/react-datepicker.css"


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
      
      var create = {
        project: this.props.task.project,
        lane:   'lane_todo',
        name: this.props.task.name,
        content: this.props.task.content,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        roles: this.props.task.roles,
        action: this.props.task.action,
        names: this.props.task.names,
        formats:  this.props.task.formats,
        values: this.props.task.values,
        files: this.props.task.files,
        prev: [this.props.selectedTask._id],
        next: []
       }
       
      if(this.refs.user.value) create.user = this.refs.user.value

       this.props.socket.emit('/api/task/create', create, res => {
            if(res.tasks){
              var filter = {_id: this.props.selectedTask._id}
              var update = { $push: {next: res.tasks._id}}
              var newTask = res.tasks;
              this.props.socket.emit('/api/task/update', filter, update, res => {
                  if(res.tasks){
                       /* SEND MAIL */
                    if(create.user){
                      this.props.socket.emit('/api/user/get', {_id: create.user}, res => {
                        if(res.users){
                          this.props.socket.emit('/api/email/todotask', {user: res.users[0], task: newTask, project: this.props.project}, res => {
                              /* CLOSE MODAL */
                              this.setState({pending:false, error: false}, () => {
                                $("#modal_todotask").modal('close')
                                this.props.socket.emit('/api/task/done')
                              });
                          });
                        }
                      });
                    } else {
                      /* CLOSE MODAL */
                      this.setState({pending:false, error: false}, () => {
                        $("#modal_todotask").modal('close')
                        this.props.socket.emit('/api/task/done')
                      })
                    }
                  }
                  if(res.error){
                      this.setState({pending:false, error: res.error})
                  }
              }) 
            }
            if(res.error){
                this.setState({pending:false, error: res.error})
            }
       });
    })
  }


  cancel(){
    this.props.cancel()
    $('#modal_todotask').modal('close');
  }

  componentDidMount(){
    $(document).ready(() => {
        $('#modal_todotask').modal({dismissible: false});
        $('select').material_select();
    })
  }

  render() {
    let formBody;
    let body;
    if(this.props.task){
        formBody =  <div>
                          <div className="input-field col s6">
                              <select  defaultValue="" id="user" ref="user">
                                <option value=""></option>
                                  {
                                    this.props.users
                                    .filter(user => {
                                      return user.roles.includes(...this.props.task.roles)
                                      }
                                    )
                                    .map((user, index) => 
                                      <option name="user" value={user._id} key={index}>
                                      {user.firstname + " " + user.lastname+ " (" + user.email + ")"}
                                      </option>
                                    )
                                  }
                              </select>
                              <label>Assign a user</label>
                          </div>
                          <div className="input-field col s3">
                            <label className="active">From date</label>
                            <DatePicker
                                selected={new Date(this.state.startDate)}
                                selectsStart
                                maxDate={new Date(this.state.endDate)}
                                startDate={new Date(this.state.startDate)}
                                endDate={new Date(this.state.endDate)}
                                onChange={this.handleStartDateChange}
                            />
                          </div>
                          <div className="input-field col s3">
                            <label className="active">To date</label>
                            <DatePicker
                                selected={new Date(this.state.endDate)}
                                selectsEnd
                                minDate={new Date(this.state.startDate)}
                                startDate={new Date(this.state.startDate)}
                                endDate={new Date(this.state.endDate)}
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
                  <form className="col s12" lang="en">
                     <div className="row">
                        {formBody}
                     </div>
                     <div className="row" style={{marginTop:'250px'}}>
                      <div className="input-field col s6 center">
                          <a className="btn waves-effect waves-light" href='#!' onClick={this.submit}><i className="material-icons right">send</i>SUBMIT</a>
                      </div>
                      <div className="input-field col s6 center">
                          <a className="btn waves-effect waves-light rezbuild-text white" href='#!' onClick={this.cancel}><i className="material-icons left">cancel</i>CANCEL</a>
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
