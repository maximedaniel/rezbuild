import React, { Component } from 'react'
import logo from './ressources/img/jpg/logo.jpg'
import {Link} from 'react-router'
import SettingsForm from './forms/SettingsForm'
//import $ from 'jquery'
//import M from "materialize-css/dist/js/materialize.js"
import {browserHistory} from 'react-router'
import SocketContext from './SocketContext'
import axios from 'axios'

axios.defaults.withCredentials = true

var $ = window.$

class NavbarCore extends Component {
  // Initialize the state

  constructor(props){
    super(props);
    this.handleSignout = this.handleSignout.bind(this);
    this.state = {error : false, pending : false}
  }

  componentDidMount() {
    $(".button-collapse").sideNav();
  }

  componentWillUnmount() {
  }


  handleSignout(event){
   event.preventDefault();
   //M.Sidenav.getInstance($('#slide-out')).close()
   this.setState({error : false, pending : true}, () => {
       this.props.socket.emit('/api/signout', {});
       this.props.socket.on('/api/signout', res => {
            if (res.signedOutUser) {
                this.setState({error : null, pending : false}, () => {
                    $('.button-collapse').sideNav('hide')
                    browserHistory.push('/signin')
                });
            }
       });
    });
  };

  render() {
    let pathComponent;
    pathComponent = this.props.path.map((level, index) =>

                <Link to={ (index == 0) ? '/' : '#!'} className="breadcrumb" key={index}>{level}</Link>
    );

    return (
           <nav>
              <div>
              <ul id="slide-out" className="side-nav">
                <li className="row rezbuild center" style={{lineHeight:'30px'}}>
                    <div className="col s12"> <i className="material-icons" style={{fontSize:'4rem'}}>account_circle</i></div>
                    <div className="col s12"><strong>{this.props.user.firstname} {this.props.user.lastname} ({this.props.user.roles.join()})</strong></div>
                    <div className="col s12">{this.props.user.username}</div>
                </li>

                <li><a className="modal-trigger" href="#modal_settings" ><i className="material-icons">settings</i>Settings</a></li>
                <li><a href="#!" onClick={this.handleSignout}><i className="material-icons">arrow_back</i>Sign out</a></li>

              </ul>
            <div className="nav-wrapper">
              <a href="#!" data-activates="slide-out" className="button-collapse" style={{padding:'0', display:'inline-flex'}} onClick={() => $('.button-collapse').sideNav('show')}> <i className="material-icons">menu</i></a>
              <a href="#!"><img  className="brand-logo right" src={logo} alt='logo' style={{maxHeight:'4rem'}} /></a>
              <div className="col s12 left">
                {pathComponent}
              </div>
            </div>
           </div>
            <SettingsForm user={this.props.user}/>
          </nav>
        );
    }
}
// <li><a href="#modal_settings" className="modal-trigger"><i className="material-icons">settings</i>Settings</a></li>
const Navbar = props => (
  <SocketContext.Consumer>
  {socket => <NavbarCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default Navbar;