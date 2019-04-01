import React, { Component } from 'react'
import axios from 'axios'
import SocketContext from '../SocketContext'

axios.defaults.withCredentials = true

var $ = window.$

class CreateTaskFormCore extends Component {

  constructor(props){
   super(props);
   this.submit = this.submit.bind(this);
   this.cancel = this.cancel.bind(this);
   this.handleOptionChange = this.handleOptionChange.bind(this);
   this.state = {selectedOption: 'KPI', error : false, pending : false}
  }

  submit(){
   $('#modal_createtask').modal('close');
  }

  cancel(){
    $('#modal_createtask').modal('close');
  }
  handleOptionChange(changeEvent){
  this.setState({selectedOption:changeEvent.target.value})
  }

  render() {
    let taskFormBody;
    taskFormBody =
        <div>
            <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>Create Task</h4>
            </div>
            <div className="modal-content">
                  <form className="col s12">
                     <div className="row">
                        <h5 className="rezbuild-text">General</h5>
                        <div className="input-field col s12">
                              <input id="input_name" type="text"  ref="name" placeholder="e.g., LCA Indicator Task"/>
                              <label className="active" htmlFor="input_name">Name</label>
                        </div>
                        <div className="input-field col s12">
                              <textarea id="input_desc" class="materialize-textarea" placeholder="e.g., Life Cycle Assessment of the BIM model."></textarea>
                              <label className="active" htmlFor="input_desc">Description</label>
                        </div>
                        <h5 className="rezbuild-text">Requirement</h5>
                        <div className="input-field col s3">
                            <input class="with-gap" name="group3" type="radio" value="BIM" id="BIM"
                            checked={this.state.selectedOption === 'BIM'}
                            onChange={this.handleOptionChange}/>
                            <label htmlFor="BIM">BIM</label>
                        </div>
                        <div className="input-field col s1">
                            <input class="with-gap" name="group3" type="radio" value="KPI" id="KPI"
                            checked={this.state.selectedOption === 'KPI'}
                            onChange={this.handleOptionChange}/>
                            <label htmlFor="KPI">KPI</label>
                        </div>
                        { (this.state.selectedOption === 'KPI')?<div className="input-field col s2">
                            <input id="input_kpi" type="text"  ref="name" placeholder="e.g., kgCO2eq"/>
                              <label className="active" htmlFor="input_kpi">KPI unit</label>
                        </div>:''}
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

    return (
    <div id="modal_createtask" className="modal">
        {taskFormBody}
    </div>
    );
  }
}

const CreateTaskForm = props => (
  <SocketContext.Consumer>
  {socket => <CreateTaskFormCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default CreateTaskForm;
