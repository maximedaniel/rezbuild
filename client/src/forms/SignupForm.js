import React, { Component } from 'react'
import logo from '../ressources/img/jpg/logo.jpg'
import {Checkbox, Row, Input, Col, Preloader, Button} from 'react-materialize'
//import $ from 'jquery'
//import M from "materialize-css/dist/js/materialize.js";
import axios from 'axios'
import {browserHistory} from 'react-router'

axios.defaults.withCredentials = true

var $ = window.$

class SignupForm extends Component {

  constructor(props){
   super(props);
   this.handleSubmit = this.handleSubmit.bind(this);
   this.state = {error : false, pending : false}
  }

  componentDidMount() {
      /*$(document).ready(function() {
        M.FormSelect.init($('#roles'), {});
      });*/
  }

  handleSubmit(event){
   event.preventDefault();
   this.setState({error : false, pending : false})
   axios.post('/api/signup', {
        username : this.refs.email.value,
        password : this.refs.password.value,
        firstname : this.refs.firstname.value,
        lastname : this.refs.lastname.value,
        roles : $("input[name='roles']:checked").map(function() {return $(this).val();}).get(),
   })
    .then(res => {
        this.setState({error : false, pending : false})
        browserHistory.push('/')
    })
    .catch(err => {
        console.log(err)
        if(err && err.response && err.response.data){
            this.setState({error : err.response.data, pending : false});
        } else {
            this.setState({error : 'Network error', pending : false});
        }
    });

  };

  render() {

    return (
    <div className="row" style={{paddingTop:'8vh'}}>
          <div className="col push-l4 l4 push-m3 m6 push-s1 s10 center white" style={{padding:'0rem', fontSize:'0'}}>
              <div className="col s12 center rezbuild">
                <img src={logo} alt='logo' style={{maxHeight:'4rem'}} />
              </div>
          <form className="col s12" onSubmit={this.handleSubmit}>
                    <div className="input-field col s12">
                        <input  id="input_firstname" ref="firstname" name="firstname" type="text" required/>
                        <label htmlFor="input_name">First name</label>
                    </div>
                    <div className="input-field col s12">
                        <input  id="input_lastname" ref="lastname" name="lastname" type="text" required/>
                        <label htmlFor="input_name">Last name</label>
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
                      </div><div class="gap-patch">
                        <div className="circle"></div>
                      </div><div class="circle-clipper right">
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
                          <button className="btn waves-effect waves-light" type="submit">SIGN UP</button>
                    </div>
              </form>
          </div>
    </div>
    );
 }
}

export default SignupForm;
