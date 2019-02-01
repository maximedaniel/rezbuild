import React, { Component } from 'react'
import logo from './ressources/img/jpg/logo.jpg'
import $ from 'jquery'
import M from "materialize-css/dist/js/materialize.js";
import axios from 'axios'
import {browserHistory} from 'react-router'

axios.defaults.withCredentials = true

class Signup extends Component {

  constructor(props){
   super(props);
   this.handleSubmit = this.handleSubmit.bind(this);
   this.state = {error : false, pending : false}
  }

  componentDidMount() {
    let selects = $('select');
    M.FormSelect.init(selects, {});
  }

  handleSubmit(event){
   event.preventDefault();
   this.state = {error : false, pending : false}
   axios.post('http://localhost:3001/signup', {
        username : this.refs.email.value,
        password : this.refs.password.value,
        name : this.refs.name.value + '|' + $('#roles').val().join()
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
                        <input  id="input_name" ref="name" name="name" type="text" required/>
                        <label htmlFor="input_name">Name</label>
                    </div>
                     <div className="input-field col s12">
                        <select multiple required ref="roles" id='roles'>
                          <option value="Customer">Customer</option>
                          <option value="Designer">Designer</option>
                          <option value="Analyst">Analyst</option>
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

export default Signup;
