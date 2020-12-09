/**
 * @class SigninForm
 * @extends Component
 * @description Create the sign in form
 */

import React, { Component } from 'react'
import {browserHistory} from 'react-router'
import SocketContext from '../SocketContext'

var $ = window.$

const SIGNIN_ACTIONS = Object.freeze({
  signin: 'signin',
  resetpassword: 'resetpassword',
  confirmation: 'confirmation',
  newpassword: 'newpassword'
});

class SigninFormCore extends Component {

  constructor(props){
   super(props);
   this.submit = this.submit.bind(this);
   this.state = {error : false, msg : false, pending : false}

   this.refAction = React.createRef();
   this.refEmail = React.createRef();
   this.refPassword = React.createRef();
   this.refNewpassword1 = React.createRef();
   this.refNewpassword2 = React.createRef();
   this.refToken = React.createRef();
  }

  componentDidMount() {
     $(document).ready(function() {
      $('.tooltipped').tooltip({delay:0, html:true});
        
     });
  }
  componentWillUnmount(){
    $('.tooltipped').tooltip('remove');
  }

   // Sign in the user
  submit(event){
    event.preventDefault();
    this.setState({error : false, msg : false, pending : true}, () => {

      console.info("ACTION " + this.refAction.current.value);
      // signin
      if (this.refAction.current.value === SIGNIN_ACTIONS.signin) {
        this.props.socket.emit('/api/signin', window.location.host, this.refEmail.current.value, this.refPassword.current.value, res => {
          if (res.user) {
            if (this.props.params._id) {
              var filter = {_id: this.props.params._id}
              var update = {"$push" : {users : res.user._id}}
              this.props.socket.emit('/api/project/update', filter, update, res => {
                if (res.projects) {
                  this.setState({error : false, pending : false}, () => { browserHistory.push('/') })
                }
                if (res.error) {
                  this.setState({error : res.error, pending : false});
                }
              });
            }
            else {
              this.setState({error : null, pending : false}, () => { browserHistory.push('/') });
            }
          }
          if(res.error) {
            this.setState({error : res.error, pending : false});
          }
        });
      }

      else if (this.refAction.current.value == SIGNIN_ACTIONS.confirmation) {
        this.props.socket.emit('/api/auth/confirmation', window.location.host, this.refEmail.current.value, this.refToken.current.value, res => {
          this.setState({error : res.error, msg : res.msg, pending : false});
      });      
    }

      else if (this.refAction.current.value == SIGNIN_ACTIONS.resetpassword) {
        this.props.socket.emit('/api/auth/resetpassword', window.location.host, this.refEmail.current.value, res => {
            this.setState({error : res.error, msg : res.msg, pending : false});
        });      
      }

      else if (this.refAction.current.value == SIGNIN_ACTIONS.newpassword) {
        this.props.socket.emit('/api/auth/newpassword', this.props.location.query.token, this.refNewpassword1.current.value, this.refNewpassword2.current.value, res => {
          this.setState({error : res.error, msg : res.msg, pending : false});
        });      
      }

    });
  }

  redirectMainSignin = () => {
    this.setState({error : false, msg : false, pending : false}, () => {
      browserHistory.push('/signin');
    });
  }

