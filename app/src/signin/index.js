import React, { Component } from 'react'
import axios from 'axios'
import {browserHistory} from 'react-router'
import SocketContext from '../SocketContext'

axios.defaults.withCredentials = true


class SigninFormCore extends Component {

  constructor(props){
   super(props);
   this.handleSubmit = this.handleSubmit.bind(this);
   this.state = {error : false, pending : false}
  }

  componentDidMount() {
    /* $(document).ready(function() {
        M.AutoInit()
     });*/
  }

  handleSubmit(event){
   event.preventDefault();
   this.setState({error : false, pending : true}, () => {
    this.props.socket.emit('/api/signin', this.refs.email.value, this.refs.password.value, res => {
            if (res.user) {
                if (this.props.params._id){
                    var filter = {_id: this.props.params._id}
                    var update = {"$push" : {users : res.user._id}}
                    this.props.socket.emit('/api/project/update', filter, update, res => {
                        if (res.projects) {
                            this.setState({error : false, pending : false}, () => {
                                browserHistory.push('/')
                            })
                        }
                        if (res.error) {
                            this.setState({error : res.error, pending : false});
                        }
                    });
                }
                else {
                    this.setState({error : null, pending : false}, () => {
                        browserHistory.push('/')
                    });
                }
            }
            if(res.error){
                this.setState({error : res.error, pending : false});
            }
    });
  });
  }

  render() {
     return (
    <div className="row" style={{paddingTop:'25vh'}}>
          <div className="col push-l4 l4 push-m3 m6 push-s1 s10 center white z-depth-1" style={{padding:'0rem', fontSize:'0'}}>
              <div className="col s12 center rezbuild">
                <img src="/img/jpg/logo.jpg" alt='logo' style={{maxHeight:'4rem'}} />
              </div>
             <form className="col s12" onSubmit={this.handleSubmit}>
                <div className="input-field col s12">
                      <input id="input_email" name='email' ref="email" type="email" required/>
                      <label htmlFor="input_email">Email</label>
                </div>
                <div className="input-field col s12">
                      <input id="input_password" name='password' ref="password" type="password" required/>
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
                          <button className="btn waves-effect waves-light" type="submit">SIGN IN</button>
                    </div>
                    <div className="col s6">
                          <button className="btn waves-effect waves-light white rezbuild-text" onClick={() => browserHistory.push( ((this.props.params._id) ? ('/' + this.props.params._id):'') +'/signup')}>SIGN UP</button>
                          </div>
                </div>
          </form >
          </div>
    </div>
    );
  }
}
const SigninForm = props => (
  <SocketContext.Consumer>
  { (context) => <SigninFormCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default SigninForm