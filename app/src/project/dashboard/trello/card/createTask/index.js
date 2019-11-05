import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import SocketContext from '../../../../../SocketContext'
import common from 'common'

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
     /*
       var filter = {_id: this.props.task._id}
       var update = {
          project: this.props.project._id,
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
       })*/
   }
   else {
       var create = {
          project: this.props.project._id,
          name: this.refs.name.value,
          lane:  'lane_backlog',
          content:  this.refs.content.value,
          roles: [].filter.call(this.refs.roles.options, o => o.selected).map(o => o.value),
          action: this.refs.action.value,
          names: common.ACTIONS[this.refs.action.value].names,
          values: common.ACTIONS[this.refs.action.value].values,
          formats: common.ACTIONS[this.refs.action.value].formats
        }

       this.setState({pending:true, error: false}, () => {
            this.props.socket.emit('/api/task/create', create, res => {
                if(res.tasks){
                    this.setState({pending:false, error: false}, () => {
                      $('#modal_createtask' + this.state.id).modal('close')
                      this.props.socket.emit('/api/task/done')
                  })
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
        $('#modal_createtask'+ this.state.id).modal({dismissible: false});
        $('ul.tabs').tabs();
        $('select').material_select();
        $('#modal_createtask'+ this.state.id).modal({dismissible: false});
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps !== this.props){
    this.forceUpdate()
    }
  }

  render() {
    let taskFormBody;
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
                        <select multiple required defaultValue={["Customer"]} id={"select_roles"+ this.state.id} ref="roles">
                          <option value="" disabled>Choose role(s)</option>
                          <option name="roles" value="Customer" id="role_customer">Customer</option>
                          <option name="roles" value="Designer" id="role_designer">Designer</option>
                          <option name="roles" value="Analyst" id="role_analyst">Analyst</option>
                        </select>
                        <label>Authorized Role(s)</label>
                      </div>
                      <div className="input-field col s6">
                        <select required defaultValue={common.ACTIONS.NEW_MODEL_ASIS} id={"select_actions"+ this.state.id} ref="action">
                          <option value="" disabled>Choose action(s)</option>
                            {
                             Object.entries(common.ACTIONS).map(([key, value]) => {
                                return <option name="actions" value={key} key={key}>
                                    {key}
                                </option>
                             })
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
                      { this.state.error ?
                        <div className="row">
                            <div className="col s12">
                                <h6 className='rezbuild-text'>{this.state.error}</h6>
                            </div>
                        </div> : ''
                        }
    
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