  render() {
    return (
    <div className="row" style={{paddingTop:'25vh'}}>
      <div className="col push-l4 l4 push-m3 m6 push-s1 s10 center white z-depth-1" style={{padding:'0rem', fontSize:'0'}}>
        <div className="col s12 rezbuild white-text">
          <div className="col s6 left-align">
          { (!this.props.location.query.action) ? <h5 className="header">Sign in</h5> : '' } 
          { (this.props.location.query.action === SIGNIN_ACTIONS.confirmation) ? <h5 className="header">Verify account</h5> : '' } 
          { (this.props.location.query.action === SIGNIN_ACTIONS.resetpassword || this.props.location.query.action === SIGNIN_ACTIONS.newpassword) ? <h5 className="header">Reset password</h5> : '' }

          </div>
          <div className="col s6 right-align">
            <img src="/img/jpg/logo.jpg" alt='logo' style={{maxHeight:'4rem'}} />
          </div>
        </div> 
        <form className="col s12" onSubmit={this.submit} lang="en">
          <input type="hidden" id="action" name="action" value={this.props.location.query.action ? this.props.location.query.action : "signin"} ref={this.refAction}/>
          { this.props.location.query.token ?
            <input type="hidden" id="token" name="token" value={this.props.location.query.token} ref={this.refToken}/>
            : ''
          }

          { this.props.location.query.action !== SIGNIN_ACTIONS.newpassword ?
            <div className="input-field col s12">
              <input id="input_email" name='email' ref={this.refEmail} type="email" autoComplete="username email" required/>
              <label htmlFor="input_email">Email</label>
            </div>
            : ''
          }

          { (!this.props.location.query.action) ?
            <div className="input-field col s12">
              <input id="input_password" name='password' ref={this.refPassword} type="password" autoComplete="current-password" required/>
              <label htmlFor="input_password">Password</label>
            </div>
            : ''
          }

          { this.props.location.query.action === SIGNIN_ACTIONS.newpassword ?
            <div className="input-field col s12">
              <input id="input_password1" name='newpassword1' ref={this.refNewpassword1} type="password" required/>
              <label htmlFor="input_password">Password</label>
            </div>
            : ''
          }

          { this.props.location.query.action === SIGNIN_ACTIONS.newpassword ?
            <div className="input-field col s12">
              <input id="input_password2" name='newpassword2' ref={this.refNewpassword2} type="password" required/>
              <label htmlFor="input_password2">Password confirmation</label>
            </div>
            : ''
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

          { this.state.error ?
            <div className="row">
              <div className="col s12">
                  <h6 className='rezbuild-text'>{this.state.error}</h6>
              </div>
            </div>
            : ''
          }
          { this.state.msg ?
            <div className="row">
              <div className="col s12">
                  <h6 className='rezbuild-text'>{this.state.msg}</h6>
              </div>
            </div>
            : ''
          }
          <div className="row">
            <div className="col s6">
              <button className="btn waves-effect waves-light">  SUBMIT  <i className="material-icons right">send</i></button>
            </div>
            { (!this.props.location.query.action) ? 
              <div className="col s6">
                <button className="btn waves-effect waves-light white rezbuild-text" onClick={() => browserHistory.push( ((this.props.params._id) ? ('/' + this.props.params._id):'') +'/signup')}> <i className="material-icons left">person_add</i> SIGN UP</button>
              </div>
              : ''
            }
            { (this.props.location.query.action && this.props.location.query.action != SIGNIN_ACTIONS.signin && this.state.error) ? 
              <div className="col s6">
               <button className="btn waves-effect waves-light white rezbuild-text" onClick={this.redirectMainSignin}><i class="material-icons left">cancel</i> CANCEL</button>
              </div>
              : ''    
            }
            { (this.props.location.query.action && this.props.location.query.action != SIGNIN_ACTIONS.signin && this.state.msg) ? 
              <div className="col s6">
               <button className="btn waves-effect waves-light white rezbuild-text" onClick={this.redirectMainSignin}><i class="material-icons left">account_box</i>SIGN IN</button>
              </div>
              : ''    
            }
          </div>

          { (!this.props.location.query.action || this.props.location.query.action === SIGNIN_ACTIONS.signin) ? 
            <div className="row">
              <div className="col s12">
                <h6 className='rezbuild-text'><a href="/signin?action=resetpassword">Reset my password</a></h6>
              </div>
            </div>
            : ''
          }
        </form>
      </div>
    </div>
    );
  }
}
const SigninForm = props => (
  <SocketContext.Consumer>
  { (context) => <SigninFormCore {...props} host={context.host} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default SigninForm