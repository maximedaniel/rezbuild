/**
 * @class SignupForm
 * @extends Component
 * @description Create the sign up form
 */
import React, { Component } from 'react'
import {browserHistory} from 'react-router'
import SocketContext from '../SocketContext'
import common from 'common'

var $ = window.$

class SignupFormCore extends Component {

  constructor(props){
   super(props);
   this.submit = this.submit.bind(this);
   this.state = {error : false, pending : false}
  }

  componentDidMount() {
      $(document).ready(function() {
        $('select').material_select();
        $('.tooltipped').tooltip({delay:0, html:true});
      });
  }
 componentWillUnmount(){
   $('.tooltipped').tooltip('remove');
 }

 
   // Sign up the user
  submit(event){
   event.preventDefault();
   this.setState({error : false, pending : true}, () => {
        var create = {
            email : this.refs.email.value,
            password : this.refs.password.value,
            firstname : this.refs.firstname.value.charAt(0).toUpperCase() + this.refs.firstname.value.toLowerCase().slice(1),
            lastname : this.refs.lastname.value.toUpperCase(),
            roles : $("#select_signup_roles  option:selected").map(function() {return $(this).val();}).get(),
        }
        this.props.socket.emit('/api/signup', create, res => {
            if (res.user) {
                this.setState({error : false, pending : false}, () =>{
                    browserHistory.push(((this.props.params._id) ? ('/' + this.props.params._id):'') +'/signin')
                })
            }
            if(res.error){
                this.setState({user : null, error : res.error, pending : false});
            }
        });
   })
  };

  render() {

    return (
    <div className="row" style={{paddingTop:'8vh'}}>
          <div className="col push-l4 l4 push-m3 m6 push-s1 s10 center white z-depth-1" style={{padding:'0rem', fontSize:'0'}}>
          <div className="col s12 rezbuild white-text">
                <div className="col s6 left-align">
                  <h5 className="header">Sign up</h5>
                </div>
                <div className="col s6 right-align">
                <img src="/img/jpg/logo.jpg" alt='logo' style={{maxHeight:'4rem'}} />
                </div>
              </div> 
          <form className="col s12" onSubmit={this.submit} lang="en">
                    <div className="input-field col s12">
                        <input  id="input_firstname" ref="firstname" name="firstname" type="text" required/>
                        <label htmlFor="input_firstname">First name</label>
                    </div>
                    <div className="input-field col s12">
                        <input  id="input_lastname" ref="lastname" name="lastname" type="text" required/>
                        <label htmlFor="input_lastname">Last name</label>
                    </div>
                      <div className="input-field col s12">
                        <select multiple required defaultValue={[ Object.keys(common.ROLES)[0]]} id="select_signup_roles" ref="select_signup_roles" >
                          <option value="" disabled>Choose your role(s)</option>
                          {
                            Object.entries(common.ROLES).map( ([key, value]) => {
                              return <option name="roles" value={key} id={'signup_role_'+key} key={key}>{value.name}</option>
                            })
                          }
                        </select>
                        <label>Role(s)</label>
                      </div>
                    <div className="input-field col s12">
                          <input id="input_email" ref="email" name="email" type="email"  required/>
                          <label htmlFor="input_email">Email</label>
                    </div>
                    <div className="input-field col s12">
                          <input id="input_password" ref="password" type="password" name="password" required/>
                          <label htmlFor="input_password">Password</label>
                    </div>
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

                { this.state.error ?
                <div className="row">
                    <div className="col s12">
                        <h6 className='rezbuild-text'>{this.state.error}</h6>
                    </div>
                </div> : ''
                }

                <div className="row">
                    <div className="col s6">
                          <button className="btn waves-effect waves-light" type="submit">SUBMIT  <i class="material-icons right">send</i></button>
                    </div>
                  <div className="col s6">
                            <button className="btn waves-effect waves-light white rezbuild-text" onClick={() => browserHistory.push( ((this.props.params._id) ? ('/' + this.props.params._id):'') +'/signin')}>  <i class="material-icons left">cancel</i> CANCEL</button>
                  </div>
                </div>
              </form>
          </div>
    </div>
    );
 }
}

const SignupForm = props => (
  <SocketContext.Consumer>
  { (context) => <SignupFormCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default SignupForm
