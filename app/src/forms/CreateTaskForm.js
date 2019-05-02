import React, { Component } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import SocketContext from '../SocketContext'
import MDReactComponent from 'markdown-react-js'
import common from 'common'

axios.defaults.withCredentials = true

var $ = window.$

class CreateTaskFormCore extends Component {

  constructor(props){
   super(props);
   this.submit = this.submit.bind(this);
   this.state =
       {
           pending: false,
           error: false,
           lane: this.props.task?this.props.task.lane:'lane_backlog',
           id: this.props.task?('_'+this.props.task._id):'',
           startDate: this.props.task?new Date(this.props.task.startDate):new Date(),
           endDate: this.props.task?new Date(this.props.task.endDate):new Date()
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
   if(this.props.task){
       var filter = {_id: this.props.task._id}
       var update = {
          //date: {type: Date, default: Date.now},
          revision: this.props.task.revision,
          //lane:   {type: String, default: 'lane_backlog'},
          name: this.refs.name.value,
          content:  this.refs.content.value,
          startDate: this.state.startDate,
          endDate: this.state.endDate,
          roles: $("#select_roles"+ this.state.id + " option:selected").map(function() {return $(this).val();}).get(),
          actions: $("#select_actions"+ this.state.id + " option:selected").map(function() {return $(this).val();}).get()
       }
       this.setState({pending:true, error: false}, () => {
            this.props.socket.emit('/api/task/update', filter, update, res => {
                if(res.tasks){
                    this.setState({pending:false, error: false}, () => $('#modal_createtask' + this.state.id).modal('close'))
                }
                if(res.error){
                    this.setState({pending:false, error: res.error})
                }
            });
       })
   }
   else {
       var create = {
          //date: {type: Date, default: Date.now},
          revision: this.props.revision._id,
          //lane:   {type: String, default: 'lane_backlog'},
          name: this.refs.name.value,
          content:  this.refs.content.value,
          startDate: this.state.startDate,
          endDate: this.state.endDate,
          roles: $("#select_roles option:selected").map(function() {return $(this).val();}).get(),
          actions: $("#select_actions option:selected").map(function() {return $(this).val();}).get()
        }

       this.setState({pending:true, error: false}, () => {
            this.props.socket.emit('/api/task/create', create, res => {
                if(res.tasks){
                    this.setState({pending:false, error: false}, () => $('#modal_createtask' + this.state.id).modal('close'))
                }
                if(res.error){
                    this.setState({pending:false, error: res.error})
                }
            });
       })
   }
  }

  componentWillUnmount() {
      $('#modal_createtask' + this.state.id).modal('close');
  }

  componentDidMount(){
    $(document).ready(() => {
        $('#modal_createtask'+ this.state.id).modal();
        $('ul.tabs').tabs();
        $('select').material_select();
        $('#modal_createtask'+ this.state.id).modal();
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps !== this.props){
    this.forceUpdate()
    }
  }

  render() {
    const fileFormats = [ '.csv', '.doc', '.docx', '.pdf', '.txt', '.ifc', '.xlsx', '.xlsx']
    const colorCategories = [ '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4',
    '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
    '#795548', '#9e9e9e', '#607d8b', '#000000', '#ffffff', '#f7931e']
    let taskFormBody;
    console.log('ACTIONS : ', common.ACTIONS)
    taskFormBody =
        <div>
            <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>{this.state.id? "Update Task":"Create Task"}</h4>
            </div>
            <div className="modal-content" style={{paddingTop:0}}>
                  <form className="col s12" onSubmit={this.submit}>
                     <div className="row">
                        <div className="input-field col s12">
                              <input id={"input_name"+ this.state.id}
                              type="text"
                              ref="name"
                              defaultValue={this.props.task ? this.props.task.name : ''}
                              required/>
                              <label  className="active" htmlFor={"input_name"+ this.state.id}>Name</label>
                        </div>
                     </div>
                     <div className="row">
                        <div className="input-field col s12">
                           <textarea id={"input_content"+ this.state.id}
                           ref="content"
                           className="materialize-textarea"
                           defaultValue={this.props.task ? this.props.task.content : ''}
                           required/>
                           <label className="active"  htmlFor={"input_content"+ this.state.id}>Content</label>
                        </div>
                     </div>
                     <div className="row">
                      <div className="input-field col s6">
                        <select multiple required defaultValue={["Customer"]} id={"select_roles"+ this.state.id}>
                          <option value="" disabled>Choose role(s)</option>
                          <option name="roles" value="Customer" id="role_customer">Customer</option>
                          <option name="roles" value="Designer" id="role_designer">Designer</option>
                          <option name="roles" value="Analyst" id="role_analyst">Analyst</option>
                        </select>
                        <label>Authorized Role(s)</label>
                      </div>
                      <div className="input-field col s6">
                        <select multiple required defaultValue={["NEW_FILE"]} id={"select_actions"+ this.state.id}>
                          <option value="" disabled>Choose action(s)</option>
                            {

                             common.ACTIONS.map((action, index) =>
                                <option name="actions" value={action.name} key={index}>
                                    {action.name}
                                </option>
                                )
                            }
                        </select>
                        <label>Authorized Action(s)</label>
                      </div>
                      </div>
                      {
                       (this.state.lane === 'lane_todo' || this.state.lane === 'lane_inprogress')?
                        <div className="row">
                          <div className="input-field col s3">

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
                          <div className="input-field col s3">
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
                        </div>:""
                      }
                     <div className="row">
                      <div className="input-field col s6 center">
                          <button className="btn waves-effect waves-light" type="submit">SUBMIT</button>
                      </div>
                      <div className="input-field col s6 center">
                          <a className="btn waves-effect waves-light rezbuild-text white" href='#!'
                          onClick={() => $('#modal_createtask'+ this.state.id).modal('close')}>
                          CANCEL</a>
                      </div>
                     </div>
                  </form>
            </div>
        </div>

    return (
    <div id={"modal_createtask" + this.state.id} className="modal">
        {taskFormBody}
    </div>
    );
  }
}

const CreateTaskForm = props => (
  <SocketContext.Consumer>
  { (context) => <CreateTaskFormCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default CreateTaskForm;
