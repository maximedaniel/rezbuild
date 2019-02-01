import React, { Component } from 'react'
import logo from './ressources/img/jpg/logo.jpg'
import $ from 'jquery'
import M from "materialize-css/dist/js/materialize.js"
import axios from 'axios'
import {browserHistory} from 'react-router'

axios.defaults.withCredentials = true

class Navbar extends Component {
  // Initialize the state

  constructor(props){
    super(props);
    this.handleSignout = this.handleSignout.bind(this);
    this.state = {user : null, error : false, pending : false}
  }

  componentDidMount() {

    this.setState({user : null, error : false, pending : false})

    axios.get('http://localhost:3001/api/user')
    .then(res => {
        this.setState({user : res.data.user, error : false, pending : false})
        $("#roles").val(this.state.user.name.split('|')[1].split(','));
        let elem = $('#slide-out');
        M.Sidenav.init(elem, {});
        let selects = $('select');
        M.FormSelect.init(selects, {});
        let modals = $('.modal');
        M.Modal.init(modals, {});
        M.updateTextFields();
    })
    .catch(err => {
       //console.log(err)
        if(err && err.response && err.response.data){
            this.setState({user : null, error : err.response.data, pending : false});
        } else {
            this.setState({user : null, error : 'Network error', pending : false});
        }
        browserHistory.push('/signin')
    });
  }

  componentWillUnmount() {
  }

  handleSignout(event){
   event.preventDefault();
   M.Sidenav.getInstance($('#slide-out')).close()
   this.setState({user : null, error : false, pending : true})
   axios.get('http://localhost:3001/signout')
       .then(res => {
               this.setState({user : null, error : false, pending : false})
               browserHistory.push('/signin')
       })
       .catch(err => {
               this.setState({user : null, error : false, pending : false})
               browserHistory.push('/signin')
       });
  };

  render() {

    return (
           <nav>
              { this.state.user ?
              <div>
              <ul id="slide-out" className="sidenav">
                <li className="row rezbuild center" style={{lineHeight:'30px'}}>
                    <div className="col s12"> <i className="material-icons" style={{fontSize:'4rem'}}>account_circle</i></div>
                    <div className="col s12"><strong>{this.state.user.name.split('|')[0]} ({this.state.user.name.split('|')[1]})</strong></div>
                    <div className="col s12">{this.state.user.username}</div>
                </li>
                <li><a href="#!" onClick={this.handleSignout}><i className="material-icons">settings</i>Sign out</a></li>

              </ul>
            <div className="nav-wrapper">
              <a href="#!" data-target="slide-out" className="sidenav-trigger" style={{padding:'0', display:'inline-flex'}}> <i className="material-icons">menu</i></a>
              <a href="#!"><img  className="brand-logo right" src={logo} alt='logo' style={{maxHeight:'4rem'}} /></a>
              <div className="col s12 left">
                <a href="#!" className="breadcrumb">Projects</a>
              </div>
            </div>
           </div> : ''}
          </nav>
        );
    }
}
export default Navbar;