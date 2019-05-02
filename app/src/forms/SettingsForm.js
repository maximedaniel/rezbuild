import React, { Component } from 'react'
import SocketContext from '../SocketContext'

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
    console.log(this.props.user.roles)
    this.props.user.roles.map((role, index) => $("#role_"+role.toLowerCase()).prop( "selected", true ))
    $(document).ready(function() {
      $('#select_settings_roles').material_select();
      Materialize.updateTextFields();
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
            console.log(res)
            if (res.users) {
                this.setState({error : false, pending : false}, () =>{
                    $('#modal_settings').modal('close');
                    this.props.update()
                })
            }
            if(res.error){
                this.setState({error : res.error, pending : false});
            }
        });

        /*var create = {name : this.refs.name.value, owner: "token", users: ["token"]}
        this.props.socket.emit('/api/project/create', create, res => {
            if (res.projects){
                console.log(res.projects)
                var create = {file : 'model.ifc', project: res.projects._id}
                this.props.socket.emit('/api/revision/create', create, res => {
                    if(res.revisions) {
                        console.log(res.revisions)
                        this.setState({error : false, pending : false}, () => {
                            $('#modal_createproject').modal('close');
                        })
                    }
                    if (res.error) {
                        this.setState({error : res.error, pending : false});
                    }
                });
            }
            if (res.error) {
                this.setState({error : res.error, pending : false});
            }
        });*/
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
                        <select multiple  id="select_settings_roles" required>
                          <option value="" disabled>Choose your role(s)</option>
                          <option name="roles" value="Customer" id="role_customer">Customer</option>
                          <option name="roles" value="Designer" id="role_designer">Designer</option>
                          <option name="roles" value="Analyst" id="role_analyst">Analyst</option>
                        </select>
                        <label>Role(s)</label>
                      </div>
                        <div className="input-field col s6" style={{lineHeight:'1.5'}}>
                              <input id="input_email" ref="email" name="email" type="email"  defaultValue={this.props.user.email} required/>
                              <label className="active" htmlFor="input_email">Email</label>
                        </div>
                        <div className="input-field col s6" style={{lineHeight:'1.5'}}>
                              <input id="input_password" ref="password" type="password" name="password" required/>
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
                          <button className="btn waves-effect waves-light" type="submit">SAVE</button>
                      </div>
                      <div className="input-field col s6 center">
                          <a className="btn waves-effect waves-light rezbuild-text white" href='#!' onClick={this.cancel}>CANCEL</a>
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