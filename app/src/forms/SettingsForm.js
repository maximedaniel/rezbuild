import React, { Component } from 'react'
import {browserHistory} from 'react-router'

var $ = window.$

class SettingsForm extends Component {
  // Initialize the state
  constructor(props){
   super(props);
   this.handleSubmit = this.handleSubmit.bind(this);
   this.state = {error : false, pending : false}
  }

  componentDidMount() {
    this.props.user.roles.map((role, index) => $("#"+role).prop( "checked", true ))
  }

  handleSubmit(event){
   event.preventDefault();
   /*this.setState({error : false, pending : true})
   axios.post('/api/settings', {
        roles : $("input[name='roles']:checked").map(function() {return $(this).val();}).get(),
   })
    .then(res => {
        this.setState({error : false, pending : false})
        $('#modal_settings').modal('close')
        browserHistory.push('/')
    })
    .catch(err => {
        console.log(err)
        if(err && err.response && err.response.data){
            this.setState({error : err.response.data, pending : false});
            $('#modal_settings').modal('close')
            browserHistory.push('/')
        } else {
            this.setState({error : 'Network error', pending : false});
            $('#modal_settings').modal('close')
            browserHistory.push('/')
        }
    });*/
  }

  render() {
    let settingsFormBody;
    settingsFormBody =
        <div>
            <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>Settings</h4>
            </div>
            <div className="modal-content">
                  <form className="col s12">
                     <div className="row">
                        <div className="input-field col s12">
                            <input  id="input_firstname" ref="firstname" name="firstname" type="text" defaultValue={this.props.user.firstname} required/>
                            <label  className="active" htmlFor="input_firstname">First name</label>
                        </div>
                        <div className="input-field col s12">
                            <input  id="input_lastname" ref="lastname" name="lastname" type="text" defaultValue={this.props.user.lastname} required/>
                            <label  className="active" htmlFor="input_lastname">Last name</label>
                        </div>
                        <div className="input-field col s4">
                        <input type="checkbox"  name="roles" value="Customer" id="role_customer"/><label htmlFor="role_customer">Customer</label>
                        </div>
                        <div className="input-field col s4">
                        <input type="checkbox"  name="roles" value="Designer" id="role_designer"/><label htmlFor="role_designer">Designer</label>
                        </div>
                        <div className="input-field col s4">
                        <input type="checkbox"  name="roles" value="Analyst" id="role_analyst"/><label htmlFor="role_analyst">Analyst</label>
                        </div>
                        <div className="input-field col s12">
                              <input id="input_email" ref="email" name="email" type="email"  defaultValue={this.props.user.email} required/>
                              <label className="active" htmlFor="input_email">Email</label>
                        </div>
                        <div className="input-field col s12">
                              <input id="input_password" ref="password" type="password" name="password" defaultValue="*******" required/>
                              <label className="active" htmlFor="input_password">Password</label>
                        </div>
                     </div>
                     <div className="row">
                      <div className="input-field col s6 center">
                          <a className="btn waves-effect waves-light" href='#!'>SUBMIT</a>
                      </div>
                      <div className="input-field col s6 center">
                          <a className="btn waves-effect waves-light rezbuild-text white" href='#!'>CANCEL</a>
                      </div>
                     </div>
                  </form>
            </div>
        </div>

    return (
    <div id="modal_settings" className="modal">
        {settingsFormBody}
    </div>
    );
  }
}
export default SettingsForm;