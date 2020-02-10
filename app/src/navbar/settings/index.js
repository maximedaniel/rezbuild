/**
 * @class SettingsForm
 * @extends Component
 * @description Create the form for account settings
 */

 import React, { Component } from 'react'
import SocketContext from '../../SocketContext'
import common from 'common'

var $ = window.$
var Materialize = window.Materialize

class SettingsFormCore extends Component {
  // Initialize the state
  constructor(props){
   super(props);
   this.handleSubmit = this.handleSubmit.bind(this);
   this.cancel = this.cancel.bind(this);
   this.state = {error : false, pending : false}
  }

  componentDidMount() {
    this.props.user.roles.map((role, index) => $("#settings_role_"+role).prop( "selected", true ))
    $(document).ready(function() {
      $('#select_settings_roles').material_select();
      Materialize.updateTextFields();
    });
    this.props.socket.on('/api/user/done', res => {
      this.props.update()
   });
  }
  handleSubmit(event){
   event.preventDefault();
    this.setState({error : false, pending : true}, () => {
         var filter = {_id: "token"}
         var update = {
            email : this.refs.email.value,
            password : this.refs.password.value,
            firstname : this.refs.firstname.value.charAt(0).toUpperCase() + this.refs.firstname.value.toLowerCase().slice(1),
            lastname : this.refs.lastname.value.toUpperCase(),
            roles : $("#select_settings_roles option:selected").map(function() {return $(this).val();}).get(),
         }
        this.props.socket.emit('/api/user/update', filter, update, res => {
            if (res.users) {
                this.setState({error : false, pending : false}, () =>{
                    $('#modal_settings').modal('close');
                    // this.props.update()
                    this.props.socket.emit('/api/user/done')
                })
            }
            if(res.error){
                this.setState({error : res.error, pending : false});
            }
        });
    })
  }

  cancel(){
    $('#modal_settings').modal('close');
  }

  render() {
    let settingsFormBody;
    settingsFormBody =
        <div>
            <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>Settings</h4>
            </div>
            <div className="modal-content">
                  <form className="col s12"  onSubmit={this.handleSubmit}>
                     <div className="row">
                        <div className="input-field col s6" style={{lineHeight:'1.5'}}>
                            <input  id="input_firstname" ref="firstname" name="firstname" type="text" defaultValue={this.props.user.firstname} required/>
                            <label  className="active" htmlFor="input_firstname">First name</label>
                        </div>
                        <div className="input-field col s6" style={{lineHeight:'1.5'}}>
                            <input  id="input_lastname" ref="lastname" name="lastname" type="text" defaultValue={this.props.user.lastname} required/>
                            <label  className="active" htmlFor="input_lastname">Last name</label>
                        </div>
                      <div className="input-field col s12" style={{lineHeight:'1.5'}}>
                        <select multiple  ref="select_settings_roles" id="select_settings_roles" required>
                        <option value="" disabled>Choose your role(s)</option>
                          {
                            Object.entries(common.ROLES).map( ([key, value]) => {
                              return <option name="roles" value={key} id={'settings_role_'+key} key={key}>{value.name}</option>
                            })
                          }
                        </select>
                        <label>Role(s)</label>
                      </div>
                        <div className="input-field col s6" style={{lineHeight:'1.5'}}>
                              <input id="input_email" ref="email" name="email" type="email"  autoComplete="username email" defaultValue={this.props.user.email} required/>
                              <label className="active" htmlFor="input_email">Email</label>
                        </div>
                        <div className="input-field col s6" style={{lineHeight:'1.5'}}>
                              <input id="input_password" ref="password" type="password" name="password" autoComplete="current-password" required/>
                              <label className="active" htmlFor="input_password">New Password</label>
                        </div>
                     </div>
                     <div className="row">
                      { this.state.pending ?
                        <div className="col s12 center">
                         <div className="preloader-wrapper small active center">
                            <div className="spinner-layer">
                              <div className="circle-clipper left">
                                <div className="circle"></div>
                              </div><div className="gap-patch">
                                <div className="circle"></div>
                              </div><div className="circle-clipper right">
                                <div className="circle"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        : ''
                        }

                        { this.state.error ?
                            <div className="col s12 center">
                                <h6 className='rezbuild-text'>{this.state.error}</h6>
                            </div>
                             : ''
                        }
                      <div className="input-field col s6 center">
                          <button className="btn waves-effect waves-light" type="submit">SUBMIT<i className="material-icons right" style={{lineHeight:'1.5'}}>send</i></button>
                      </div>
                      <div className="input-field col s6 center">
                          <a className="btn waves-effect waves-light rezbuild-text white" href='#!' onClick={this.cancel}><i className="material-icons left" style={{lineHeight:'1.5'}}>cancel</i>CANCEL</a>
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

const SettingsForm = props => (
  <SocketContext.Consumer>
  { (context) => <SettingsFormCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default SettingsForm